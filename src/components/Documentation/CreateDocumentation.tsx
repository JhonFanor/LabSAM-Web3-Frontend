import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import { DocumentationCreateRequest } from "../../dtos/requests";
import JoditEditor from "jodit-react";
import { createDocumentation, getAllTopics, uploadDocumentFile } from "../../api";
import { FaTimes } from "react-icons/fa";
import { TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector } from "../../components";
import "./CreateDocumentation.css";

interface CreateDocumentationProps {
  onClose: () => void;
}

export const CreateDocumentation: React.FC<CreateDocumentationProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
  const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());

  const [documentation, setDocumentation] = useState<DocumentationCreateRequest>({
    title: "",
    description: "",
    link: "",
    subtopic_ids: [] as number[],
  });

  useEffect(() => {
    getAllTopics(setTopics);
  }, []);
  
  const allSubtopics = topics.flatMap(topic => topic.subtopics);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let documentPath = documentation.link;

      if (selectedDocumentFile) {
        try {
          documentPath = await uploadDocumentFile(selectedDocumentFile, "documentation");
        } catch (uploadError) {
          setUploading(false);
          console.error("Error al subir la documentación", uploadError);
          alert("No se pudo subir la documentación. Por favor, inténtalo de nuevo.");
          return;
        }
      }

      const documentationToSend: DocumentationCreateRequest = {
        ...documentation,
        link: documentPath,
      }

      await createDocumentation(documentationToSend);
      
      setSelectedTopic(null);
      setUploading(false);
      setSelectedDocumentFile(null);
      setDocumentUploaderKey(Date.now());

      setDocumentation({
        title: "",
        description: "",
        link: "",
        subtopic_ids: [],
      });
    } catch(error){
      console.error("Error al guardar la documentación:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="create-documentation__content">
      <button className="create-documentation__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-documentation__title">Crear Documentación</h2>
      <form className="create-documentation__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={documentation.title} onChange={(e) => setDocumentation({ ...documentation, title: e.target.value })} required />
        
        <JoditEditor value={documentation.description} onChange={(content) => setDocumentation({ ...documentation, description: content })} className="jodit-container"/>
        
        <DocumentInputSelector value={documentation.link} onChange={(document) => setDocumentation({...documentation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la documentacion" fileLabel="📄 Subir la documentación" documentUploaderKey={documentUploaderKey} />

        <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={documentation} setData={setDocumentation} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={documentation} setData={setDocumentation} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-documentation__submit" type="submit" disabled={uploading} >
          {uploading ? "Guardando..." : "Guardar Documentación"}
        </button>
      </form>
    </div>
  );
};
