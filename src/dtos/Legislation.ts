import { UserResponseDto } from "./User";

export interface LegislationCreateDto {
    title: string;
    description: string;
    link: string;
    subtopic_ids: number[];
}

export interface LegislationResponseDto {
    title: string;
    description: string;
    link: string;
    subtopics: { name: string }[];
    user: UserResponseDto;
}