import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { createJobBoard } from "../../api/JobBoardApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateJobBoard.css";
import { Topic } from "../../models/Topic.ts";
import { JobBoardCreateDto } from "../../dtos/JobBoard";

interface CreateJobBoardProps {
  onClose: () => void;
}

export const CreateJobBoard: React.FC<CreateJobBoardProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [jobBoard, setJobBoard] = useState<JobBoardCreateDto>({
    title: "",
    company: "",
    description: "",
    type: "",
    salary_range: "",
    link: "",
    subtopic_ids: [] as number[],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);
  
  const allSubtopics = topics.flatMap(topic => topic.subtopics);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createJobBoard(jobBoard);

      setSelectedTopic(null);
      setJobBoard({
        title: "",
        company: "",
        description: "",
        type: "",
        salary_range: "",
        link: "",
        subtopic_ids: [],
      });
    } catch (error) {
      console.error("Error al guardar la oferta de trabajo", error);
    }
  };

  return (
    <div className="create-job-board__content">
      <button className="create-job-board__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-job-board__title">Crear Oferta de Trabajo</h2>
      <form className="create-job-board__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={jobBoard.title} onChange={(e) => setJobBoard({ ...jobBoard, title: e.target.value })} required />
        <input type="text" name="company" placeholder="Empresa" value={jobBoard.company} onChange={(e) => setJobBoard({ ...jobBoard, company: e.target.value })} required />
        
        <JoditEditor value={jobBoard.description} onChange={(content) => setJobBoard({ ...jobBoard, description: content })} className="jodit-container"/>
        
        <input type="text" name="type" placeholder="Tipo de oferta" value={jobBoard.type} onChange={(e) => setJobBoard({ ...jobBoard, type: e.target.value })} required />
        <input type="text" name="salary_range" placeholder="Rango Salarial" value={jobBoard.salary_range} onChange={(e) => setJobBoard({ ...jobBoard, salary_range: e.target.value })} required />
        <input type="text" name="link" placeholder="Link a la oferta de trabajo" value={jobBoard.link} onChange={(e) => setJobBoard({ ...jobBoard, link: e.target.value })} required />
        
        <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={jobBoard} setData={setJobBoard} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={jobBoard} setData={setJobBoard} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-job-board__submit" type="submit">
          Guardar Oferta
        </button>
      </form>
    </div>
  );
};