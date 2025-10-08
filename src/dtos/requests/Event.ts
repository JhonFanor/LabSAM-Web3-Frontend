export interface EventCreateRequest {
    title: string;
    image?: string;
    poster?: string;
    description: string;
    link?: string;
    registration_link?: string;
    date: string;
    localitation: {
        address: string;
        latitude?: number | null;
        longitude?: number | null;
    };
    subtopic_ids: number[];
}

export interface EventUpdateRequest {
    title: string;
    image?: string;
    poster?: string;
    description: string;
    link?: string;
    registration_link?: string;
    date: string;
    localitation: {
        address: string;
        latitude?: number | null;
        longitude?: number | null;
    } | null;
}