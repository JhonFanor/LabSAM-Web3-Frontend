import { UserResponseDto } from "./User";

export interface BankOfResumeCreateDto {
    photo: string;
    title: string;
    summary: string;
    link: string;
    subtopic_ids: number[];
}

export interface BankOfResumeResponseDto {
    photo: string;
    title: string;
    summary: string;
    link: string;
    subtopics: { name: string }[];
    user: UserResponseDto;
}