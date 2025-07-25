import React from "react";
import { Link } from "react-router-dom";
import { EducationalOfferGetAllResponse } from "../../dtos/responses";

type Props = {
  educationalOffer: EducationalOfferGetAllResponse;
};

export const EducationalOfferItem: React.FC<Props> = ({ educationalOffer }) => (
  <Link to={`/educational-offer/${educationalOffer.id}`} className="educational-offer-item__list-item">
    <p className="educational-offer-item__list-item-title">{educationalOffer.title}</p>
    <p className="educational-offer-item__list-item-dates">
      Duración: {new Date(educationalOffer.start_date).toLocaleDateString()} - {new Date(educationalOffer.end_date).toLocaleDateString()}
    </p>
    <p className="educational-offer-item__list-item-cost">
      Costo: {educationalOffer.cost}
    </p>
    <p className="educational-offer-item__list-item-user">
      Subido por: {educationalOffer.user.regular_user?.name || educationalOffer.user.university_user?.name || educationalOffer.user.business_user?.name || "Anónimo"}
    </p>
  </Link>
);
