import React from "react";
import { Topic } from "../../models/topic";
import { News } from "../../models/news";
import { Subtopic } from "../../models/subtopic";
import "./SubtopicSelector.css"

interface SubtopicSelectorProps {
  topics: Topic[];
  selectedTopic: number | null;
  news: News;
  setNews: React.Dispatch<React.SetStateAction<News>>;
}

const SubtopicSelector: React.FC<SubtopicSelectorProps> = ({ topics, selectedTopic, news, setNews }) => {
  const handleSelectSubtopic = (subtopic: Subtopic) => {
    if (!news.subtopics.find((s) => s.id === subtopic.id)) {
      setNews({ ...news, subtopics: [...news.subtopics, subtopic] });
    }
  };

  return selectedTopic ? (
    <div className="subtopics-list">
      <label>Seleccionar subtemas:</label>
      {topics
        .find((topic) => topic.id === selectedTopic)
        ?.subtopics.map((sub) => (
          <div key={sub.id} className="subtopic">
            <input type="checkbox" onChange={() => handleSelectSubtopic(sub)} />
            <span>{sub.name}</span>
          </div>
        ))}
    </div>
  ) : null;
};

export default SubtopicSelector;
