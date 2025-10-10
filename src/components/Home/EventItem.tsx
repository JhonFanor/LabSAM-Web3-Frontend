import React from "react";
import { Link } from "react-router-dom";
import { EventGetAllResponse } from "../../dtos/responses";
import "./EventItem.css";

type Props = {
    event: EventGetAllResponse;
};

export const EventItem: React.FC<Props> = ({ event }) => (
    <Link to={`/event/${event.id}`} className="event-item__list-item">
        <h1>Evento</h1>
        <div className="event-item__image-container">
            <img src={event.image? event.image: event.poster? event.poster: "/src/assets/img/Logo.jpeg"} alt={event.title} className="event-item__list-item-image" />
        </div>
        <div className="event-item__content">
            <h3 className="event-item__list-item-title">{event.title}</h3>
            <p className="event-item__list-item-date">
                📅 {new Date(event.date).toLocaleDateString()}
            </p>

            <div className="event-item__list-item-description" dangerouslySetInnerHTML={{__html:event.description.length > 250 ? event.description.substring(0, 250) + "..." : event.description,}} />

            <p className="event-item__list-item-user">
                Subido por:<img src={event.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
                {event.user.regular_user?.name ||
                    event.user.university_user?.name ||
                    event.user.business_user?.name ||
                    "Anónimo"}
            </p>
        </div>
    </Link>
);
