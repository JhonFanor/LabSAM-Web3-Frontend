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
	const [selectedPosterFile, setSelectedPosterFile] = useState<File | null>(null);
	const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);
	const [localitationError, setLocalitationcError] = useState<boolean>(false);
	const [mode, setMode] = useState<"none" | "address" | "location">("none");

	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [event, setEvent] = useState<EventCreateRequest>({
		title: "",
		image: "",
		description: "",
		link: "",
		date: "",
		localitation: {
			address: "",
			latitude: undefined,
			longitude: undefined,
		},
		subtopic_ids: [],
	});

	const [localitation, setLocalitation] = useState< { address: string; latitude?: number | null ; longitude?: number | null } | undefined >(undefined);

	useEffect(() => {
		getAllTopics(setTopics);
	}, []);

	const allSubtopics = topics.flatMap((topic) => topic.subtopics);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);
		setDescriptionError(false);
		setSubtopicError(false);

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

		 if (localitation?.address === "" || localitation?.address === null) {
			setUploading(false);
			setLocalitationcError(true);
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

			let posterPath = event.poster;

			if (selectedPosterFile) {
				try {
					posterPath = await uploadImageFile(selectedPosterFile, "event");
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir imagen:"+uploadError);
					return;
				}
			}

			const eventToSend: EventCreateRequest = {
				...event,
				image: imagePath,
				poster: posterPath,
				...(localitation && { localitation }),
				date: event.date ? new Date(event.date).toISOString() : "",
			};

			await createEvent(eventToSend);

			setSelectedTopic(null);
			setUploading(false);
			setSelectedImageFile(null);
			setSelectedPosterFile(null);
			setImageUploaderKey(Date.now());

			setEvent({ 
				title: "", 
				description: "", 
				link: "", date: "", 
				image: "", 
				localitation: {
					address: "",
					latitude: undefined,
					longitude: undefined,
				},
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
					<label>Logo</label>
					<ImageInputSelector value={event.image ?? ""} onChange={(img) => setEvent({ ...event, image: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" imageUploaderKey={imageUploaderKey} />
				</div>
				<div className="form-group">
					<label>Afiche</label>
					<ImageInputSelector value={event.poster ?? ""} onChange={(img) => setEvent({ ...event, poster: img })} onFileSelected={setSelectedPosterFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" imageUploaderKey={imageUploaderKey} />
				</div>
				<div className="form-group">	
					<label>Descripción*</label>
					{descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
					<JoditEditor value={event.description} onChange={(content) => setEvent({ ...event, description: content })} className="jodit-container" />
				</div>
				<div className="form-group">
					<label>Enlace</label>
					<input type="text" name="link" placeholder="Enlace" value={event.link} onChange={(e) => setEvent({ ...event, link: e.target.value })} />
				</div>
				<div className="form-group">
					<label>Enlace de registro</label>
					<input type="text" name="link_register" placeholder="Enlace de registro" value={event.registration_link} onChange={(e) => setEvent({ ...event, registration_link: e.target.value })} />
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
				
				{localitationError && <span className="form-error">Debes colocar una ubicacion o dirección.</span>}

				{mode === "none" ? (
					<>
						<button className="create-event__localitation" type="button" onClick={() => { setMode("address"); setLocalitation({ address: "", latitude: null, longitude: null }); }}>
							Añadir dirección
						</button>

						<button className="create-event__localitation" type="button" onClick={() => { setMode("location"); setLocalitation({ address: "", latitude: 4.5709, longitude: -74.2973 }); }}>
							Añadir ubicación
						</button>
					</>
				) : mode === "address" ? (
					<div>
						<input type="text" placeholder="Ingrese dirección" value={localitation?.address || ""} onChange={(e) => setLocalitation({ address: e.target.value, latitude: null, longitude: null })} />
						<button className="remove-localitation-button" type="button" onClick={() => { setMode("none"); setLocalitation(undefined); }}>
							Quitar dirección
						</button>
					</div>
				) : (
					<div>
						<Localitation
							value={
								localitation && typeof localitation.latitude === "number" && typeof localitation.longitude === "number"
									? { address: localitation.address, latitude: localitation.latitude, longitude: localitation.longitude }
									: undefined
							}
							onChange={setLocalitation}
						/>
						<button className="remove-localitation-button" type="button" onClick={() => { setMode("none"); setLocalitation(undefined); }}>
							Quitar ubicación
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
