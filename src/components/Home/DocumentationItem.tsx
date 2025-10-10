import React from "react";
import { Link } from "react-router-dom";
import { DocumentationGetAllResponse } from "../../dtos/responses";
import "./DocumentationItem.css";

type Props = {
  documentation: DocumentationGetAllResponse;
};

export const DocumentationItem: React.FC<Props> = ({ documentation }) => (
    <Link to={`/documentation/${documentation.id}`} className="documentation-item__list-item">
        <h1>Documentación</h1>
        <p className="documentation-item__list-item-title">{documentation.title}</p>
                        
        <p className="documentation-item__list-item-author">
            Autor: {documentation.author || "No especificado"}
        </p>
        
        <p className="documentation-item__list-item-user">
            Subido por:{" "}{ documentation.user.regular_user?.name || documentation.user.university_user?.name || documentation.user.business_user?.name || "Anónimo" }
        </p>
        
        <div 
            className="documentation-item__list-item-description" 
            dangerouslySetInnerHTML={{
                __html: documentation.description.length > 150 
                    ? documentation.description.substring(0, 150) + "..." 
                    : documentation.description,
            }} 
        />
    </Link>
);
