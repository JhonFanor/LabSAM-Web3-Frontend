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
    user: {
        avatar: string;
        regular_user?: {
        name: string;
        };
        university_user?: {
        name: string;
        };
        business_user?: {
        name: string;
        };
    };
}

export interface Event {
    title: string;
    description: string;
    link: string;
    date: string;
    localitation: {
        address: string;
        latitude: number;
        longitude: number;
    };
    subtopic_ids: number[];
}