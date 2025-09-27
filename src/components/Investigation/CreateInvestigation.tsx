import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { InvestigationCreateRequest } from "../../dtos/requests/Investigation";
import { createInvestigation, getAllTopics, uploadDocumentFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector } from "../../components";
import "./CreateInvestigation.css";

interface CreateInvestigationProps {
	onClose: () => void;
}

export const CreateInvestigation: React.FC<CreateInvestigationProps> = ({ onClose }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
	const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [documentError, setDocumentError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);	

	const [investigation, setInvestigation] = useState<InvestigationCreateRequest>({
		title: "",
		description: "",
		date: "",
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

		if (!investigation.description || investigation.description.trim() === "" || investigation.description === "<p></p>") {
            setDescriptionError(true);
            setUploading(false);
            return;
        }
        
        if (!investigation.link && !selectedDocumentFile) {
            setDocumentError(true);
            setUploading(false);
            return;
        }

        if (investigation.subtopic_ids.length === 0) {
            setUploading(false);
            setSubtopicError(true);
            return;
        }

		try {
			let documentPath = investigation.link;

			if (selectedDocumentFile) {
				try {
					documentPath = await uploadDocumentFile(selectedDocumentFile, "investigation")
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir documento:"+uploadError);
					return;
				}
			}

			const investigationToSend: InvestigationCreateRequest = {
				...investigation,
				link: documentPath,
				date: investigation ? new Date(investigation.date).toISOString() : "",
			};

			console.log(investigationToSend);

			await createInvestigation(investigationToSend);

			setSelectedTopic(null);
			setUploading(false);
			setSelectedDocumentFile(null);
			setDocumentUploaderKey(Date.now());

			setInvestigation({
				title: "",
				description: "",
				date: "",
				link: "",
				subtopic_ids: [],
			});

			setSuccessMessage("Investigación creada exitosamente.");
			return ;
		} catch(error){
			setSuccessMessage("Error al guardar la investigación:"+error);
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
		<div className="create-investigation">
			<ButtonClose onClick={onClose}/>
			<h2 className="create-investigation__title">Crear Investigación</h2>
			{successMessage && (
				<div className="success-message">
					{successMessage}
				</div>
			)}
			<form className="create-investigation__form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Título*</label>
					<input type="text" name="title" placeholder="Título" value={investigation.title} onChange={(e) => setInvestigation({ ...investigation, title: e.target.value })} required />
				</div>
				<div className="form-group">
					<label>Descripción*</label>
					{descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
					<JoditEditor value={investigation.description} onChange={(content) => setInvestigation({ ...investigation, description: content })} className="jodit-container"/>
				</div>
				<div className="form-group">	
					<label>Fecha*</label>
					<input type="date" name="date" placeholder="Fecha" value={investigation.date} onChange={(e) => setInvestigation({ ...investigation, date: e.target.value })} required />
				</div>
				<div className="form-group">
					<label>Documento de investigación*</label>			
					{documentError && (
                        <span className="form-error">El documento de la investigación es obligatoria.</span>
                    )}	
					<DocumentInputSelector value={investigation.link} onChange={(document) => setInvestigation({...investigation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la investigación" fileLabel="📄 Subir la investigación" documentUploaderKey={documentUploaderKey} />
				</div>
				{ subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={investigation} setData={setInvestigation} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={investigation} setData={setInvestigation} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
					
				<button className="create-investigation__submit" type="submit"  disabled={uploading} >
					{uploading ? "Guardando..." : "Guardar Investigación"}
				</button>
			</form>
		</div>
	);
};
