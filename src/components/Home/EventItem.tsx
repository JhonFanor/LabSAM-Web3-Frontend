import React from "react";
import { Link } from "react-router-dom";
import { EventGetAllResponse } from "../../dtos/responses";

type Props = {
  event: EventGetAllResponse;
};

export const EventItem: React.FC<Props> = ({ event }) => (
  <Link to={`/event/${event.id}`} className="event-item__list-item">
    <p className="event-item__list-item-title">{event.title}</p>
    <img src={event.image} alt={event.title} className="event-item__list-item-image"/>
    <p className="event-item__list-item-date">{new Date(event.date).toLocaleDateString()}</p>
    <p className="event-item__list-item-user">
      Subido por: {event.user.regular_user?.name || event.user.university_user?.name || event.user.business_user?.name || "Anónimo"}
    </p>
  </Link>
);
