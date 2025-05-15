export interface LegislationCreateDto {
    title: string;
    description: string;
    link: string;
    subtopic_ids: number[];
}