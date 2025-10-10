export interface CompanyCreateRequest {
    name: string;
    logo: string;
    industry: string;
    website?: string;
    email?: string;
    projects: string;
    localitation?: {
        address: string;
        latitude: number;
        longitude: number;
    };
    subtopic_ids: number[];
}

export interface CompanyUpdateRequest {
    name: string;
    logo: string;
    industry: string;
    website?: string;
    email?: string;
    projects: string;
    localitation?: {
        address: string;
        latitude: number;
        longitude: number;
    } | null;
}