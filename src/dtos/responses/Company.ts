import { UserMinimalResponse } from "./User";
import { LocalitationResponse } from "./Localitation";
import { SubtopicMinimalResponse } from "./Subtopic";

export interface CompanyGetAllResponse {
    id: number;
    name: string;
    user: UserMinimalResponse;
}

export interface CompanyGetAllByUserIDResponse {
    id: number;
    name: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface CompanyGetResponse {
    id: number;
    name: string;
    industry: string;
    website?: string;
    email?: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    localitation?: LocalitationResponse;
    subtopics: SubtopicMinimalResponse[];
}