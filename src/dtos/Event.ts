import { UserResponseDto } from "./User";

export interface EventCreateDto {
    title: string;
    image: string;
    description: string;
    link: string;
    date: string;
    localitation?: {
        address: string;
        latitude: number;
        longitude: number;
    };
    subtopic_ids: number[];
}

export interface EventResponseDto {
    title: string;
    description: string;
    link: string;
    date: string;
    localitation?: {
        address: string;
        latitude: number;
        longitude: number;
    };
    subtopic_ids: number[];
    subtopics: { name: string }[];
    user: UserResponseDto;
}