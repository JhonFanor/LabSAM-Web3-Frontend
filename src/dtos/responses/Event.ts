import { UserMinimalResponse } from "./User";
import { LocalitationResponse } from "./Localitation";
import { SubtopicMinimalResponse } from "./Subtopic";

export interface EventGetAllResponse {
    id: number;
    title: string;
    image: string;
    date: string;
    user: UserMinimalResponse;
}

export interface EventGetResponse {
    id: number;
    title: string;
    image: string;
    description: string;
    link: string;
    date: string;
    user: UserMinimalResponse;
    localitation: LocalitationResponse;
    subtopics: SubtopicMinimalResponse[];
}