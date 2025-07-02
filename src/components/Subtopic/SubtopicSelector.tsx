import React from "react";
import { Topic } from "../../models/Topic";
import "./SubtopicSelector.css";

interface SubtopicSelectorProps<T extends object, K extends keyof T> {
  topics: Topic[];
  selectedTopic: number | null;
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  subtopicsKey: K;
}

export const SubtopicSelector = <T extends object, K extends keyof T>({ topics, selectedTopic, data, setData, subtopicsKey, }: SubtopicSelectorProps<T, K>) => {
  const subtopicIds = data[subtopicsKey] as number[];

  const handleSelectSubtopic = (subtopicId: number) => {
    if (!subtopicIds.includes(subtopicId)) {
      setData({ ...data, [subtopicsKey]: [...subtopicIds, subtopicId] } as T);
    }
  };

  const handleDeselectSubtopic = (subtopicId: number) => {
    setData({ ...data, [subtopicsKey]: subtopicIds.filter((id) => id !== subtopicId) } as T);
  };

  return selectedTopic ? (
    <div className="subtopics-list">
      <label>Seleccionar subtemas:</label>
      {topics
        .find((topic) => topic.id === selectedTopic)
        ?.subtopics.map((sub) => (
          <div key={sub.id} className="subtopic">
            <input
              type="checkbox"
              checked={subtopicIds.includes(sub.id)}
              onChange={() =>
                subtopicIds.includes(sub.id)
                  ? handleDeselectSubtopic(sub.id)
                  : handleSelectSubtopic(sub.id)
              }
            />
            <span>{sub.name}</span>
          </div>
        ))}
    </div>
  ) : null;
};