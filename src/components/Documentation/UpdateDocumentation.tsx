import React, { useState, useEffect } from "react";
import { DocumentationGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import { DocumentationUpdateRequest } from "../../dtos/requests";
import JoditEditor from "jodit-react";
import { CreateBankOfResumeSubtopic, DeleteBankOfResumeSubtopic, getAllTopics, updateDocumentation, uploadDocumentFile } from "../../api";
import { TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector, ButtonClose } from "../../components";
import "./UpdateDocumentation.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";

interface UpdateDocumentationProps {
	onClose: () => void;
    documentationGetResponse: DocumentationGetResponse;
}

export const UpdateDocumentation: React.FC<UpdateDocumentationProps> = ({ onClose, documentationGetResponse }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
	const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());

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
            }	

            onClose();
		} catch(error){
			console.error("Error al actualizar la documentación:", error);
            alert("Hubo un error al actualizar la documentación.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="update-documentation">
			<ButtonClose onClick={onClose} />
			<h2 className="update-documentation__title">Crear Documentación</h2>
			<form className="update-documentation__form" onSubmit={handleUpdate}>
				<input 
                    type="text" 
                    name="title" 
                    placeholder="Título" 
                    value={documentation.title} 
                    onChange={(e) => setDocumentation({ ...documentation, title: e.target.value })} 
                    required 
                />
				
				<JoditEditor 
                    value={documentation.description} 
                    onChange={(content) => setDocumentation({ ...documentation, description: content })} 
                    className="jodit-container"
                />
				
				<DocumentInputSelector 
                    value={documentation.link || ""} 
                    onChange={(document) => setDocumentation({...documentation, link: document})} 
                    onFileSelected={setSelectedDocumentFile} 
                    urlLabel="📎 URL de la documentacion" 
                    fileLabel="📄 Subir la documentación" 
                    documentUploaderKey={documentUploaderKey} 
                    resetKey={documentUploaderKey}
                />

				<TopicSelector 
                    topics={topics} 
                    selectedTopic={selectedTopic} 
                    setSelectedTopic={setSelectedTopic} 
                />

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
