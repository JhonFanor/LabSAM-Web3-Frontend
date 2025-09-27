import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { LegislationCreateRequest } from "../../dtos/requests";
import { createLegislation, getAllTopics, uploadDocumentFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector } from "../../components";
import "./CreateLegislation.css";

interface CreateLegislationProps {
	onClose: () => void;
}

export const CreateLegislation: React.FC<CreateLegislationProps> = ({ onClose }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
	const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [documentError, setDocumentError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [legislation, setLegislation] = useState<LegislationCreateRequest>({
		title: "",
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

		if (!legislation.description || legislation.description.trim() === "" || legislation.description === "<p></p>") {
            setDescriptionError(true);
            setUploading(false);
            return;
        }
        
        if (!legislation.link && !selectedDocumentFile) {
            setDocumentError(true);
            setUploading(false);
            return;
        }

        if (legislation.subtopic_ids.length === 0) {
            setUploading(false);
            setSubtopicError(true);
            return;
        }

		try {
			let documentPath = legislation.link;

			if (selectedDocumentFile) {
				try {
					documentPath = await uploadDocumentFile(selectedDocumentFile, "investigation")
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir documento:"+uploadError);
					return;
				}
			}

			const legislationToSend: LegislationCreateRequest = {
				...legislation,
				link: documentPath,
			}

			await createLegislation(legislationToSend);
			
			setSelectedTopic(null);
			setUploading(false)
			setSelectedDocumentFile(null);
			setDocumentUploaderKey(Date.now());
			
			setLegislation({
				title: "",
				description: "",
				link: "",
				subtopic_ids: [],
			});
			
			setSuccessMessage("Legislación creada exitosamente.");
			return ;
		} catch (error) {
			setSuccessMessage("Error al crear legislación:" + error);
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
		<div className="create-legislation">
			<ButtonClose onClick={onClose}/>
			<h2 className="create-legislation__title">Crear Legislación</h2>
			{successMessage && (
				<div className="success-message">
					{successMessage}
				</div>
			)}
			<form className="create-legislation__form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Título*</label>
					<input type="text" name="title" placeholder="Título" value={legislation.title} onChange={(e) => setLegislation({ ...legislation, title: e.target.value })} required />
				</div>
				<div className="form-group">	
					<label>Descripción*</label>
					{descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
					<JoditEditor value={legislation.description} onChange={(content) => setLegislation({ ...legislation, description: content })} className="jodit-container"/>
				</div>
				<div className="form-group">	
					<label>Documento de la legislación*</label>	
					{documentError && (
                        <span className="form-error">El documento de la legislación es obligatoria.</span>
                    )}	
					<DocumentInputSelector value={legislation.link} onChange={(document) => setLegislation({...legislation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la legislación" fileLabel="📄 Subir la legislación" documentUploaderKey={documentUploaderKey} />
				</div>
				{ subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={legislation} setData={setLegislation} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={legislation} setData={setLegislation} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
					
				<button className="create-legislation__submit" type="submit" disabled={uploading}>
					{uploading ? "Guardando..." : "Guardar Legislación"}
				</button>
			</form>
		</div>
	);
};