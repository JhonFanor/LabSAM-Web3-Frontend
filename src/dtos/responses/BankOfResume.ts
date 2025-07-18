import { SubtopicGetResponse } from "./Subtopic";
import { UserMinimalResponse } from "./User";

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
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface BankOfResumeGetResponse {
    id: number;
    photo: string;
    title: string;
    summary: string;
    link: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    subtopics: SubtopicGetResponse[];
}

