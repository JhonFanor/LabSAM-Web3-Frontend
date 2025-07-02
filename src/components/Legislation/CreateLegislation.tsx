import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { createLegislation } from "../../api/LegislationApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateLegislation.css";
import { Topic } from "../../models/Topic.ts";
import { LegislationCreateRequest } from "../../dtos/requests/Legislation";
import DocumentInputSelector from "../Selector/DocumentInputSelector.tsx";
import { uploadDocumentFile } from "../../api/Upload.ts";

interface CreateLegislationProps {
  onClose: () => void;
}

export const CreateLegislation: React.FC<CreateLegislationProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);

  const [legislation, setLegislation] = useState<LegislationCreateRequest>({
    title: "",
    description: "",
    link: "",
    subtopic_ids: [] as number[],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);
  
  const allSubtopics = topics.flatMap(topic => topic.subtopics);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let documentPath = legislation.link;

      if (selectedDocumentFile) {
        try {
          documentPath = await uploadDocumentFile(selectedDocumentFile, "investigation")
        } catch (uploadError) {
          setUploading(false);
          console.error("Error al subir la legislación:", uploadError);
          alert("No se pudo subir la legislación. Por favor, inténtalo de nuevo.");
          return;
        }
      }

      const legislationToSend: LegislationCreateRequest = {
        ...legislation,
        link: documentPath,
      }

      await createLegislation(legislationToSend);
      
      setSelectedTopic(null);
      setUploading(false)
      setSelectedDocumentFile(null);
      
      setLegislation({
        title: "",
        description: "",
        link: "",
        subtopic_ids: [],
      });
    } catch (error) {
      console.error("Error al guardar la legislación:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="create-legislation">
      <button className="create-legislation__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-legislation__title">Crear Legislación</h2>
      <form className="create-legislation__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={legislation.title} onChange={(e) => setLegislation({ ...legislation, title: e.target.value })} required />
        
        <JoditEditor value={legislation.description} onChange={(content) => setLegislation({ ...legislation, description: content })} className="jodit-container"/>
        
        <DocumentInputSelector value={legislation.link} onChange={(document) => setLegislation({...legislation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la legislación" fileLabel="📄 Subir la legislación" />

        <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={legislation} setData={setLegislation} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={legislation} setData={setLegislation} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-legislation__submit" type="submit" disabled={uploading}>
          {uploading ? "Guardando..." : "Guardar Legislación"}
        </button>
      </form>
    </div>
  );
};