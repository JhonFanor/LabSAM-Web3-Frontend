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

    const [successMessage, setSuccessMessage] = useState<string | null>(null);  

	const [documentation, setDocumentation] = useState<DocumentationUpdateRequest>({
		title: documentationGetResponse.title,
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
        setDocumentation(documentationGetResponse);
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedDocumentFile(null);
        setSelectedTopic(null);
        setDocumentUploaderKey(Date.now());
    };
	
	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);

		try {
			let documentPath = documentation.link;
			if (selectedDocumentFile) {
				documentPath = await uploadDocumentFile(selectedDocumentFile, "documentation");
			}

			const updateDoc: DocumentationUpdateRequest = {
				...documentation,
				link: documentPath,
			}

            const hasChanged =
                updateDoc.title !== documentationGetResponse.title ||
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
                    documentationGetResponse = updatedDocumentation;
                }
            }	    

            setSuccessMessage("Documentación actualizada con éxito.");
		} catch(error){
            setSuccessMessage("Error al actualizar la documentación. Por favor, inténtalo de nuevo.");
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
			<h2 className="update-documentation__title">Crear Documentación</h2>
			{successMessage && (
                <div className="success-message">
                	{successMessage}
                </div>
            )}
            <form className="update-documentation__form" onSubmit={handleUpdate}>
                <div className="form-group">
					<label>Título</label>
                    <input type="text" name="title" placeholder="Título" value={documentation.title} onChange={(e) => setDocumentation({ ...documentation, title: e.target.value })} required />
                </div>
                <div className="form-group">
					<label>Descripción</label>
                    <JoditEditor value={documentation.description} onChange={(content) => setDocumentation({ ...documentation, description: content })} className="jodit-container"/>
                </div>
                <div className="form-group">
					<label>Documento de la documentación</label>	
                    <DocumentInputSelector value={documentation.link || ""} onChange={(document) => setDocumentation({...documentation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la documentacion" fileLabel="📄 Subir la documentación" documentUploaderKey={documentUploaderKey} resetKey={documentUploaderKey}/>
                </div>
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
				
                <div className="update-documentation__buttons">
                    <button type="submit">
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
