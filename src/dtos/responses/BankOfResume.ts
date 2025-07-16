import { UserMinimalResponse } from "./User";
import { SubtopicMinimalResponse } from "./Subtopic";

export interface BankOfResumeGetAllResponse {
    id: number;
    photo: string;
    title: string;
    user: UserMinimalResponse;
}

export interface BankOfResumeGetAllByUserIDResponse {
    id: number;
    photo: string;
    title: string;
    is_approved: boolean;
    user: UserMinimalResponse;
}

export interface BankOfResumeGetResponse {
    id: number;
    photo: string;
    title: string;
    summary: string;
    link: string;
    user: UserMinimalResponse;
    subtopics: SubtopicMinimalResponse[];
}

