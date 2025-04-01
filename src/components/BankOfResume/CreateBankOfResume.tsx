import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { createBankOfResume } from "../../api/BankOfResumeApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateBankOfResume.css";
import { Topic } from "../../models/Topic.ts";
import { BankOfResume } from "../../models/BankOfResume.ts";

interface CreateBankOfResumeProps {
  onClose: () => void;
}

export const CreateBankOfResume: React.FC<CreateBankOfResumeProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [bankOfResume, setBankOfResume] = useState<BankOfResume>({
    title: "",
    description: "",
    skills: "",
    experience: "",
    education: "",
    subtopic_ids: [] as number[],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);
  const allSubtopics = topics.flatMap(topic => topic.subtopics); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBankOfResume(bankOfResume);
    setBankOfResume({
      title: "",
      description: "",
      skills: "",
      experience: "",
      education: "",
      subtopic_ids: [],
    });
    setSelectedTopic(null);
  };

  return (
    <div className="create-bank-of-resume__content">
      <button className="create-bank-of-resume__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-bank-of-resume__title">Crear Resumen</h2>
      <form className="create-bank-of-resume__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={bankOfResume.title} onChange={(e) => setBankOfResume({ ...bankOfResume, title: e.target.value })} required />
        
        <JoditEditor value={bankOfResume.description} onChange={(content) => setBankOfResume({ ...bankOfResume, description: content })} className="jodit-container"/>
        
        <textarea name="skills" placeholder="Habilidades" value={bankOfResume.skills} onChange={(e) => setBankOfResume({ ...bankOfResume, skills: e.target.value })} required />
        <textarea name="experience" placeholder="Experiencia" value={bankOfResume.experience} onChange={(e) => setBankOfResume({ ...bankOfResume, experience: e.target.value })} required />
        <textarea name="education" placeholder="Educación" value={bankOfResume.education} onChange={(e) => setBankOfResume({ ...bankOfResume, education: e.target.value })} required />
        
        <TopicSelector topics={topics} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={bankOfResume} setData={setBankOfResume} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={bankOfResume} setData={setBankOfResume} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-bank-of-resume__submit" type="submit">Guardar Resumen</button>
      </form>
    </div>
  );
};
