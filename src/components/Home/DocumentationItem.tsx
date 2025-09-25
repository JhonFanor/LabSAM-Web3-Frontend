import React from "react";
import { Link } from "react-router-dom";
import { DocumentationGetAllResponse } from "../../dtos/responses";
import "./DocumentationItem.css";

type Props = {
  documentation: DocumentationGetAllResponse;
};

export const DocumentationItem: React.FC<Props> = ({ documentation }) => (
  <Link to={`/documentation/${documentation.id}`} className="documentation-item__list-item">
    <p className="documentation-item__list-item-title">{documentation.title}</p>
    <p className="documentation-item__list-item-user">
      Subido por: <img src={documentation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/> {documentation.user.regular_user?.name || documentation.user.university_user?.name || documentation.user.business_user?.name || "Anónimo"}
    </p>
  </Link>
);
