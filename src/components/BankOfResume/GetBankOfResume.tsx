import React from "react";
import "./GetBankOfResume.css";
import { BankOfResumeGetResponse } from "../../dtos/responses/BankOfResume";

interface GetBankOfResumeProps {
  resume: BankOfResumeGetResponse;
}

const isInternalLink = (url: string) => url.includes("/uploads/");
const transformDownloadURL = (url: string) => {
  const base = "/api/download/";
  const relativePath = url.split("/uploads/")[1];
  return base + relativePath;
};

export const GetBankOfResume: React.FC<GetBankOfResumeProps> = ({ resume }) => {
  const isDownload = isInternalLink(resume.link);
  const url = isDownload ? transformDownloadURL(resume.link) : resume.link;
  const userName = resume.user.regular_user?.name;

  return (
    <div className="resume-container">
      <h1 className="resume-title">{resume.title}</h1>

      {userName && <h3 className="resume-subtitle">👤 {userName}</h3>}

      <p className="resume-meta">Subtemas: {resume.subtopics.map(s => s.name).join(", ")}</p>

      <div className="resume-content">
        {resume.photo && (
          <img
            src={resume.photo}
            className="resume-photo"
            alt="Foto del postulante"
          />
        )}

        <div className="resume-summary">
          <div dangerouslySetInnerHTML={{ __html: resume.summary }} />
        </div>
      </div>

      <div className="resume-link">
        {isDownload ? (
          <a href={url} download>
            📥 Descargar hoja de vida
          </a>
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer">
            🌐 Ver hoja de vida
          </a>
        )}
      </div>
    </div>
  );
};
