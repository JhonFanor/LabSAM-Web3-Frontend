export interface NewsCreateRequest {
    title: string;
    image: string;
    description: string;
    link: string;
    date: string;
    subtopic_ids: number[];
}

export interface NewsUpdateRequest {
    title?: string;
    image?: string;
    description?: string;
    link?: string;
    date?: string;
}