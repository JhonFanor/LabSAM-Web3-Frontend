import React from "react";
import "./GetDocumentation.css";
import { DocumentationGetResponse } from "../../dtos/responses/Documentation";

interface GetDocumentationProps {
  documentation: DocumentationGetResponse;
}

const isInternalLink = (url: string) => url.includes("/uploads/");
const transformDownloadURL = (url: string) => {
  const base = "/api/download/";
  const relativePath = url.split("/uploads/")[1];
  return base + relativePath;
};

export const GetDocumentation: React.FC<GetDocumentationProps> = ({ documentation }) => {
  const isDownload = isInternalLink(documentation.link);
  const url = isDownload ? transformDownloadURL(documentation.link) : documentation.link;

  return (
    <div className="doc-container">
      <h1 className="doc-title">{documentation.title}</h1>

      {documentation.user.regular_user?.name && (
        <p className="doc-meta">Subido por: {documentation.user.regular_user.name}</p>
      )}

      <p className="doc-meta">
        Subtemas: {documentation.subtopics.map((s) => s.name).join(", ")}
      </p>

      <div className="doc-description">
        <div dangerouslySetInnerHTML={{ __html: documentation.description }} />
      </div>

      <div className="doc-link">
        {isDownload ? (
          <a href={url} download>
            📥 Descargar documento
          </a>
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer">
            🌐 Ver documentación
          </a>
        )}
      </div>
    </div>
  );
};
