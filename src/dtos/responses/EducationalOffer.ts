import { UserMinimalResponse } from "./User";
import { SubtopicGetResponse } from "./Subtopic";

export interface EducationalOfferGetAllResponse {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    cost: number;
    user: UserMinimalResponse;
}

export interface EducationalOfferGetAllByUserIDResponse {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    cost: number;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface EducationalOfferGetResponse {
    id: number;
    title: string;
    institution: string;
    start_date: string;
    end_date: string;
    cost: number;
    description: string;
    link: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    subtopics: SubtopicGetResponse[];
}