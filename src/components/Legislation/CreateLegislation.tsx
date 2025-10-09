import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { LegislationCreateRequest } from "../../dtos/requests";
import { createLegislation, getAllTopics, uploadDocumentFile, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector, ImageInputSelector } from "../../components";
import "./CreateLegislation.css";
import { getAllTypeOfLaw } from "../../api/TypeOfLaw";
import { TypeOfLawResponse } from "../../dtos/responses/TypeOfLaw";

interface CreateLegislationProps {
	onClose: () => void;
}

export const CreateLegislation: React.FC<CreateLegislationProps> = ({ onClose }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
	const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
	const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [documentError, setDocumentError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);
	const [typesOfLaw, setTypesOfLaw] = useState<TypeOfLawResponse[]>([]);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [legislation, setLegislation] = useState<LegislationCreateRequest>({
		title: "",
		description: "",
		logo: "",
		date: "",
		link: "",
		type_of_law_id: 0,
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
			let imagePath = legislation.logo;

			if (selectedImageFile) {
				try {
					imagePath = await uploadImageFile(selectedImageFile, "legislation");
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir imagen:"+uploadError);
				return;
				}
			}

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
				logo: imagePath,
				link: documentPath,
				date: legislation.date ? new Date(legislation.date).toISOString() : "", 
			}

			await createLegislation(legislationToSend);
			
			setSelectedTopic(null);
			setUploading(false)
			setSelectedImageFile(null);
			setImageUploaderKey(Date.now());
			setSelectedDocumentFile(null);
			setDocumentUploaderKey(Date.now());
			
			setLegislation({
				title: "",
				description: "",
				logo: "",
				date: "",
				link: "",
				type_of_law_id: 0,
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

	useEffect(() => {
		const fetchTypes = async () => {
			try {
				const data = await getAllTypeOfLaw();
				setTypesOfLaw(data);
			} catch (error) {
				console.error("Error al obtener tipos de leyes:", error);
			}
		};
		fetchTypes();
	}, []);

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
					<label>Imagen</label>	
					<ImageInputSelector value={legislation.logo || ""} onChange={(img) => setLegislation({ ...legislation, logo: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" imageUploaderKey={imageUploaderKey} />
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
				<div className="form-group">
					<label>Fecha*</label>
					<input type="date" name="date" value={legislation.date} onChange={(e) => setLegislation({ ...legislation, date: e.target.value })} required/>
				</div>
				<div className="form-group">
					<label>Tipo de Ley*</label>
					<select
						value={legislation.type_of_law_id === 0 ? "" : legislation.type_of_law_id}
						onChange={(e) =>
							setLegislation({ ...legislation, type_of_law_id: Number(e.target.value) })
						}
						required
					>
						<option value="" disabled>Selecciona un tipo de ley</option>
						{typesOfLaw.map((type) => (
							<option key={type.id} value={type.id}>
								{type.name}
							</option>
						))}
					</select>
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