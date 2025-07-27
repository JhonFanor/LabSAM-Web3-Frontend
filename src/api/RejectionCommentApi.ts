import { RejectionCommentCreateRequest, RejectionCommentUpdateRequest } from "../dtos/requests/RejectionComment";
import { RejectionCommentResponse } from "../dtos/responses/RejectionComment";
import { FetchWithAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/rejection-comments`;

export const createRejectionComment = async ( comment: RejectionCommentCreateRequest ) => {
    const response = await FetchWithAuth(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(comment),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el comentario de rechazo");
    }

    const data = await response.json();
    return data;
};

export const updateRejectionComment = async (
  id: number,
  comment: RejectionCommentUpdateRequest
): Promise<void> => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(comment),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el comentario de rechazo");
    }

};

export const deleteRejectionComment = async (id: number): Promise<void> => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el comentario de rechazo");
    }
};

export const getAllRejectionCommentsByResource = async (
  resourceType: string,
  resourceId: number
): Promise<RejectionCommentResponse[]> => {
    const response = await FetchWithAuth(`${BASE_URL}/${resourceType}/${resourceId}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener los comentarios de rechazo");
    }

    const data = await response.json();
    return data as RejectionCommentResponse[];
};

export const deleteAllRejectionCommentsIndividually = async (comments: { id: number }[]) => {
	await Promise.all(
		comments.map(async (comment) => {
			try {
				await deleteRejectionComment(comment.id);
			} catch (error) {
				console.error(`Error al eliminar comentario ${comment.id}:`, error);
			}
		})
	);
};