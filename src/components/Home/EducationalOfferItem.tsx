import React from "react";
import { Link } from "react-router-dom";
import { EducationalOfferGetAllResponse } from "../../dtos/responses";
import "./EducationalOfferItem.css";

type Props = {
    educationalOffer: EducationalOfferGetAllResponse;
};

export const EducationalOfferItem: React.FC<Props> = ({ educationalOffer }) => (
    <Link to={`/educational-offer/${educationalOffer.id}`} className="educational-offer-item__list-item">
        <h1>Oferta educativa</h1>
        <div className="educational-offer-item__image-container">
            <img src={educationalOffer.logo? educationalOffer.logo: "/src/assets/img/Logo.jpeg"} alt={educationalOffer.title} className="educational-offer-item__list-item-image" />
        </div>
        <div className="educational-offer-item__content">
            <p className="educational-offer-item__list-item-title">{educationalOffer.title}</p>
            <p className="educational-offer-item__list-item-dates">
                Duración: {new Date(educationalOffer.start_date).toLocaleDateString()} - {new Date(educationalOffer.end_date).toLocaleDateString()}
            </p>
            <p className="educational-offer-item__list-item-cost">
                Costo: {educationalOffer.currency_type.symbol}{educationalOffer.cost} {educationalOffer.currency_type.code}
            </p>
            <p className="educational-offer-item__list-item-dates">
                Tipo de educación: {educationalOffer.type_education.name}
            </p>

            <div className="educational-offer-item__list-item-description" dangerouslySetInnerHTML={{__html:educationalOffer.description.length > 250 ? educationalOffer.description.substring(0, 250) + "..." : educationalOffer.description,}} />

            <p className="educational-offer-item__list-item-user">
                Subido por:<img src={educationalOffer.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
                {educationalOffer.user.regular_user?.name ||
                    educationalOffer.user.university_user?.name ||
                    educationalOffer.user.business_user?.name ||
                    "Anónimo"}
            </p>
        </div>
    </Link>
);
