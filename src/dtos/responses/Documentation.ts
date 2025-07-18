import { UserMinimalResponse } from "./User";
import { SubtopicGetResponse } from "./Subtopic";

export interface DocumentationGetAllResponse {
    id: number;
    title: string;
    user: UserMinimalResponse;
}

export interface DocumentationGetAllByUserIDResponse {
    id: number;
    title: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface DocumentationGetResponse {
    id: number;
    title: string;
    description: string;
    link: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    subtopics: SubtopicGetResponse[];
}