import React from "react";
import "./SelectedSubtopics.css";

interface SelectedSubtopicsProps<T, K extends keyof T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  subtopicsKey: K;
  subtopicsList?: { id: number; name: string }[]; // Lista opcional de referencia
}

const SelectedSubtopics = <T, K extends keyof T>({
  data,
  setData,
  subtopicsKey,
  subtopicsList = [],
}: SelectedSubtopicsProps<T, K>) => {
  const subtopicIds = data[subtopicsKey] as number[];

  const handleRemoveSubtopic = (id: number) => {
    setData({ ...data, [subtopicsKey]: subtopicIds.filter((s) => s !== id) } as T);
  };

  return subtopicIds.length > 0 ? (
    <div className="selected-subtopics">
      <label>Subtemas seleccionados:</label>
      <ul>
        {subtopicIds.map((id) => {
          const sub = subtopicsList.find((s) => s.id === id) || { id, name: `Subtema ${id}` };
          return (
            <li key={id}>
              {sub.name} <button onClick={() => handleRemoveSubtopic(id)}>❌</button>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
};

export default SelectedSubtopics;
