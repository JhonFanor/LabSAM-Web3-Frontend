import { UserMinimalResponse } from "./User";
import { SubtopicGetResponse } from "./Subtopic";
import { TypeOfLawResponse } from "./TypeOfLaw";

export interface LegislationGetAllResponse {
    id: number;
    title: string;
    logo: string;
    date: string;
    user: UserMinimalResponse;
}

export interface LegislationGetAllByUserIDResponse {
    id: number;
    title: string;
    logo: string;
    date: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface LegislationGetResponse {
    id: number;
    title: string;
    description: string;
    logo: string;
    date: string;
    link: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    type_of_law: TypeOfLawResponse;
    subtopics: SubtopicGetResponse[];
}

