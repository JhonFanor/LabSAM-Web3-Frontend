import React, { useState, useEffect } from "react";
import { createCompany, getAllTopics } from "../../api";
import { TopicGetAllResponse } from "../../dtos/responses";
import { CompanyCreateRequest } from "../../dtos/requests";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, Localitation } from "../../components";
import "./CreateCompany.css";

interface CreateCompanyProps {
  onClose: () => void;
}

export const CreateCompany: React.FC<CreateCompanyProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  
  const [company, setCompany] = useState<CompanyCreateRequest>({
    name: "",
    industry: "",
    website: "",
    email: "",
    localitation: undefined,
    subtopic_ids: [],
  });

  const [localitation, setLocalitation] = useState<{ address: string; latitude: number; longitude: number } | undefined >(undefined);

  useEffect(() => {
    getAllTopics(setTopics);
  }, []);

  const allSubtopics = topics.flatMap(topic => topic.subtopics);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const companyToSend: CompanyCreateRequest = {
        ...company,
        ...(localitation) && {localitation},
      }

      await createCompany(companyToSend);

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
      setLocalitation(undefined);
    } catch (error) {
      console.error("Error al guardar la Empresa:", error);
    }
  };

  return (
    <div className="create-company">
      <ButtonClose onClick={onClose}/>
      <h2 className="create-company__title">Crear Empresa</h2>
      <form className="create-company__form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nombre de la empresa" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} required />
        <input type="text" name="industry" placeholder="Industria" value={company.industry} onChange={(e) => setCompany({ ...company, industry: e.target.value })} required />
        <input type="text" name="website" placeholder="Sitio web" value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
        <input type="email" name="email" placeholder="Correo electrónico" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} required />

        <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
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
