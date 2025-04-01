import { Subtopic } from "./Subtopic";

export interface Topic {
    id: number;
    name: string;
    subtopics: Subtopic[];
}
  