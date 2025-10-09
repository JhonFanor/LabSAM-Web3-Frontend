import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import { DocumentationCreateRequest } from "../../dtos/requests";
import JoditEditor from "jodit-react";
import { createDocumentation, getAllTopics, uploadDocumentFile } from "../../api";
import { TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector, ButtonClose } from "../../components";
import "./CreateDocumentation.css";

interface CreateDocumentationProps {
	onClose: () => void;
}

export const CreateDocumentation: React.FC<CreateDocumentationProps> = ({ onClose }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
	const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [documentError, setDocumentError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);	

	const [documentation, setDocumentation] = useState<DocumentationCreateRequest>({
		title: "",
		author: "",
		description: "",
		link: "",
		subtopic_ids: [] as number[],
	});

	useEffect(() => {
		getAllTopics(setTopics);
	}, []);
	
	const allSubtopics = topics.flatMap(topic => topic.subtopics);
	
	const handleSubmit = async (e: React.FormEvent) => {
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

		if (documentation.subtopic_ids.length === 0) {
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
					setSuccessMessage("Error al subir documento:"+uploadError);
					return;
				}
			}

			const documentationToSend: DocumentationCreateRequest = {
				...documentation,
				link: documentPath,
			}

			await createDocumentation(documentationToSend);
			
			setSelectedTopic(null);
			setUploading(false);
			setSelectedDocumentFile(null);
			setDocumentUploaderKey(Date.now());

			setDocumentation({
				title: "",
				author: "",
				description: "",
				link: "",
				subtopic_ids: [],
			});

			setSuccessMessage("Documentación creada exitosamente.");
			return ;
		} catch(error){
			setSuccessMessage("Error al crear documentación:" + error);
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
		<div className="create-documentation__content">
			<ButtonClose onClick={onClose} />
			<h2 className="create-documentation__title">Crear Documentación</h2>
			{successMessage && (
				<div className="success-message">
					{successMessage}
				</div>
			)}
			<form className="create-documentation__form" onSubmit={handleSubmit}>
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
                        <span className="form-error">La descripción es obligatorio.</span>
                    )}
					<JoditEditor value={documentation.description} onChange={(content) => setDocumentation({ ...documentation, description: content })} className="jodit-container"/>
				</div>
				
				<div className="form-group">
					<label>Documento de la documentación*</label>	
					{documentError && (
                        <span className="form-error">El documento es obligatoria.</span>
                    )}
					<DocumentInputSelector value={documentation.link} onChange={(document) => setDocumentation({...documentation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la documentacion" fileLabel="📄 Subir la documentación" documentUploaderKey={documentUploaderKey} />
				</div>
				
				{ subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
				
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector 
					topics={topics} 
					selectedTopic={selectedTopic} 
					data={documentation} 
					setData={setDocumentation} 
					subtopicsKey="subtopic_ids" 
				/>
				<SelectedSubtopics 
					data={documentation} 
					setData={setDocumentation} 
					subtopicsKey="subtopic_ids" 
					subtopicsList={allSubtopics} 
				/>
				
				<button className="create-documentation__submit" type="submit" disabled={uploading} >
					{uploading ? "Guardando..." : "Guardar Documentación"}
				</button>
			</form>
		</div>
	);
};