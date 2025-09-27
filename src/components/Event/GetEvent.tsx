import React, { useState } from "react";
import "./GetEvent.css";
import { EventGetResponse } from "../../dtos/responses/Event";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ApprovalButton } from "../Button/ApprovalButton";
import { deleteEvent, setEventApproval } from "../../api";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { useAuth } from "../../providers/Auth";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { UpdateEvent } from "./UpdateEvent";
import { ButtonDelete } from "../Button/ButtonDelete";
import "../Button/ButtonsUpdateDelete.css";
import { createRejectionComment } from "../../api/RejectionCommentApi";

interface GetEventProps {
	event: EventGetResponse;
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("es-ES", { 
		year: "numeric", 
		month: "long", day: 
		"numeric" 
	});
};

export const GetEvent: React.FC<GetEventProps> = ({ event }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(event.is_approved ?? null);
	const [currentEvent, setCurrentEvent] = useState<EventGetResponse>(event);

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setEventApproval(currentEvent.id, approvalData);
		setIsApproved(approved);

		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "event",
				resource_id: currentEvent.id,
				comment,
			});
		}
	};

	return (
		<div className="event-container">
			{isAuthenticated && !isLoading && (user.id == currentEvent.user.id || user.role == "admin") &&(
				<div className="buttons-update-delete">
					<ButtonUpdate>
						{(onClose) => (
							<UpdateEvent onClose={onClose} eventGetResponse={currentEvent} onUpdated={(updateEvent) => setCurrentEvent(updateEvent)}  />
						)}
					</ButtonUpdate>
					<ButtonDelete
						onDelete={() => deleteEvent(currentEvent.id)}
						message="¿Estás seguro de que deseas eliminar este evento?"
					/>
				</div>
			)}
		
			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar este evento?" onApprove={() => handleApproval(true)} onReject={() => {}} />
					<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar este evento?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />
				</div>
			)}

			<h1 className="event-title">{currentEvent.title}</h1>

			<div className="event-meta-container">
				<p className="event-meta">{formatDate(currentEvent.date)}</p>
				<p className="event-meta">
					Subido por:{" "}
					<img src={currentEvent.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
					{
						currentEvent.user.regular_user?.name ||
						currentEvent.user.university_user?.name ||
						currentEvent.user.business_user?.name ||
						"Anónimo"
					}
				</p>
			</div>

			<p className="news-meta">Subtemas: {currentEvent.subtopics.map((s) => s.name).join(", ")}</p>

			<div className="event-content">
				<img className="event-image" src={currentEvent.image || "default-image.jpg"} alt={currentEvent.title} />

				<div
					className="event-description"
					dangerouslySetInnerHTML={{ __html: currentEvent.description }}
				/>
			</div>

				{currentEvent.link && (
						<div className="event-link">
								<a href={currentEvent.link} target="_blank" rel="noopener noreferrer">
								➤ Ver evento completo
								</a>
						</div>
				)}

			{currentEvent.localitation && (
				<div className="event-map-container">
					<h3>Ubicación del evento</h3>
					<p className="event-meta">{currentEvent.localitation.address}</p>
					<MapContainer
						center={[currentEvent.localitation.latitude, currentEvent.localitation.longitude]}
						zoom={15}
						scrollWheelZoom={false}
						className="event-map"
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={[currentEvent.localitation.latitude, currentEvent.localitation.longitude]}>
							<Popup>{currentEvent.localitation.address}</Popup>
						</Marker>
					</MapContainer>
				</div>
			)}
		</div>
	);
};
