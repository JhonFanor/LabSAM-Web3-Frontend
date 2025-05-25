import { UserResponseDto } from "./User";

export interface CompanyCreateDto {
    name: string;
    industry: string;
    website?: string;
    email?: string;
    localitation?: {
        address: string;
        latitude: number;
        longitude: number;
    };
    subtopic_ids: number[];
}

export interface CompanyResponseDto {
    name: string;
    industry: string;
    website?: string;
    email?: string;
    localitation?: {
        address: string;
        latitude: number;
        longitude: number;
    };
    subtopics: { name: string }[];
    user: UserResponseDto;
}