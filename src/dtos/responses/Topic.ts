import { SubtopicGetResponse } from "./Subtopic";

export interface TopicGetAllResponse {
    id: number;
    name: string;
    subtopics: SubtopicGetResponse[];
}
  