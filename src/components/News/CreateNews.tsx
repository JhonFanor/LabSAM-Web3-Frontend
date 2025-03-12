import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import { FaTimes } from "react-icons/fa";
import "./CreateNews.css";

interface Topic {
    id: number;
    name: string;
    subtopics: Subtopic[];
}

interface Subtopic {
    id: number;
    name: string;
}

interface CreateNewsProps {
    onClose: () => void;
}

export const CreateNews: React.FC<CreateNewsProps> = ({ onClose }) => {
    const editor = useRef(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [news, setNews] = useState({
        title: "",
        description: "",
        image: "",
        link: "",
        date: "",
        subtopics: [] as Subtopic[],
    });

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch("http://localhost:8080/topic/get/all");
                const data = await response.json();
                const formattedTopics = data.map((topic: any) => ({
                    id: topic.id,
                    name: topic.name,
                    subtopics: topic.subtopic.map((sub: any) => ({
                        id: sub.ID,
                        name: sub.Name,
                    })),
                }));
                setTopics(formattedTopics);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchTopics();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNews({ ...news, [e.target.name]: e.target.value });
    };

    const handleSelectTopic = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTopic(Number(e.target.value));
    };

    const handleSelectSubtopic = (subtopic: Subtopic) => {
        if (!news.subtopics.find((s) => s.id === subtopic.id)) {
            setNews({ ...news, subtopics: [...news.subtopics, subtopic] });
        }
    };

    const handleRemoveSubtopic = (id: number) => {
        setNews({ ...news, subtopics: news.subtopics.filter((s) => s.id !== id) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const token = localStorage.getItem("access_token");
    
        if (!token) {
            alert("No tienes una sesión activa.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/news/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: news.title,
                    description: news.description, // Se enviará en formato HTML
                    image: news.image,
                    link: news.link,
                    date: new Date(news.date).toISOString(),
                    subtopic_ids: news.subtopics.map(sub => sub.id),
                }),
            });
    
            if (response.status === 401) {
                alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                return;
            }
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al crear la noticia");
            }
    
            alert("Noticia creada con éxito!");
            setNews({
                title: "",
                description: "",
                image: "",
                link: "",
                date: "",
                subtopics: [],
            });
            setSelectedTopic(null);
        } catch (error) {
            console.error("Error al enviar la noticia:", error);
            alert("Hubo un error al crear la noticia.");
        }
    };

    return (
        <div className="create-news__modal">
            <div className="create-news__content">
                <button className="create-news__close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <h2 className="create-news__title">Crear Noticia</h2>
                <form className="create-news__form" onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Título" value={news.title} onChange={handleChange} required />
                    <input type="text" name="image" placeholder="URL de la imagen" value={news.image} onChange={handleChange} required />
                    
                    {/* JoditEditor en lugar de textarea */}
                    <JoditEditor
                        ref={editor}
                        value={news.description}
                        onChange={(content) => setNews({ ...news, description: content })}
                    />

                    <input type="text" name="link" placeholder="Fuente" value={news.link} onChange={handleChange} />
                    <input type="date" name="date" value={news.date} onChange={handleChange} />

                    <div className="create-news__subtopics">
                        <label>Seleccionar un tema:</label>
                        <select className="create-news__select" onChange={handleSelectTopic}>
                            <option value="">-- Selecciona un tema --</option>
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedTopic && (
                        <div className="create-news__subtopics-list">
                            <label>Seleccionar subtemas:</label>
                            {topics
                                .find((topic) => topic.id === selectedTopic)
                                ?.subtopics.map((sub) => (
                                    <div key={sub.id} className="create-news__subtopic">
                                        <input type="checkbox" onChange={() => handleSelectSubtopic(sub)} />
                                        <span>{sub.name}</span>
                                    </div>
                                ))}
                        </div>
                    )}

                    {news.subtopics.length > 0 && (
                        <div className="create-news__selected-subtopics">
                            <label>Subtemas seleccionados:</label>
                            <ul>
                                {news.subtopics.map((sub) => (
                                    <li key={sub.id}>
                                        {sub.name} <button onClick={() => handleRemoveSubtopic(sub.id)}>❌</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button className="create-news__submit" type="submit">Guardar Noticia</button>
                </form>
            </div>
        </div>
    );
};
