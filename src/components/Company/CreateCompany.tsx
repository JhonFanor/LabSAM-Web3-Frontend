import React, { useState, useEffect } from "react";
import { createCompany } from "../../api/CompanyApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateCompany.css";
import { Topic } from "../../models/Topic.ts";
import { CompanyCreateDto } from "../../dtos/Company";
import Localitation from "../Localitation/Localitation.tsx";

interface CreateCompanyProps {
  onClose: () => void;
}

export const CreateCompany: React.FC<CreateCompanyProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  
  const [company, setCompany] = useState<CompanyCreateDto>({
    name: "",
    industry: "",
    website: "",
    email: "",
    localitation: undefined,
    subtopic_ids: [],
  });

  const [localitation, setLocalitation] = useState<{ address: string; latitude: number; longitude: number } | undefined >(undefined);

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);

  const allSubtopics = topics.flatMap(topic => topic.subtopics);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCompany(company);

      setSelectedTopic(null);
      setLocalitation(undefined);

      setCompany({
        name: "",
        industry: "",
        website: "",
        email: "",
        localitation: undefined,
        subtopic_ids: [],
      });
    } catch (error) {
      console.error("Error al guardar la compañia:", error);
    }
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

        <TopicSelector topics={topics} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={company} setData={setCompany} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={company} setData={setCompany} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

        {!localitation ? (
          <button type="button" onClick={() => setLocalitation({ address: "", latitude: 4.5709, longitude: -74.2973,})} >
            Añadir localización
          </button>
        ) : (
          <div style={{ marginBottom: "1rem" }}>
            <Localitation value={localitation} onChange={setLocalitation} />
            <button type="button" className="remove-localitation-button" onClick={() => setLocalitation(undefined)} style={{ marginTop: "0.5rem", backgroundColor: "#f44336", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "4px", }} >
              Quitar localización
            </button>
          </div>
        )}


        <button className="create-company__submit" type="submit">
          Guardar Empresa
        </button>
      </form>
    </div>
  );
};
