export interface InvestigationCreateRequest {
    title: string;
    author: string;
    description: string;
    logo?: string;
    date: string;
    link: string
    subtopic_ids: number[];
}

export interface InvestigationUpdateRequest {
    title: string;
    author: string;
    description: string;
    logo?: string;
    date: string;
    link: string
}
