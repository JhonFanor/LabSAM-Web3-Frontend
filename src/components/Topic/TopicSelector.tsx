import React from "react";
import { Topic } from "../../models/topic";
import "./TopicSelector.css"

interface TopicSelectorProps {
  topics: Topic[];
  setSelectedTopic: React.Dispatch<React.SetStateAction<number | null>>;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ topics, setSelectedTopic }) => (
  <div className="subtopics">
    <label>Seleccionar un tema:</label>
    <select className="create-news__select" onChange={(e) => setSelectedTopic(Number(e.target.value) || null)}>
      <option value="">-- Selecciona un tema --</option>
      {topics.map((topic) => (
        <option key={topic.id} value={topic.id}>
          {topic.name}
        </option>
      ))}
    </select>
  </div>
);

export default TopicSelector;
