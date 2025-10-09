export interface LegislationCreateRequest {
    title: string;
    description: string;
    logo?: string;
    date: string;
    link: string;
    type_of_law_id: number;
    subtopic_ids: number[];
}

export interface LegislationUpdateRequest {
    title: string;
    description: string;
    logo?: string;
    date: string;
    link: string;
    type_of_law_id: number;
}
