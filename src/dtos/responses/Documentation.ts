import { UserMinimalResponse } from "./User";
import { SubtopicMinimalResponse } from "./Subtopic";

export interface DocumentationGetAllResponse {
    id: number;
    title: string;
    user: UserMinimalResponse;
}

export interface DocumentationGetAllByUserIDResponse {
    id: number;
    title: string;
    is_approved: boolean;
    user: UserMinimalResponse;
}

export interface DocumentationGetResponse {
    id: number;
    title: string;
    description: string;
    link: string;
    user: UserMinimalResponse;
    subtopics: SubtopicMinimalResponse[];
}