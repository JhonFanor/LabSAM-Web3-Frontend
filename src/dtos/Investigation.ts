import { UserResponseDto } from "./User";

export interface InvestigationCreateDto {
    title: string;
    description: string;
    date: string;
    link: string
    subtopic_ids: number[];
}

export interface InvestigationResponseDto {
    title: string;
    description: string;
    date: string;
    link: string
    subtopics: { name: string }[];
    user: UserResponseDto;
}