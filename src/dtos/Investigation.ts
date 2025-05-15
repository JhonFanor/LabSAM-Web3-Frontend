export interface InvestigationCreateDto {
    title: string;
    description: string;
    date: string;
    link: string
    subtopic_ids: number[];
}