import { UserMinimalResponse } from "./User";
import { SubtopicGetResponse } from "./Subtopic";

export interface LegislationGetAllResponse {
    id: number;
    title: string;
    user: UserMinimalResponse;
}

export interface LegislationGetAllByUserIDResponse {
    id: number;
    title: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface LegislationGetResponse {
    id: number;
    title: string;
    description: string;
    link: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    subtopics: SubtopicGetResponse[];
}