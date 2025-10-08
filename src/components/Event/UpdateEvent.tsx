import React, { useState, useEffect } from "react";
import { EventGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { EventUpdateRequest } from "../../dtos/requests";
import { getAllTopics, getEventById, updateEvent, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, ImageInputSelector, Localitation } from "../../components";
import "./UpdateEvent.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateEventSubtopic, DeleteEventSubtopic } from "../../api/EventSubtopicApi";
import { formatDateYYYYMMDD } from "../../utils/Date";

interface UpdateEventProps {
	onClose: () => void;
	eventGetResponse: EventGetResponse;
	onUpdated?: (updated: EventGetResponse) => void;
}

export const UpdateEvent: React.FC<UpdateEventProps> = ({ onClose, eventGetResponse, onUpdated }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [selectedPosterFile, setSelectedPosterFile] = useState<File | null>(null);
	const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
	const [resetKey, setResetKey] = useState<number>(Date.now());
	const [mode, setMode] = useState<"none" | "address" | "location">("none");
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [localitationError, setLocalitationcError] = useState<boolean>(false);
    const [subtopicError, setSubtopicError] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [event, setEvent] = useState<EventUpdateRequest>({
		title: eventGetResponse.title,
		image: eventGetResponse.image,
		poster: eventGetResponse.poster,
		description: eventGetResponse.description,
		link: eventGetResponse.link,
		registration_link: eventGetResponse.registration_link,
		date: eventGetResponse.date,
		localitation: eventGetResponse.localitation,
	});

	const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
		subtopic_ids: eventGetResponse.subtopics.map((s) => s.id),
	});

	const [localitation, setLocalitation] = useState<
		{ address: string; latitude: number | null; longitude: number | null } | undefined
	>(
		eventGetResponse.localitation
			? {
					address: eventGetResponse.localitation.address,
					latitude: eventGetResponse.localitation.latitude ?? null,
					longitude: eventGetResponse.localitation.longitude ?? null,
			  }
			: undefined
	);

	const originalSubtopicIds = eventGetResponse.subtopics.map((s) => s.id);
	const allSubtopics = topics.flatMap((topic) => topic.subtopics);

	useEffect(() => {
		getAllTopics(setTopics);
	}, []);

	const handleReset = () => {
		setEvent({
			title: eventGetResponse.title,
			image: eventGetResponse.image,
			description: eventGetResponse.description,
			link: eventGetResponse.link,
			date: eventGetResponse.date,
			localitation: eventGetResponse.localitation,
		});
		setSubtopicIds({ subtopic_ids: originalSubtopicIds });
		setSelectedImageFile(null);
		setSelectedPosterFile(null);
		setSelectedTopic(null);
		setImageUploaderKey(Date.now());
		setResetKey(Date.now());
		setLocalitation(
			eventGetResponse.localitation
				? {
						address: eventGetResponse.localitation.address,
						latitude: eventGetResponse.localitation.latitude ?? null,
						longitude: eventGetResponse.localitation.longitude ?? null,
				  }
				: undefined
		);
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);
		setDescriptionError(false);
		setSubtopicError(false);

		if (!event.description || event.description.trim() === "" || event.description === "<p></p>") {
			setDescriptionError(true);
			setUploading(false);
			return;
		}

		if (subtopicIds.subtopic_ids.length === 0) {
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
			const date = new Date(event.date || "");
			let imagePath = event.image;
			if (selectedImageFile) {
				imagePath = await uploadImageFile(selectedImageFile, "event");
			}

			let posterPath = event.poster;
			if (selectedPosterFile) {
				posterPath = await uploadImageFile(selectedPosterFile, "event");
			}

			const update: EventUpdateRequest = {
				...event,
				image: imagePath,
				poster: posterPath,
				localitation: localitation ?? null,
				date: date.toISOString(),
			};

			const hasChanged =
				update.title !== eventGetResponse.title ||
				update.image !== eventGetResponse.image ||
				update.description !== eventGetResponse.description ||
				update.link !== eventGetResponse.link ||
				update.date !== eventGetResponse.date ||
				JSON.stringify(update.localitation) !== JSON.stringify(eventGetResponse.localitation);

			const currentSet = new Set(subtopicIds.subtopic_ids);
			const originalSet = new Set(originalSubtopicIds);
			const added = subtopicIds.subtopic_ids.filter((id) => !originalSet.has(id));
			const removed = originalSubtopicIds.filter((id) => !currentSet.has(id));

			if (added.length > 0) {
				await CreateEventSubtopic(eventGetResponse.id, { subtopic_ids: added });
			}

			if (removed.length > 0) {
				await DeleteEventSubtopic(eventGetResponse.id, { subtopic_ids: removed });
			}

			const subtopicsChanged = added.length > 0 || removed.length > 0;

			if (hasChanged || subtopicsChanged) {
				await updateEvent(eventGetResponse.id, update);
				const refreshedEvent = await getEventById(eventGetResponse.id);
				if (onUpdated) {
					onUpdated(refreshedEvent);
				}
			}

			setSuccessMessage("Evento actualizado con éxito");
		} catch (error) {
			setSuccessMessage("Error al actualizar el evento: " + error);
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
		<div className="update-event">
			<ButtonClose onClick={onClose} />
			<h2 className="update-event__title">Actualizar Evento</h2>
			{successMessage && <div className="success-message">{successMessage}</div>}
			<form className="update-event__form" onSubmit={handleUpdate}>
				<div className="form-group">
					<label>Título*</label>
					<input
						type="text"
						name="title"
						placeholder="Título"
						value={event.title}
						onChange={(e) => setEvent({ ...event, title: e.target.value })}
						required
					/>
				</div>
				<div className="form-group">
					<label>Logo</label>
					<ImageInputSelector
						value={event.image || ""}
						onChange={(img) => setEvent({ ...event, image: img })}
						onFileSelected={setSelectedImageFile}
						urlLabel="📎 URL de la imagen"
						fileLabel="🖼️ Subir la imagen"
						imageUploaderKey={imageUploaderKey}
						resetKey={resetKey}
					/>
				</div>
				<div className="form-group">
					<label>Afiche</label>
					<ImageInputSelector
						value={event.poster || ""}
						onChange={(img) => setEvent({ ...event, poster: img })}
						onFileSelected={setSelectedPosterFile}
						urlLabel="📎 URL de la imagen"
						fileLabel="🖼️ Subir la imagen"
						imageUploaderKey={imageUploaderKey}
						resetKey={resetKey}
					/>
				</div>
				<div className="form-group">
					<label>Descripción*</label>
					{descriptionError && <span className="form-error">La descripción es obligatoria.</span>}
					<JoditEditor
						value={event.description}
						onChange={(content) => setEvent({ ...event, description: content })}
						className="jodit-container"
					/>
				</div>
				<div className="form-group">
					<label>Enlace</label>
					<input
						type="text"
						name="link"
						placeholder="Enlace"
						value={event.link}
						onChange={(e) => setEvent({ ...event, link: e.target.value })}
					/>
				</div>
				<div className="form-group">
					<label>Enlace de registro</label>
					<input
						type="text"
						name="link_register"
						placeholder="Enlace de registro"
						value={event.registration_link}
						onChange={(e) => setEvent({ ...event, registration_link: e.target.value })}
					/>
				</div>
				<div className="form-group">
					<label>Fecha*</label>
					<input
						type="date"
						name="date"
						value={formatDateYYYYMMDD(event.date || "")}
						onChange={(e) => setEvent({ ...event, date: e.target.value })}
						required
					/>
				</div>

				{subtopicError && <span className="form-error">Debes seleccionar al menos un subtema.</span>}
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

                {localitationError && <span className="form-error">Debes colocar una ubicacion o dirección.</span>}
				{mode === "none" ? (
					<>
						<button
							className="create-event__localitation"
							type="button"
							onClick={() => {
								setMode("address");
								setLocalitation({ address: "", latitude: null, longitude: null });
							}}
						>
							Añadir dirección
						</button>

						<button
							className="create-event__localitation"
							type="button"
							onClick={() => {
								setMode("location");
								setLocalitation({ address: "", latitude: 4.5709, longitude: -74.2973 });
							}}
						>
							Añadir ubicación
						</button>
					</>
				) : mode === "address" ? (
					<div>
						<input
							type="text"
							placeholder="Ingrese dirección"
							value={localitation?.address || ""}
							onChange={(e) =>
								setLocalitation({
									address: e.target.value,
									latitude: null,
									longitude: null,
								})
							}
						/>
						<button
							className="remove-localitation-button"
							type="button"
							onClick={() => {
								setMode("none");
								setLocalitation(undefined);
							}}
						>
							Quitar dirección
						</button>
					</div>
				) : (
					<div>
						<Localitation
							value={
								localitation &&
								typeof localitation.latitude === "number" &&
								typeof localitation.longitude === "number"
									? {
											address: localitation.address,
											latitude: localitation.latitude,
											longitude: localitation.longitude,
									  }
									: undefined
							}
							onChange={setLocalitation}
						/>
						<button
							className="remove-localitation-button"
							type="button"
							onClick={() => {
								setMode("none");
								setLocalitation(undefined);
							}}
						>
							Quitar ubicación
						</button>
					</div>
				)}

				<div className="update-event__buttons">
					<button type="submit">{uploading ? "Actualizando..." : "Actualizar Evento"}</button>
					<button type="button" onClick={handleReset} disabled={uploading}>
						Deshacer cambios
					</button>
				</div>
			</form>
		</div>
	);
};
