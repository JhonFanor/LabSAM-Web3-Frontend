export interface InvestigationCreateRequest {
    title: string;
    description: string;
    date: string;
    link: string
    subtopic_ids: number[];
}

export interface InvestigationUpdateRequest {
    title?: string;
    description?: string;
    date?: string;
    link?: string
}