import { UserResponseDto } from "./User";

export interface JobBoardCreateDto {
    title: string;
    company: string;
    description: string;
    type?: string;
    salary_range: string;
    link: string;
    subtopic_ids: number[];
}

export interface JobBoardResponseDto {
    title: string;
    company: string;
    description: string;
    type?: string;
    salary_range: string;
    link: string;
    subtopics: { name: string }[];
    user: UserResponseDto;
}