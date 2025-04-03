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
import { Legislation } from "../../models/Legislation.ts";

interface CreateLegislationProps {
  onClose: () => void;
}

export const CreateLegislation: React.FC<CreateLegislationProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [legislation, setLegislation] = useState<Legislation>({
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
    await createLegislation(legislation);
    setLegislation({
      title: "",
      description: "",
      subtopic_ids: [],
    });
    setSelectedTopic(null);
  };

  return (
    <div className="create-legislation__content">
      <button className="create-legislation__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-legislation__title">Crear Legislación</h2>
      <form className="create-legislation__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={legislation.title} onChange={(e) => setLegislation({ ...legislation, title: e.target.value })} required />
        
        <JoditEditor value={legislation.description} onChange={(content) => setLegislation({ ...legislation, description: content })} className="jodit-container"/>
        
        <TopicSelector topics={topics} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={legislation} setData={setLegislation} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={legislation} setData={setLegislation} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-legislation__submit" type="submit">Guardar Legislación</button>
      </form>
    </div>
  );
};