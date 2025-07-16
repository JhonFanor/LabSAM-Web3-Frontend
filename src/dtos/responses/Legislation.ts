import { UserMinimalResponse } from "./User";
import { SubtopicMinimalResponse } from "./Subtopic";

export interface LegislationGetAllResponse {
    id: number;
    title: string;
    user: UserMinimalResponse;
}

export interface LegislationGetAllByUserIDResponse {
    id: number;
    title: string;
    is_approved: boolean;
    user: UserMinimalResponse;
}

export interface LegislationGetResponse {
    id: number;
    title: string;
    description: string;
    link: string;
    user: UserMinimalResponse;
    subtopics: SubtopicMinimalResponse[];
}