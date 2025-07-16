import { UserMinimalResponse } from "./User";
import { SubtopicMinimalResponse } from "./Subtopic";

export interface NewsGetAllResponse {
    id: number;
    title: string;
    image: string;
    date: string;
    user: UserMinimalResponse;
}

export interface NewsGetAllByUserIDResponse {
    id: number;
    title: string;
    image: string;
    date: string;
    is_approved: boolean;
    user: UserMinimalResponse;
}

export interface NewsGetResponse {
    id: number;
    title: string;
    image: string;
    description: string;
    date: string;
    link?: string;
    user: UserMinimalResponse;
    subtopics: SubtopicMinimalResponse[];
}
