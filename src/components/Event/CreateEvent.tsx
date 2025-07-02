import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { createEvent } from "../../api/EventApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import Localitation from "../Localitation/Localitation.tsx";
import "./CreateEvent.css";
import { Topic } from "../../models/Topic.ts";
import { EventCreateRequest } from "../../dtos/requests/Event";
import ImageInputSelector from "../Selector/ImageInputSelector.tsx";
import { uploadImageFile } from "../../api/Upload.ts";

interface CreateEventProps {
  onClose: () => void;
}

export const CreateEvent: React.FC<CreateEventProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [event, setEvent] = useState<EventCreateRequest>({
    title: "",
    image: "",
    description: "",
    link: "",
    date: "",
    localitation: undefined,
    subtopic_ids: [],
  });

  const [localitation, setLocalitation] = useState< { address: string; latitude: number; longitude: number } | undefined >(undefined);

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);

  const allSubtopics = topics.flatMap((topic) => topic.subtopics);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {

      let imagePath = event.image;
      
      if (selectedImageFile) {
        try {
          imagePath = await uploadImageFile(selectedImageFile, "event");
        } catch (uploadError) {
          setUploading(false);
          console.error("Error al subir imagen:", uploadError);
          alert("No se pudo subir la imagen. Por favor, inténtalo de nuevo.");
          return;
        }
      }

      const eventToSend: EventCreateRequest = {
        ...event,
        image: imagePath,
        ...(localitation && { localitation }),
        date: event.date ? new Date(event.date).toISOString() : "",
      };

      await createEvent(eventToSend);

      setSelectedTopic(null);
      setUploading(false);
      setSelectedImageFile(null);
      setEvent({ 
        title: "", 
        description: "", 
        link: "", date: "", 
        image: "", 
        localitation: undefined, 
        subtopic_ids: [], 
      });
    } catch (error) {
      console.error("Error al guardar evento:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="create-event">
      <button className="create-event__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-event__title">Crear Evento</h2>
      <form className="create-event__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} required/>

        <ImageInputSelector value={event.image} onChange={(img) => setEvent({ ...event, image: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" />

        <JoditEditor value={event.description} onChange={(content) => setEvent({ ...event, description: content })} className="jodit-container" />

        <input type="text" name="link" placeholder="Enlace" value={event.link} onChange={(e) => setEvent({ ...event, link: e.target.value })} required />

        <input type="date" name="date" value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} required />

        <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={event} setData={setEvent} subtopicsKey="subtopic_ids"/>
        <SelectedSubtopics data={event} setData={setEvent} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics}/>

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

        <button className="create-event__submit" type="submit" disabled={uploading} >
          {uploading ? "Guardando..." : "Guardar Evento"}
        </button>
      </form>
    </div>
  );
};
