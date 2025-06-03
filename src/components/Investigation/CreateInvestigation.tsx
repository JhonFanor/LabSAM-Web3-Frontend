import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { createInvestigation } from "../../api/InvestigationApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateInvestigation.css";
import { Topic } from "../../models/Topic.ts";
import { InvestigationCreateRequest } from "../../dtos/requests/Investigation";
import DocumentInputSelector from "../Selector/DocumentInputSelector";
import { uploadDocumentFile } from "../../api/Upload.ts";

interface CreateInvestigationProps {
  onClose: () => void;
}

export const CreateInvestigation: React.FC<CreateInvestigationProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);

  const [investigation, setInvestigation] = useState<InvestigationCreateRequest>({
    title: "",
    description: "",
    date: "",
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
      let documentPath = investigation.link;

      if (selectedDocumentFile) {
        try {
          documentPath = await uploadDocumentFile(selectedDocumentFile, "investigation")
        } catch (uploadError) {
          setUploading(false);
          console.error("Error al subir la investigación:", uploadError);
          alert("No se pudo subir la investigación. Por favor, inténtalo de nuevo.");
          return;
        }
      }

      const investigationToSend: InvestigationCreateRequest = {
        ...investigation,
        link: documentPath,
        date: investigation ? new Date(investigation.date).toISOString() : "",
      };

      console.log(investigationToSend);

      await createInvestigation(investigationToSend);

      setSelectedTopic(null);
      setUploading(false);
      setSelectedDocumentFile(null);
      setInvestigation({
        title: "",
        description: "",
        date: "",
        link: "",
        subtopic_ids: [],
      });
    } catch(error){
      console.error("Error al guardar la investigación:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="create-investigation__content">
      <button className="create-investigation__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-investigation__title">Crear Investigación</h2>
      <form className="create-investigation__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={investigation.title} onChange={(e) => setInvestigation({ ...investigation, title: e.target.value })} required />
        
        <JoditEditor value={investigation.description} onChange={(content) => setInvestigation({ ...investigation, description: content })} className="jodit-container"/>
        
        <input type="date" name="date" placeholder="Fecha" value={investigation.date} onChange={(e) => setInvestigation({ ...investigation, date: e.target.value })} required />
        
        <DocumentInputSelector value={investigation.link} onChange={(document) => setInvestigation({...investigation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la investigación" fileLabel="📄 Subir la investigación" />

        <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={investigation} setData={setInvestigation} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={investigation} setData={setInvestigation} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-investigation__submit" type="submit"  disabled={uploading} >
          {uploading ? "Guardando..." : "Guardar Investigación"}
        </button>
      </form>
    </div>
  );
};
