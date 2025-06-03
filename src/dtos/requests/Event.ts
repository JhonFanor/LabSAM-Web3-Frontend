export interface EventCreateRequest {
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

export interface EventUpdateRequest {
    title?: string;
    image?: string;
    description?: string;
    link?: string;
    date?: string;
    localitation?: {
        address: string;
        latitude: number;
        longitude: number;
    };
}

