import { CurrencyTypeRequest } from "./CurrencyType";

export interface EducationalOfferCreateRequest {
    title: string;
    institution: string;
    logo?: string;
    start_date: string;
    end_date: string;
    cost: number;
    description: string;
    link: string;
    type_education_id: number;
    currency_type?: CurrencyTypeRequest | null;
    subtopic_ids: number[];
}

export interface EducationalOfferUpdateRequest {
    title: string;
    institution: string;
    logo?: string;
    start_date: string;
    end_date: string;
    cost: number;
    description: string;
    link: string;
    type_education_id: number;
    currency_type?: CurrencyTypeRequest | null;
}
