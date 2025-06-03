export interface BankOfResumeCreateRequest {
    photo: string;
    title: string;
    summary: string;
    link: string;
    subtopic_ids: number[];
}

export interface BankOfResumeUpdateRequest {
    photo?: string;
    title?: string;
    summary?: string;
    link?: string;
}
