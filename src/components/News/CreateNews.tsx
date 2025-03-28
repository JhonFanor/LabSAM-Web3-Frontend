import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import { createNews } from "../../api/NewsApi";
import { GetAllTopics } from "../../api/TopicApi";
import { News } from "../../models/news";
import { Topic } from "../../models/topic";
import "./CreateNews.css";
import { FaTimes } from "react-icons/fa";

interface CreateNewsProps {
    onClose: () => void;
}

export const CreateNews: React.FC<CreateNewsProps> = ({ onClose }) => {
const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [news, setNews] = useState<News>({
    title: "",
    description: "",
    image: "",
    link: "",
    date: "",
    subtopics: [],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNews(news);
    setNews({ title: "", description: "", image: "", link: "", date: "", subtopics: [] });
    setSelectedTopic(null);
  };

  return (
    <div className="create-news__content">
        <button className="create-news__close-button" onClick={onClose}>
            <FaTimes />
        </button>
        <h2 className="create-news__title">Crear Noticia</h2>
        <form className="create-news__form" onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Título" value={news.title} onChange={(e) => setNews({ ...news, title: e.target.value })} required />
            <input type="text" name="image" placeholder="URL de la imagen" value={news.image} onChange={(e) => setNews({ ...news, image: e.target.value })} required />
            
            <JoditEditor value={news.description} onChange={(content) => setNews({ ...news, description: content })} />

            <input type="text" name="link" placeholder="Fuente" value={news.link} onChange={(e) => setNews({ ...news, link: e.target.value })} />
            <input type="date" name="date" value={news.date} onChange={(e) => setNews({ ...news, date: e.target.value })} />

            <TopicSelector topics={topics} setSelectedTopic={setSelectedTopic} />
            <SubtopicSelector topics={topics} selectedTopic={selectedTopic} news={news} setNews={setNews} />
            <SelectedSubtopics news={news} setNews={setNews} />

            <button className="create-news__submit" type="submit">Guardar Noticia</button>
        </form>
    </div>
  );
};