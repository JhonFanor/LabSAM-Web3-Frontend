import React from "react";
import "./GetEducationalOffer.css";
import { EducationalOfferGetResponse } from "../../dtos/responses/EducationalOffer";

interface GetEducationalOfferProps {
  offer: EducationalOfferGetResponse;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (value: number) =>
  value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

export const GetEducationalOffer: React.FC<GetEducationalOfferProps> = ({ offer }) => {
  return (
    <div className="offer-container">
      <h1 className="offer-title">{offer.title}</h1>

      <h3 className="offer-subtitle">Institución: {offer.institution}</h3>


      <div className="offer-meta">
        

        <div className="offer-dates">
          <p>Inicio: {formatDate(offer.start_date)}</p>
          <p>Fin: {formatDate(offer.end_date)}</p>
        </div>

        <p>Costo: {formatCurrency(offer.cost)}</p>
      
        {offer.user.regular_user?.name && (
          <p>Subido por:  {offer.user.regular_user.name}</p>
        )}

        <p>Subtemas: {offer.subtopics.map((s) => s.name).join(", ")}</p>
      </div>

      <div className="offer-description">
        <div dangerouslySetInnerHTML={{ __html: offer.description }} />
      </div>

      {offer.link && (
        <div className="offer-link">
          <a href={offer.link} target="_blank" rel="noopener noreferrer">
            🌐 Ir a la oferta educativa
          </a>
        </div>
      )}
    </div>
  );
};
