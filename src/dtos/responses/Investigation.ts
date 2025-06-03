import { UserMinimalResponse } from "./User";
import { SubtopicMinimalResponse } from "./Subtopic";

export interface InvestigationGetAllResponse {
    id: number;
    title: string;
    user: UserMinimalResponse;
}

export interface InvestigationGetResponse {
    id: number;
    title: string;
    description: string;
    date: string;
    link: string
    user: UserMinimalResponse;
    subtopics: SubtopicMinimalResponse[];
}