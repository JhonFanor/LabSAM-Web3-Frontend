import React from "react";
import { Link } from "react-router-dom";
import { LegislationGetAllResponse } from "../../dtos/responses";
import "./LegislationItem.css";

type Props = {
    legislation: LegislationGetAllResponse;
};

export const LegislationItem: React.FC<Props> = ({ legislation }) => (
    <Link to={`/legislation/${legislation.id}`} className="legislation-item__list-item">
        <p className="legislation-item__list-item-title">{legislation.title}</p>
        <p className="legislation-item__list-item-user">
            Subido por: <img src={legislation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/> {legislation.user.regular_user?.name || legislation.user.university_user?.name || legislation.user.business_user?.name || "Anónimo"}
        </p>
    </Link>
);
