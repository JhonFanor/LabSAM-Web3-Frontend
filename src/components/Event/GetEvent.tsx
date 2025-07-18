import React, { useState } from "react";
import "./GetEvent.css";
import { EventGetResponse } from "../../dtos/responses/Event";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ApprovalButton } from "../Button/ApprovalButton";
import { setEventApproval } from "../../api";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { useAuth } from "../../providers/Auth";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { UpdateEvent } from "./UpdateEvent";

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
	const { user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(event.is_approved ?? null);

	const handleApproval = async (approved: boolean) => {
		const approvalData: ApprovalRequest = { approved };
		await setEventApproval(event.id, approvalData);
		setIsApproved(approved);
	};

	return (
		<div className="event-container">
			<ButtonUpdate>
				{(onClose) => (
					<UpdateEvent onClose={onClose} eventGetResponse={event} />
				)}
			</ButtonUpdate>
		
			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} onClick={handleApproval} message="¿Estás seguro de que deseas aprobar este evento?" />
					<ApprovalButton approved={false} onClick={handleApproval} message="¿Estás seguro de que deseas desaprobar este evento?" />
				</div>
			)}

			<h1 className="event-title">{event.title}</h1>

			<div className="event-meta-container">
				<p className="event-meta">{formatDate(event.date)}</p>

				<p className="event-meta">
						{event.user.avatar && (
								<img
								src={event.user.avatar}
								style={{ width: 30, height: 30, borderRadius: "50%", marginLeft: 10 }}
								alt="avatar"
								/>
						)}
				</p>

				<p className="event-meta">
					Subido por:{" "}
					{
						event.user.regular_user?.name ||
						event.user.university_user?.name ||
						event.user.business_user?.name ||
						"Anónimo"
					}
				</p>
			</div>

			<p className="news-meta">Subtemas: {event.subtopics.map((s) => s.name).join(", ")}</p>

			<div className="event-content">
				<img className="event-image" src={event.image || "default-image.jpg"} alt={event.title} />

				<div
					className="event-description"
					dangerouslySetInnerHTML={{ __html: event.description }}
				/>
			</div>

				{event.link && (
						<div className="event-link">
								<a href={event.link} target="_blank" rel="noopener noreferrer">
								➤ Ver evento completo
								</a>
						</div>
				)}

			{event.localitation && (
				<div className="event-map-container">
					<h3>Ubicación del evento</h3>
					<p className="event-meta">{event.localitation.address}</p>
					<MapContainer
						center={[event.localitation.latitude, event.localitation.longitude]}
						zoom={15}
						scrollWheelZoom={false}
						className="event-map"
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={[event.localitation.latitude, event.localitation.longitude]}>
							<Popup>{event.localitation.address}</Popup>
						</Marker>
					</MapContainer>
				</div>
			)}
		</div>
	);
};
