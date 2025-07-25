import React from "react";
import { Link } from "react-router-dom";
import { InvestigationGetAllResponse } from "../../dtos/responses";

type Props = {
  investigation: InvestigationGetAllResponse;
};

export const InvestigationItem: React.FC<Props> = ({ investigation }) => (
  <Link to={`/investigation/${investigation.id}`} className="investigation-item__list-item">
    <p className="investigation-item__list-item-title">{investigation.title}</p>
    <p className="investigation-item__list-item-user">
      Subido por: {investigation.user.regular_user?.name || investigation.user.university_user?.name || investigation.user.business_user?.name || "Anónimo"}
    </p>
  </Link>
);
