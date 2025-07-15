import React from "react";
import "./GetLegislation.css";
import { LegislationGetResponse } from "../../dtos/responses/Legislation";

interface GetLegislationProps {
  legislation: LegislationGetResponse;
}

const isInternalLink = (url: string) => url.includes("/uploads/");
const transformDownloadURL = (url: string) => {
  const base = "/api/download/";
  const relativePath = url.split("/uploads/")[1];
  return base + relativePath;
};

export const GetLegislation: React.FC<GetLegislationProps> = ({ legislation }) => {
  const isDownload = isInternalLink(legislation.link);
  const url = isDownload ? transformDownloadURL(legislation.link) : legislation.link;

  return (
    <div className="legislation-container">
      <h1 className="legislation-title">{legislation.title}</h1>

      {legislation.user.regular_user?.name && (
        <p className="legislation-meta">Subido Por: {legislation.user.regular_user.name}</p>
      )}

      <p className="legislation-meta">
        Subtemas: {legislation.subtopics.map((s) => s.name).join(", ")}
      </p>

      <div className="legislation-description">
        <div dangerouslySetInnerHTML={{ __html: legislation.description }} />
      </div>

      <div className="legislation-link">
        {isDownload ? (
          <a href={url} download>
            📥 Descargar documento
          </a>
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer">
            🌐 Ver legislación
          </a>
        )}
      </div>
    </div>
  );
};
