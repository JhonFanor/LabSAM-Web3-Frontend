import React from "react";
import { Link } from "react-router-dom";
import { LegislationGetAllResponse } from "../../dtos/responses";
import "./LegislationItem.css";

type Props = {
    legislation: LegislationGetAllResponse;
};

export const LegislationItem: React.FC<Props> = ({ legislation }) => (
    <Link to={`/legislation/${legislation.id}`} className="legislation-item__list-item">
        <h1>Legislación</h1>
        <div className="legislation-item__image-container">
            <img src={legislation.logo  || "/src/assets/img/Logo.jpeg"} alt={legislation.title} className="legislation-item__list-item-logo" />
        </div>
        <div className="legislation-item__content">
            <h3 className="legislation-item__list-item-title">{legislation.title}</h3>
            <p className="legislation-item__list-item-date">
                📅 {new Date(legislation.date).toLocaleDateString()}
            </p>

            <div className="legislation-item__list-item-description" dangerouslySetInnerHTML={{__html:legislation.description.length > 250 ? legislation.description.substring(0, 250) + "..." : legislation.description,}} />

            <p className="legislation-item__list-item-user">
                Subido por:<img src={legislation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/> { legislation.user.regular_user?.name || legislation.user.university_user?.name || legislation.user.business_user?.name || "Anónimo" }
            </p>
        </div>
    </Link>
);
