import React from "react";
import "./TopicSelector.css"
import { TopicGetAllResponse } from "../../dtos/responses";

interface TopicSelectorProps {
  topics: TopicGetAllResponse[];
  selectedTopic: number | null;
  setSelectedTopic: React.Dispatch<React.SetStateAction<number | null>>;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ topics, selectedTopic, setSelectedTopic }) => (
  <div className="topic">
    <label>Seleccionar un tema:</label>
    <select className="topic__select" value={selectedTopic ?? ""} onChange={(e) => setSelectedTopic(e.target.value ? Number(e.target.value) : null)} >
      <option value="">-- Selecciona un tema --</option>
      {topics.map((topic) => (
        <option key={topic.id} value={topic.id}>
          {topic.name}
        </option>
      ))}
    </select>
  </div>
);