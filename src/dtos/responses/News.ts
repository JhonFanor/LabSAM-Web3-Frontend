import { UserMinimalResponse } from "./User";
import { SubtopicGetResponse } from "./Subtopic";

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
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface NewsGetResponse {
    id: number;
    title: string;
    image: string;
    description: string;
    date: string;
    link?: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    subtopics: SubtopicGetResponse[];
}
