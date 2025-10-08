import React from "react";
import { Link } from "react-router-dom";
import { CompanyGetAllResponse } from "../../dtos/responses";
import "./CompanyItem.css";

type Props = {
  company: CompanyGetAllResponse;
};

export const CompanyItem: React.FC<Props> = ({ company }) => (
  <Link to={`/company/${company.id}`} className="company-item__list-item">
    <h1>Compañia</h1>
    <p className="company-item__list-item-name">{company.name}</p>
    <p className="company-item__list-item-user">
      Subido por: <img src={company.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/> {company.user.regular_user?.name || company.user.university_user?.name || company.user.business_user?.name || "Anónimo"}
    </p>
  </Link>
);
