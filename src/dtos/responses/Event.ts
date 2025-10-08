import { UserMinimalResponse } from "./User";
import { LocalitationResponse } from "./Localitation";
import { SubtopicGetResponse } from "./Subtopic";

export interface EventGetAllResponse {
    id: number;
    title: string;
    image?: string;
    poster?: string;
    description: string;
    date: string;
    localitation?: LocalitationResponse;
    user: UserMinimalResponse;
}

export interface EventGetAllByUserIDResponse {
    id: number;
    title: string;
    image?: string;
    poster?: string;
    date: string;
    description: string;
    localitation?: LocalitationResponse;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}


export interface EventGetResponse {
    id: number;
    title: string;
    image?: string;
    poster?: string;
    description: string;
    link: string;
    registration_link: string;
    date: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    localitation: LocalitationResponse;
    subtopics: SubtopicGetResponse[];
}
