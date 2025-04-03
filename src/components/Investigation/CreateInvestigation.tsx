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
import { Investigation } from "../../models/Investigation.ts";

interface CreateInvestigationProps {
  onClose: () => void;
}

export const CreateInvestigation: React.FC<CreateInvestigationProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [investigation, setInvestigation] = useState<Investigation>({
    title: "",
    description: "",
    date: "",
    subtopic_ids: [] as number[],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);
  
  const allSubtopics = topics.flatMap(topic => topic.subtopics);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInvestigation(investigation);
    setInvestigation({
      title: "",
      description: "",
      date: "",
      subtopic_ids: [],
    });
    setSelectedTopic(null);
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
        
        <TopicSelector topics={topics} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={investigation} setData={setInvestigation} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={investigation} setData={setInvestigation} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-investigation__submit" type="submit">Guardar Investigación</button>
      </form>
    </div>
  );
};
