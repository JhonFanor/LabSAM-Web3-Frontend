import React from "react";

interface DocumentUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onFileSelect }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("application/pdf")) {
      alert("Solo se permiten archivos PDF.");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
    </div>
  );
};

export default DocumentUploader;
