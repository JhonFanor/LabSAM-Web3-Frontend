import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { createEvent } from "../../api/EventApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateEvent.css";
import { Topic } from "../../models/Topic.ts";
import { Event } from "../../models/Event.ts";

interface CreateEventProps {
  onClose: () => void;
}

export const CreateEvent: React.FC<CreateEventProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [event, setEvent] = useState<Event>({
    title: "",
    description: "",
    link: "",
    date: "",
    subtopic_ids: [] as number[],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);
  
  const allSubtopics = topics.flatMap(topic => topic.subtopics);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent(event);
    setEvent({
      title: "",
      description: "",
      link: "",
      date: "",
      subtopic_ids: [],
    });
    setSelectedTopic(null);
  };

  return (
    <div className="create-event__content">
      <button className="create-event__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-event__title">Crear Evento</h2>
      <form className="create-event__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} required />
        
        <JoditEditor value={event.description} onChange={(content) => setEvent({ ...event, description: content })} className="jodit-container"/>
        
        <input type="text" name="link" placeholder="Enlace" value={event.link} onChange={(e) => setEvent({ ...event, link: e.target.value })} required />
        <input type="date" name="date" placeholder="Fecha" value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} required />
        
        <TopicSelector topics={topics} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={event} setData={setEvent} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={event} setData={setEvent} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-event__submit" type="submit">Guardar Evento</button>
      </form>
    </div>
  );
};
