import { Subtopic } from "./subtopic";

export interface News {
    title: string;
    description: string;
    image: string;
    link: string;
    date: string;
    subtopics: Subtopic[];
}