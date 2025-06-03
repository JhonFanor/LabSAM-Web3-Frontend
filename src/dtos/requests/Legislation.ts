export interface LegislationCreateRequest {
    title: string;
    description: string;
    link: string;
    subtopic_ids: number[];
}

export interface LegislationUpdateRequest {
    title?: string;
    description?: string;
    link?: string;
}