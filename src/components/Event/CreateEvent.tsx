import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { EventCreateRequest } from "../../dtos/requests";
import { createEvent, getAllTopics, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, ImageInputSelector, Localitation} from "../../components";
import "./CreateEvent.css";

interface CreateEventProps {
	onClose: () => void;
}

export const CreateEvent: React.FC<CreateEventProps> = ({ onClose }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
	const [imageError, setImageError] = useState<boolean>(false);
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [event, setEvent] = useState<EventCreateRequest>({
		title: "",
		image: "",
		description: "",
		link: "",
		date: "",
		localitation: undefined,
		subtopic_ids: [],
	});

	const [localitation, setLocalitation] = useState< { address: string; latitude: number; longitude: number } | undefined >(undefined);

	useEffect(() => {
		getAllTopics(setTopics);
	}, []);

	const allSubtopics = topics.flatMap((topic) => topic.subtopics);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);
		setImageError(false);
		setDescriptionError(false);
		setSubtopicError(false);

		if (!event.image && !selectedImageFile) {
            setImageError(true);
            setUploading(false);
            return;
        }

		if (!event.description || event.description.trim() === "" || event.description === "<p></p>") {
            setDescriptionError(true);
            setUploading(false);
            return;
        }

		if (event.subtopic_ids.length === 0) {
            setUploading(false);
            setSubtopicError(true);
            return;
        }

		try {

			let imagePath = event.image;
			
			if (selectedImageFile) {
				try {
					imagePath = await uploadImageFile(selectedImageFile, "event");
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir imagen:"+uploadError);
					return;
				}
			}

			const eventToSend: EventCreateRequest = {
				...event,
				image: imagePath,
				...(localitation && { localitation }),
				date: event.date ? new Date(event.date).toISOString() : "",
			};

			await createEvent(eventToSend);

			setSelectedTopic(null);
			setUploading(false);
			setSelectedImageFile(null);
			setImageUploaderKey(Date.now());

			setEvent({ 
				title: "", 
				description: "", 
				link: "", date: "", 
				image: "", 
				localitation: undefined, 
				subtopic_ids: [], 
			});
			setLocalitation(undefined);
			
			setSuccessMessage("Evento creado exitosamente.");
			return ;
		} catch (error) {
			setSuccessMessage("Error al crear evento:" + error);
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
		<div className="create-event">
			<ButtonClose onClick={onClose}/>
			<h2 className="create-event__title">Crear Evento</h2>
			{successMessage && (
                <div className="success-message">
                	{successMessage}
                </div>
            )}
			<form className="create-event__form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Título*</label>
					<input type="text" name="title" placeholder="Título" value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} required/>
				</div>
				<div className="form-group">
					<label>Imagen*</label>
					{imageError && (
                        <span className="form-error">La imagen es obligatoria.</span>
                    )}
					<ImageInputSelector value={event.image} onChange={(img) => setEvent({ ...event, image: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" imageUploaderKey={imageUploaderKey} />
				</div>
				<div className="form-group">	
					<label>Descripción*</label>
					{descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
					<JoditEditor value={event.description} onChange={(content) => setEvent({ ...event, description: content })} className="jodit-container" />
				</div>
				<div className="form-group">
					<label>Enlace*</label>
					<input type="text" name="link" placeholder="Enlace" value={event.link} onChange={(e) => setEvent({ ...event, link: e.target.value })} required />
				</div>
				<div className="form-group">
					<label>Fecha*</label>
					<input type="date" name="date" value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} required />
				</div>
				{ subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={event} setData={setEvent} subtopicsKey="subtopic_ids"/>
				<SelectedSubtopics data={event} setData={setEvent} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics}/>
					
				{!localitation ? (
					<button className="create-event__localitation" type="button" onClick={() => setLocalitation({ address: "", latitude: 4.5709, longitude: -74.2973,})} >
						Añadir localización
					</button>
				) : (
					<div>
						<Localitation value={localitation} onChange={setLocalitation} />
						<button type="button" className="remove-localitation-button" onClick={() => setLocalitation(undefined)} style={{ marginTop: "0.5rem", backgroundColor: "#f44336", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "4px", }} >
							Quitar localización
						</button>
					</div>
				)}

				<button className="create-event__submit" type="submit" disabled={uploading} >
					{uploading ? "Guardando..." : "Guardar Evento"}
				</button>
			</form>
		</div>
	);
};
