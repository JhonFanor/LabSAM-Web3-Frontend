export interface EducationalOfferCreateDto {
    title: string;
    institution: string;
    start_date: string;
    end_date: string;
    cost: number;
    description: string;
    link: string;
    subtopic_ids: number[];
}