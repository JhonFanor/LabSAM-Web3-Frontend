import { UserMinimalResponse } from "./User";
import { SubtopicMinimalResponse } from "./Subtopic";

export interface EducationalOfferGetAllResponse {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    cost: number;
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
    user: UserMinimalResponse;
    subtopics: SubtopicMinimalResponse[];
}