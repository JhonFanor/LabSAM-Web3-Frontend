import { NewsCreateRequest, NewsUpdateRequest } from "../dtos/requests/News";
import { NewsGetResponse } from "../dtos/responses/News";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
import { ApprovalRequest } from "../dtos/responses/Approval";
import { SubtopicCountResponse } from "../dtos/responses/SubtopicCount";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/news`;

export const createNews = async (news: NewsCreateRequest) => {
    const response = await FetchWithAuth(BASE_URL, {
        method: "POST",
        body: JSON.stringify(news),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Error al crear la noticia");
    }
};

export const getAllNews = async (page: number, limit: number) => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las noticias");
    }

    const data = await response.json();
    return data;
};

export const getAllNewsByUserID = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la noticia");
    }

    const data = await response.json();
    return data;
};

export const getAllNewsNotApproved = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las noticias no aprobadas");
    }

    const data = await response.json();
    return data;
};

export const countNewsNotApproved = async (): Promise<CountResponse> => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar noticias no aprobadas");
    }

    const data = await response.json();
    return data as CountResponse;
};

export const countNewsBySubtopic = async (): Promise<SubtopicCountResponse[]> => {
    const response = await fetch(`${BASE_URL}/count-by-subtopic`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar noticias por subtema");
    }

    const data = await response.json();
    return data as SubtopicCountResponse[];
};

export const getNewsById = async (id: number): Promise<NewsGetResponse> => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la noticia");
    }

    const data = await response.json();
    return data as NewsGetResponse;
};

export const updateNews = async (id: number, news: NewsUpdateRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(news),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la noticia");
    }
};

export const setNewsApproval = async (id: number, approvalData: ApprovalRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
        method: "PUT",
        body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar estado de aprobación");
    }
};

export const deleteNews = async (id: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la noticia");
    }
};
