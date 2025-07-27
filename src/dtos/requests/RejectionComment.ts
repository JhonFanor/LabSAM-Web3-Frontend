export interface RejectionCommentCreateRequest {
  resource_type: string;
  resource_id: number;
  comment: string;
}

export interface RejectionCommentUpdateRequest {
  comment: string;
}
