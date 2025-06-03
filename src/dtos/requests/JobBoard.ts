export interface JobBoardCreateRequest {
    title: string;
    company: string;
    description: string;
    type?: string;
    salary_range: string;
    link: string;
    subtopic_ids: number[];
}

export interface JobBoardUpdateRequest {
    title?: string;
    company?: string;
    description?: string;
    type?: string;
    salary_range?: string;
    link?: string;
}
