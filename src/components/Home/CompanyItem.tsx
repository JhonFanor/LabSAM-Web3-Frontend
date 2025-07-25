import React from "react";
import { Link } from "react-router-dom";
import { CompanyGetAllResponse } from "../../dtos/responses";
import "./CompanyItem.css";

type Props = {
  company: CompanyGetAllResponse;
};

export const CompanyItem: React.FC<Props> = ({ company }) => (
  <Link to={`/company/${company.id}`} className="company-item__list-item">
    <p className="company-item__list-item-name">{company.name}</p>
    <p className="company-item__list-item-user">
      Subido por: {company.user.regular_user?.name || company.user.university_user?.name || company.user.business_user?.name || "Anónimo"}
    </p>
  </Link>
);
