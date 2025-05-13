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

interface CreateNewsProps {
  onClose: () => void;
}

export const CreateNews: React.FC<CreateNewsProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageOption, setImageOption] = useState<"url" | "file">("url");

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

      if (imageOption === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folder", "news");

        const res = await fetch("http://localhost:8080/api/upload/file", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data?.path) {
          imagePath = data.path;
        } else {
          throw new Error("Error al subir imagen");
        }
      }

      const newsToSend: NewsCreateDto = {
        ...news,
        image: imagePath,
        date: news.date ? new Date(news.date).toISOString() : "",
      };

      await createNews(newsToSend);

      setNews({ title: "", description: "", image: "", link: "", date: "", subtopic_ids: [] });
      setSelectedTopic(null);
      setSelectedFile(null);
      setImageOption("url");
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
        <input type="text" name="title" placeholder="Título" value={news.title} onChange={(e) => setNews({ ...news, title: e.target.value })} required/>

        <div className="image-option-selector">
          <div className={`image-option ${imageOption === "url" ? "selected" : ""}`} onClick={() => { setImageOption("url"); setSelectedFile(null); }} >
            📎 URL de imagen
          </div>
          <div className={`image-option ${imageOption === "file" ? "selected" : ""}`} onClick={() => { setImageOption("file"); setNews({ ...news, image: "" }); }}>
            🖼️ Subir imagen
          </div>
        </div>

        {imageOption === "url" && (
          <>
            <input type="text" name="image" placeholder="URL de la imagen" value={news.image} onChange={(e) => setNews({ ...news, image: e.target.value })}/>
            {news.image && (
              <div className="image-preview">
                <img src={news.image} alt="Vista previa" />
                <button type="button" className="remove-image-button"onClick={() => setNews({ ...news, image: "" })}>
                  Quitar URL
                </button>
              </div>
            )}
          </>
        )}

        {imageOption === "file" && (
          <>
            <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            {selectedFile && (
              <div className="image-preview">
                <p>{selectedFile.name}</p>
                <button type="button" className="remove-image-button"onClick={() => setSelectedFile(null)}>
                  Quitar archivo
                </button>
              </div>
            )}
          </>
        )}

        <JoditEditor value={news.description} onChange={(content) => setNews({ ...news, description: content })} className="jodit-container" />

        <input type="text" name="link" placeholder="Fuente" value={news.link} onChange={(e) => setNews({ ...news, link: e.target.value })} />

        <input type="date" name="date" value={news.date} onChange={(e) => setNews({ ...news, date: e.target.value })} />

        <TopicSelector topics={topics} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={news} setData={setNews} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={news} setData={setNews} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

        <button className="create-news__submit" type="submit" disabled={uploading}>
          {uploading ? "Guardando..." : "Guardar Noticia"}
        </button>
      </form>
    </div>
  );
};
