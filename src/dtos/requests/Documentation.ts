export interface DocumentationCreateRequest {
    title: string;
    description: string;
    link: string;
    subtopic_ids: number[];
}

export interface DocumentationUpdateRequest {
    title?: string;
    description?: string;
    link?: string;
}