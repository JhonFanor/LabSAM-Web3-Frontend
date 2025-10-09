import React, { useState, useEffect } from "react";
import { DocumentationGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import { DocumentationUpdateRequest } from "../../dtos/requests";
import JoditEditor from "jodit-react";
import { CreateBankOfResumeSubtopic, DeleteBankOfResumeSubtopic, getAllTopics, getDocumentationById, updateDocumentation, uploadDocumentFile } from "../../api";
import { TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector, ButtonClose } from "../../components";
import "./UpdateDocumentation.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";

interface UpdateDocumentationProps {
	onClose: () => void;
    documentationGetResponse: DocumentationGetResponse;
    onUpdated?: (updated: DocumentationGetResponse) => void;
}

export const UpdateDocumentation: React.FC<UpdateDocumentationProps> = ({ onClose, documentationGetResponse, onUpdated }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
	const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [documentError, setDocumentError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);  

	const [documentation, setDocumentation] = useState<DocumentationUpdateRequest>({
		title: documentationGetResponse.title,
		author: documentationGetResponse.author,
		description: documentationGetResponse.description,
		link: documentationGetResponse.link,
	});

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: documentationGetResponse.subtopics.map((s) => s.id),
    });
    
    const originalSubtopicIds = documentationGetResponse.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap(topic => topic.subtopics);

	useEffect(() => {
		getAllTopics(setTopics);
	}, []);

    const handleReset = () => {
        setDocumentation({
            title: documentationGetResponse.title,
            author: documentationGetResponse.author,
            description: documentationGetResponse.description,
            link: documentationGetResponse.link,
        });
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedDocumentFile(null);
        setSelectedTopic(null);
        setDocumentUploaderKey(Date.now());
        setDescriptionError(false);
        setDocumentError(false);
        setSubtopicError(false);
    };
	
	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);
		setDescriptionError(false);
        setDocumentError(false);
        setSubtopicError(false);

		if (!documentation.description || documentation.description.trim() === "" || documentation.description === "<p></p>") {
            setDescriptionError(true);
            setUploading(false);
            return;
        }
        
        if (!documentation.link && !selectedDocumentFile) {
            setDocumentError(true);
            setUploading(false);
            return;
        }

		if (subtopicIds.subtopic_ids.length === 0) {
            setUploading(false);
            setSubtopicError(true);
            return;
		}

		try {
			let documentPath = documentation.link;
			if (selectedDocumentFile) {
				try {
					documentPath = await uploadDocumentFile(selectedDocumentFile, "documentation");
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir documento:" + uploadError);
					return;
				}
			}

			const updateDoc: DocumentationUpdateRequest = {
				...documentation,
				link: documentPath,
			}

            const hasChanged =
                updateDoc.title !== documentationGetResponse.title ||
                updateDoc.author !== documentationGetResponse.author ||
                updateDoc.description !== documentationGetResponse.description ||
                updateDoc.link !== documentationGetResponse.link;

            const currentSet = new Set(subtopicIds.subtopic_ids);
            const originalSet = new Set(originalSubtopicIds);

            const added = subtopicIds.subtopic_ids.filter(id => !originalSet.has(id));
            const removed = originalSubtopicIds.filter(id => !currentSet.has(id));

            if (added.length > 0) {
                await CreateBankOfResumeSubtopic(documentationGetResponse.id, { subtopic_ids: added });
            }

            if (removed.length > 0) {
                await DeleteBankOfResumeSubtopic(documentationGetResponse.id, { subtopic_ids: removed });
            }

            const subtopicsChanged = added.length > 0 || removed.length > 0;

            if (hasChanged || subtopicsChanged) {
                await updateDocumentation(documentationGetResponse.id, updateDoc);
                const updatedDocumentation = await getDocumentationById(documentationGetResponse.id);
                if (onUpdated) {
                    onUpdated(updatedDocumentation);
                }
            }	    

            setSuccessMessage("Documentación actualizada con éxito.");
		} catch(error){
            setSuccessMessage("Error al actualizar la documentación: " + error);
		} finally {
			setUploading(false);
		}
	};

    useEffect(() => {
        if (successMessage) {
            const timeout = setTimeout(() => setSuccessMessage(null), 10000); 
            return () => clearTimeout(timeout);
        }
    }, [successMessage]);

	return (
		<div className="update-documentation">
			<ButtonClose onClick={onClose} />
			<h2 className="update-documentation__title">Actualizar Documentación</h2>
			{successMessage && (
                <div className="success-message">
                	{successMessage}
                </div>
            )}
            <form className="update-documentation__form" onSubmit={handleUpdate}>
                <div className="form-group">
					<label>Título*</label>
                    <input 
						type="text" 
						name="title" 
						placeholder="Título" 
						value={documentation.title} 
						onChange={(e) => setDocumentation({ ...documentation, title: e.target.value })} 
						required 
					/>
                </div>
				
				<div className="form-group">
					<label>Autor*</label>
					<input 
						type="text" 
						name="author" 
						placeholder="Autor" 
						value={documentation.author} 
						onChange={(e) => setDocumentation({ ...documentation, author: e.target.value })} 
						required 
					/>
				</div>
                
                <div className="form-group">
					<label>Descripción*</label>
					{descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
                    <JoditEditor 
						value={documentation.description} 
						onChange={(content) => setDocumentation({ ...documentation, description: content })} 
						className="jodit-container"
					/>
                </div>
                
                <div className="form-group">
					<label>Documento de la documentación*</label>	
					{documentError && (
                        <span className="form-error">El documento es obligatorio.</span>
                    )}
                    <DocumentInputSelector 
						value={documentation.link || ""} 
						onChange={(document) => setDocumentation({...documentation, link: document})} 
						onFileSelected={setSelectedDocumentFile} 
						urlLabel="📎 URL de la documentacion" 
						fileLabel="📄 Subir la documentación" 
						documentUploaderKey={documentUploaderKey} 
						resetKey={documentUploaderKey}
					/>
                </div>
				
				{subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
				
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector 
					topics={topics} 
					selectedTopic={selectedTopic} 
					data={subtopicIds} 
					setData={setSubtopicIds} 
					subtopicsKey="subtopic_ids" 
				/>
				<SelectedSubtopics 
					data={subtopicIds} 
					setData={setSubtopicIds} 
					subtopicsKey="subtopic_ids" 
					subtopicsList={allSubtopics} 
				/>
				
                <div className="update-documentation__buttons">
                    <button type="submit" disabled={uploading}>
                        {uploading ? "Actualizando..." : "Actualizar Documentación"}
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
			</form>
		</div>
	);
};