export interface CompanyCreateRequest {
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

export interface CompanyUpdateRequest {
    name?: string;
    industry?: string;
    website?: string;
    email?: string;
    localitation?: {
        address: string;
        latitude: number;
        longitude: number;
    };
}