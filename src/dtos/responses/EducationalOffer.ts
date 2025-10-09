import { UserMinimalResponse } from "./User";
import { SubtopicGetResponse } from "./Subtopic";
import { TypeEducationResponse } from "./TypeEducation";
import { CurrencyTypeRequest } from "../requests/CurrencyType";

export interface EducationalOfferGetAllResponse {
    id: number;
    title: string;
    institution: string;
    logo?: string;
    start_date: string;
    end_date: string;
    currency_type: CurrencyTypeRequest;
    cost: number;
    description: string;
    type_education: TypeEducationResponse;
    user: UserMinimalResponse;
}

export interface EducationalOfferGetAllByUserIDResponse {
    id: number;
    title: string;
    institution: string;
    logo?: string;
    start_date: string;
    end_date: string;
    cost: number;
    description: string;
    type_education: TypeEducationResponse;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface EducationalOfferGetResponse {
    id: number;
    title: string;
    institution: string;
    logo: string;
    start_date: string;
    end_date: string;
    cost: number;
    description: string;
    link: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    type_education: TypeEducationResponse;
    currency_type: CurrencyTypeRequest;
    subtopics: SubtopicGetResponse[];
}
