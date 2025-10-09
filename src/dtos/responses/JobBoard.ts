import { UserMinimalResponse } from "./User";
import { SubtopicGetResponse } from "./Subtopic";
import { CurrencyTypeRespone } from "./CurrencyType";

export interface JobBoardGetAllResponse {
    id: number;
    title: string;
    logo: string;
    company: string;
    user: UserMinimalResponse;
}

export interface JobBoardGetAllByUserIDResponse {
    id: number;
    title: string;
    logo: string;
    company: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
}

export interface JobBoardGetResponse {
    id: number;
    title: string;
    logo: string;
    company?: string;
    description: string;
    type?: string;
    salary_range?: string;
    link: string;
    start_date: string;
    end_date: string;
    is_approved: boolean | null;
    user: UserMinimalResponse;
    currency_type: CurrencyTypeRespone;
    subtopics: SubtopicGetResponse[];
}
