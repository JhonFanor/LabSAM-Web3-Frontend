import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { createEducationalOffer } from "../../api/EducationalOfferApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateEducationalOffer.css";
import { Topic } from "../../models/Topic.ts";
import { EducationalOfferCreateRequest } from "../../dtos/requests/EducationalOffer";
import { ButtonClose } from "../index.ts";

interface CreateEducationalOfferProps {
  onClose: () => void;
}

export const CreateEducationalOffer: React.FC<CreateEducationalOfferProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  
  const [educationalOffer, setEducationalOffer] = useState<EducationalOfferCreateRequest>({
    title: "",
    institution: "",
    start_date: "",
    end_date: "",
    cost: 0,
    description: "",
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
      const educationalOfferToSend: EducationalOfferCreateRequest = {
        ...educationalOffer,
        start_date: educationalOffer.start_date ? new Date(educationalOffer.start_date).toISOString() : "",
        end_date: educationalOffer.end_date ? new Date(educationalOffer.end_date).toISOString() : "", 
      };

      await createEducationalOffer(educationalOfferToSend);

      setSelectedTopic(null);
      setEducationalOffer({
        title: "",
        institution: "",
        start_date: "",
        end_date: "",
        cost: 0,
        description: "",
        link: "",
        subtopic_ids: [],
      });
    } catch (error) {
      console.error("Error al guardar la oferta educativa:", error)
    }
  };

  return (
    <div className="create-educational-offer">
      <ButtonClose onClick={onClose}/>
      <h2 className="create-educational-offer__title">Crear Oferta Educativa</h2>
      <form className="create-educational-offer__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={educationalOffer.title} onChange={(e) => setEducationalOffer({ ...educationalOffer, title: e.target.value })} required />
        <input type="text" name="institution" placeholder="Institución" value={educationalOffer.institution} onChange={(e) => setEducationalOffer({ ...educationalOffer, institution: e.target.value })} required />
        <input type="date" name="start_date" value={educationalOffer.start_date} onChange={(e) => setEducationalOffer({ ...educationalOffer, start_date: e.target.value })} required />
        <input type="date" name="end_date" value={educationalOffer.end_date} onChange={(e) => setEducationalOffer({ ...educationalOffer, end_date: e.target.value })} required />
        <input type="number" name="cost" placeholder="Costo" value={educationalOffer.cost} onChange={(e) => setEducationalOffer({ ...educationalOffer, cost: Number(e.target.value) })} required />
        
        <JoditEditor value={educationalOffer.description} onChange={(content) => setEducationalOffer({ ...educationalOffer, description: content })} className="jodit-container"/>

        <input type="url" name="link" placeholder="Enlace (opcional)" value={educationalOffer.link} onChange={(e) => setEducationalOffer({ ...educationalOffer, link: e.target.value })} />
        
        <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={educationalOffer} setData={setEducationalOffer} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={educationalOffer} setData={setEducationalOffer} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-educational-offer__submit" type="submit">Guardar Oferta Educativa</button>
      </form>
    </div>
  );
};
