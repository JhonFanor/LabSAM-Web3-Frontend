import { UserResponseDto } from "./User";

export interface DocumentationCreateDto {
    title: string;
    description: string;
    link: string;
    subtopic_ids: number[];
}

export interface DocumentationResponseDto {
    title: string;
    description: string;
    link: string;
    subtopics: { name: string }[];
    user: UserResponseDto;
}