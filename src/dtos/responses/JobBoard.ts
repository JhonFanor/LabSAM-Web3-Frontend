import { UserMinimalResponse } from "./User";
import { SubtopicMinimalResponse } from "./Subtopic";

export interface JobBoardGetAllResponse {
    id: number;
    title: string;
    company: string;
    user: UserMinimalResponse;
}

export interface JobBoardGetAllByUserIDResponse {
    id: number;
    title: string;
    company: string;
    is_approved: boolean;
    user: UserMinimalResponse;
}

export interface JobBoardGetResponse {
    id: number;
    title: string;
    company?: string;
    description: string;
    type?: string;
    salary_range?: string;
    link: string;
    user: UserMinimalResponse;
    subtopics: SubtopicMinimalResponse[];
}