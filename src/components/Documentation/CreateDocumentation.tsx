import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { createDocumentation } from "../../api/DocumentationApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateDocumentation.css";
import { Topic } from "../../models/Topic.ts";
import { Documentation } from "../../models/Documentation.ts";

interface CreateDocumentationProps {
  onClose: () => void;
}

export const CreateDocumentation: React.FC<CreateDocumentationProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [documentation, setDocumentation] = useState<Documentation>({
    title: "",
    description: "",
    subtopic_ids: [] as number[],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);
  
  const allSubtopics = topics.flatMap(topic => topic.subtopics);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDocumentation(documentation);
    setDocumentation({
      title: "",
      description: "",
      subtopic_ids: [],
    });
    setSelectedTopic(null);
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
        
        <TopicSelector topics={topics} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={documentation} setData={setDocumentation} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={documentation} setData={setDocumentation} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-documentation__submit" type="submit">Guardar Documentación</button>
      </form>
    </div>
  );
};
