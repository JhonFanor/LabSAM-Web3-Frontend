export interface EducationalOfferCreateRequest {
    title: string;
    institution: string;
    start_date: string;
    end_date: string;
    cost: number;
    description: string;
    link: string;
    subtopic_ids: number[];
}

export interface EducationalOfferUpdateRequest {
    title?: string;
    institution?: string;
    start_date?: string;
    end_date?: string;
    cost?: number;
    description?: string;
    link?: string;
}