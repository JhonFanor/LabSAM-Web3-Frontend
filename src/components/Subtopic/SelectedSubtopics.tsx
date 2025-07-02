import React from "react";
import "./SelectedSubtopics.css";

interface SelectedSubtopicsProps<T, K extends keyof T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  subtopicsKey: K;
  subtopicsList?: { id: number; name: string }[];
}

export const SelectedSubtopics = <T, K extends keyof T>({ data, setData, subtopicsKey, subtopicsList = [], }: SelectedSubtopicsProps<T, K>) => {
  const subtopicIds = data[subtopicsKey] as number[];

  const handleRemoveSubtopic = (id: number) => {
    setData({ ...data, [subtopicsKey]: subtopicIds.filter((s) => s !== id) } as T);
  };

  return subtopicIds.length > 0 ? (
    <div className="subtopics">
      <label>Subtemas seleccionados:</label>
      <ul className="subtopics__list">
        {subtopicIds.map((id) => {
          const sub = subtopicsList.find((s) => s.id === id) || { id, name: `Subtema ${id}` };
          return (
            <li key={id} className="subtopics__list-item">
              {sub.name} <button className="subtopics__list-button" onClick={() => handleRemoveSubtopic(id)}>❌</button>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
};