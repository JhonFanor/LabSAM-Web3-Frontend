import { UserMinimalResponse } from "./User";
import { SubtopicGetResponse } from "./Subtopic";

export interface DocumentationGetAllResponse {
    id: number;
    title: string;
    author: string;
    description: string;
    user: UserMinimalResponse;
}

export interface DocumentationGetAllByUserIDResponse {
    id: number;
    title: string;
    author: string;
    description: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface DocumentationGetResponse {
    id: number;
    title: string;
    author: string;
    description: string;
    link: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    subtopics: SubtopicGetResponse[];
}
