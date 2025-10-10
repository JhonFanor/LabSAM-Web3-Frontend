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
        <div className="investigation-item__image-container">
            <img src={investigation.logo? investigation.logo: "/src/assets/img/Logo.jpeg"} alt={investigation.title} className="investigation-item__list-item-image" />
        </div>
        <div className="investigation-item__content">
            <h3 className="investigation-item__list-item-title">{investigation.title}</h3>
            <p className="investigation-item__list-item-author">
                Autor: {investigation.author || "No especificado"}
            </p>
            <p className="investigation-item__list-item-date">
                📅 {new Date(investigation.date).toLocaleDateString()}
            </p>

            <div className="investigation-item__list-item-description" dangerouslySetInnerHTML={{__html:investigation.description.length > 250 ? investigation.description.substring(0, 250) + "..." : investigation.description,}} />

            <p className="investigation-item__list-item-user">
                Subido por:<img src={investigation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
                {investigation.user.regular_user?.name ||
                    investigation.user.university_user?.name ||
                    investigation.user.business_user?.name ||
                    "Anónimo"}
            </p>
        </div> 
    </Link>
);
