import { InvestigationCreateRequest, InvestigationUpdateRequest } from "../dtos/requests/Investigation";
import { InvestigationGetResponse } from "../dtos/responses/Investigation";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
import { ApprovalRequest } from "../dtos/responses/Approval";
import { SubtopicCountResponse } from "../dtos/responses/SubtopicCount";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/investigation`;

export const createInvestigation = async (investigation: InvestigationCreateRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(investigation),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Error al crear la investigación");
    }
};

export const getAllInvestigation = async (page: number, limit: number) => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las investigaciones");
    }

    const data = await response.json();
    return data;
};

export const getAllInvestigationsByUserID = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la investigación");
    }

    const data = await response.json();
    return data;
};

export const getAllInvestigationsNotApproved = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las investigaciones no aprobadas");
    }

    const data = await response.json();
    return data;
};

export const countInvestigationsNotApproved = async (): Promise<CountResponse> => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar investigaciones no aprobadas");
    }

    const data = await response.json();
    return data as CountResponse;
};

export const countInvestigationBySubtopic = async (): Promise<SubtopicCountResponse[]> => {
    const response = await fetch(`${BASE_URL}/count-by-subtopic`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar investigaciones por subtema");
    }

    const data = await response.json();
    return data as SubtopicCountResponse[];
};

export const getInvestigationById = async (id: number): Promise<InvestigationGetResponse> => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la investigación");
    }

    const data = await response.json();
    return data as InvestigationGetResponse;
};

export const getYearsWithInvestigations = async () => {
    const response = await FetchWithAuth(`${BASE_URL}/years`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener los años con investigaciones");
    }

    const data = await response.json();
    return data;
};

export const updateInvestigation = async (id: number, investigation: InvestigationUpdateRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(investigation),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la investigación");
    }
};

export const setInvestigationApproval = async (id: number, approvalData: ApprovalRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
        method: "PUT",
        body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al aprobar o rechazar la investigación");
    }
};

export const deleteInvestigation = async (id: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la noticia");
    }
};
