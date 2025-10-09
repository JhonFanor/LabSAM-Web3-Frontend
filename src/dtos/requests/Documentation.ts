export interface DocumentationCreateRequest {
    title: string;
    author: string;
    description: string;
    link: string;
    subtopic_ids: number[];
}

export interface DocumentationUpdateRequest {
    title: string;
    author: string;
    description: string;
    link: string;
}
