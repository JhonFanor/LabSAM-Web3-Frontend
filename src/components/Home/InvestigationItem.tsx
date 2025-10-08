import React from "react";
import { Link } from "react-router-dom";
import { InvestigationGetAllResponse } from "../../dtos/responses";
import "./InvestigationItem.css";

type Props = {
    investigation: InvestigationGetAllResponse;
};

export const InvestigationItem: React.FC<Props> = ({ investigation }) => (
    <Link to={`/investigation/${investigation.id}`} className="investigation-item__list-item">
        <h1>Investigación</h1>
        <p className="investigation-item__list-item-title">{investigation.title}</p>
        <p className="investigation-item__list-item-user">
            Subido por: <img src={investigation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/> {investigation.user.regular_user?.name || investigation.user.university_user?.name || investigation.user.business_user?.name || "Anónimo"}
        </p>
    </Link>
);
