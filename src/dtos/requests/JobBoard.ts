import { CurrencyTypeRequest } from "./CurrencyType";

export interface JobBoardCreateRequest {
    title: string;
    logo?: string;
    company: string;
    description: string;
    type?: string;
    salary_range?: string;
    link: string;
    start_date: string;
    end_date?: string;
    currency_type?: CurrencyTypeRequest;
    subtopic_ids: number[];
}

export interface JobBoardUpdateRequest {
    title: string;
    logo?: string;
    company: string;
    description: string;
    type?: string;
    salary_range?: string;
    link: string;
    start_date: string;
    end_date?: string;
    currency_type?: CurrencyTypeRequest;
}
