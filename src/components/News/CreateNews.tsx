import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import { createNews } from "../../api/NewsApi";
import { GetAllTopics } from "../../api/TopicApi";
import { NewsCreateDto } from "../../dtos/News";
import { Topic } from "../../models/Topic";
import { FaTimes } from "react-icons/fa";
import "./CreateNews.css";
import ImageInputSelector from "../Selector/ImageInputSelector";
import { uploadImageFile } from "../../api/Upload";

interface CreateNewsProps {
  onClose: () => void;
}

export const CreateNews: React.FC<CreateNewsProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [news, setNews] = useState<NewsCreateDto>({
    title: "",
    image: "",
    description: "",
    link: "",
    date: "",
    subtopic_ids: [],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);

  const allSubtopics = topics.flatMap((topic) => topic.subtopics);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imagePath = news.image;

      if (selectedImageFile) {
        try {
          imagePath = await uploadImageFile(selectedImageFile, "news");
        } catch (uploadError) {
          setUploading(false);
          console.error("Error al subir imagen:", uploadError);
          alert("No se pudo subir la imagen. Por favor, inténtalo de nuevo.");
          return;
        }
      }
  
      const newsToSend: NewsCreateDto = {
        ...news,
        image: imagePath,
        date: news.date ? new Date(news.date).toISOString() : "",
      };

      await createNews(newsToSend);
      
      setSelectedTopic(null);
      setUploading(false);
      setSelectedImageFile(null);
      setNews({ 
        title: "", 
        description: "", 
        image: "", 
        link: "", 
        date: "", 
        subtopic_ids: [] 
      });
    } catch (error) {
      console.error("Error al guardar noticia:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="create-news__content">
      <button className="create-news__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-news__title">Crear Noticia</h2>
      <form className="create-news__form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={news.title} onChange={(e) => setNews({ ...news, title: e.target.value })} required />

        <ImageInputSelector value={news.image} onChange={(img) => setNews({ ...news, image: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" />

        <JoditEditor value={news.description} onChange={(content) => setNews({ ...news, description: content })} className="jodit-container" />

        <input type="text" name="link" placeholder="Fuente" value={news.link} onChange={(e) => setNews({ ...news, link: e.target.value })} />

        <input type="date" name="date" value={news.date} onChange={(e) => setNews({ ...news, date: e.target.value })} />

        <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={news} setData={setNews} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={news} setData={setNews} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

        <button className="create-news__submit" type="submit" disabled={uploading} >
          {uploading ? "Guardando..." : "Guardar Noticia"}
        </button>
      </form>
    </div>
  );
};
