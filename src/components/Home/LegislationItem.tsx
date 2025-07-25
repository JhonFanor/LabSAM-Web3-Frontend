import React from "react";
import { Link } from "react-router-dom";
import { LegislationGetAllResponse } from "../../dtos/responses";

type Props = {
  legislation: LegislationGetAllResponse;
};

export const LegislationItem: React.FC<Props> = ({ legislation }) => (
  <Link to={`/legislation/${legislation.id}`} className="legislation-item__list-item">
    <p className="legislation-item__list-item-title">{legislation.title}</p>
    <p className="legislation-item__list-item-user">
      Subido por: {legislation.user.regular_user?.name || legislation.user.university_user?.name || legislation.user.business_user?.name || "Anónimo"}
    </p>
  </Link>
);
