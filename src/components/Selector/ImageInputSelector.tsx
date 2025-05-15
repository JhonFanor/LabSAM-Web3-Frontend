import React, { useState } from "react";
import ImageUploader from "../Upload/Image";
import "./ImageInputSelector.css"

interface ImageInputSelectorProps {
  value: string;
  onChange: (imagePath: string) => void;
  onFileSelected: (file: File | null) => void;
  urlLabel?: string;
  fileLabel?: string;
}

const ImageInputSelector: React.FC<ImageInputSelectorProps> = ({ value, onChange, onFileSelected, urlLabel, fileLabel }) => {
  const [imageOption, setImageOption] = useState<"url" | "file">(value.startsWith("http") ? "url" : "file");

  return (
    <div>
      <div className="image-option-selector">
        <div
          className={`image-option ${imageOption === "url" ? "selected" : ""}`}
          onClick={() => {
            setImageOption("url");
            onChange("");
            onFileSelected(null);
          }}
        >
          {urlLabel}
        </div>
        <div
          className={`image-option ${imageOption === "file" ? "selected" : ""}`}
          onClick={() => {
            setImageOption("file");
            onChange("");
          }}
        >
          {fileLabel}
        </div>
      </div>

      {imageOption === "url" && (
        <>
          <input
            type="text"
            name="image"
            placeholder="URL de la imagen"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              onFileSelected(null);
            }}
          />
          {value && (
            <div className="image-preview">
              <img src={value} alt="Vista previa" style={{ maxWidth: "100%", height: "auto" }} />
              <button type="button" className="remove-image-button" onClick={() => onChange("")}>
                Quitar URL
              </button>
            </div>
          )}
        </>
      )}

      {imageOption === "file" && (
        <ImageUploader onFileSelect={onFileSelected} />
      )}
    </div>
  );
};

export default ImageInputSelector;
