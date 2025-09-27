import { LegislationCreateRequest, LegislationUpdateRequest } from "../dtos/requests/Legislation";
import { LegislationGetResponse } from "../dtos/responses/Legislation";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
import { ApprovalRequest } from "../dtos/responses/Approval";
import { SubtopicCountResponse } from "../dtos/responses/SubtopicCount";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/legislation`;

export const createLegislation = async (legislation: LegislationCreateRequest) => {
    const response = await FetchWithAuth(BASE_URL, {
        method: "POST",
        body: JSON.stringify(legislation),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Error al crear la legislación");
    }
};

export const getAllLegislation = async (page: number, limit: number) => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las legislaciones");
    }

    const data = await response.json();
    return data;
};

export const getAllLegislationsByUserID = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la legislación");
    }

    const data = await response.json();
    return data;
};

export const getAllLegislationsNotApproved = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las legislaciones no aprobadas");
    }

    const data = await response.json();
    return data;
};

export const countLegislationsNotApproved = async (): Promise<CountResponse> => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar legislaciones no aprobadas");
    }

    const data = await response.json();
    return data as CountResponse;
};

export const countLegislationBySubtopic = async (): Promise<SubtopicCountResponse[]> => {
    const response = await fetch(`${BASE_URL}/count-by-subtopic`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar legislaciones por subtema");
    }

    const data = await response.json();
    return data as SubtopicCountResponse[];
};

export const getLegislationById = async (id: number): Promise<LegislationGetResponse> => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la legislación");
    }

    const data = await response.json();
    return data as LegislationGetResponse;
};

export const updateLegislation = async (id: number, legislation: LegislationUpdateRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(legislation),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la legislación");
    }
};

export const setLegislationApproval = async (id: number, approvalData: ApprovalRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
        method: "PUT",
        body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar estado de aprobación");
    }
};

export const deleteLegislation = async (id: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la legislación");
    }
};
