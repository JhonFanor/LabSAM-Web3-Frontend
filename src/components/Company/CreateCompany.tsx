import React, { useState, useEffect } from "react";
import { createCompany } from "../../api/CompanyApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateCompany.css";
import { Topic } from "../../models/Topic.ts";
import { Company } from "../../models/Company.ts";

interface CreateCompanyProps {
  onClose: () => void;
}

export const CreateCompany: React.FC<CreateCompanyProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [company, setCompany] = useState<Company>({
    name: "",
    industry: "",
    localitation_id: 0,
    website: "",
    email: "",
    subtopic_ids: [],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);

  const allSubtopics = topics.flatMap(topic => topic.subtopics);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCompany(company);
    setCompany({
      name: "",
      industry: "",
      localitation_id: 0,
      website: "",
      email: "",
      subtopic_ids: [],
    });
    setSelectedTopic(null);
  };

  return (
    <div className="create-company__content">
      <button className="create-company__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-company__title">Crear Empresa</h2>
      <form className="create-company__form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre de la empresa"
          value={company.name}
          onChange={(e) => setCompany({ ...company, name: e.target.value })}
          required
        />
        <input
          type="text"
          name="industry"
          placeholder="Industria"
          value={company.industry}
          onChange={(e) => setCompany({ ...company, industry: e.target.value })}
          required
        />
        <input
          type="text"
          name="website"
          placeholder="Sitio web"
          value={company.website}
          onChange={(e) => setCompany({ ...company, website: e.target.value })}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={company.email}
          onChange={(e) => setCompany({ ...company, email: e.target.value })}
          required
        />
        <input
          type="number"
          name="localitation_id"
          placeholder="ID de localización"
          value={company.localitation_id}
          onChange={(e) => setCompany({ ...company, localitation_id: Number(e.target.value) })}
          required
        />

        <TopicSelector topics={topics} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={company} setData={setCompany} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={company} setData={setCompany} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

        <button className="create-company__submit" type="submit">Guardar Empresa</button>
      </form>
    </div>
  );
};
