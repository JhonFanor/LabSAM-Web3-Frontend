import { UserMinimalResponse } from "./User";
import { SubtopicGetResponse } from "./Subtopic";

export interface InvestigationGetAllResponse {
    id: number;
    title: string;
    user: UserMinimalResponse;
}

export interface InvestigationGetAllByUserIDResponse {
    id: number;
    title: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface InvestigationGetResponse {
    id: number;
    title: string;
    description: string;
    date: string;
    link: string
    is_approved: boolean | null;
    user: UserMinimalResponse;
    subtopics: SubtopicGetResponse[];
}