import React from "react";
import { News } from "../../models/news";
import "./SelectedSubtopics.css"

interface SelectedSubtopicsProps {
  news: News;
  setNews: React.Dispatch<React.SetStateAction<News>>;
}

const SelectedSubtopics: React.FC<SelectedSubtopicsProps> = ({ news, setNews }) => {
  const handleRemoveSubtopic = (id: number) => {
    setNews({ ...news, subtopics: news.subtopics.filter((s) => s.id !== id) });
  };

  return news.subtopics.length > 0 ? (
    <div className="selected-subtopics">
      <label>Subtemas seleccionados:</label>
      <ul>
        {news.subtopics.map((sub) => (
          <li key={sub.id}>
            {sub.name} <button onClick={() => handleRemoveSubtopic(sub.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default SelectedSubtopics;
