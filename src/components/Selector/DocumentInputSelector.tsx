import React, { useState } from "react";
import { DocumentUploader } from "../../components";
import "./DocumentInputSelector.css"

interface DocumentInputSelectorProps {
  value: string;
  onChange: (document: string) => void;
  onFileSelected: (file: File | null) => void;
  urlLabel?: string;
  fileLabel?: string;
  documentUploaderKey?: number; 
}

export const DocumentInputSelector: React.FC<DocumentInputSelectorProps> = ({ value, onChange, onFileSelected, urlLabel, fileLabel, documentUploaderKey }) => {
  const [documentOption, setDocumentOption] = useState<"url" | "file">(value.startsWith("http") ? "url" : "file");

  return (
    <div>
      <div className="document-option-selector">
        <div className={`document-option ${documentOption === "url" ? "selected" : ""}`} onClick={() => { setDocumentOption("url"); onChange(""); onFileSelected(null); }} >
          {urlLabel}
        </div>
        <div className={`document-option ${documentOption === "file" ? "selected" : ""}`} onClick={() => { setDocumentOption("file"); onChange(""); }} >
          {fileLabel}
        </div>
      </div>

      {documentOption === "url" && (
        <>
          <input type="text" name="document" placeholder="URL del documento" value={value} onChange={(e) => onChange(e.target.value)} />
          {value && (
            <div className="document-preview">
              <img src={value} alt="Vista previa" />
              <button type="button" className="remove-document-button" onClick={() => onChange("")}>
                Quitar URL
              </button>
            </div>
          )}
        </>
      )}

      {documentOption === "file" && (
        <DocumentUploader key={documentUploaderKey} onFileSelect={onFileSelected} />
      )}
    </div>
  );
};