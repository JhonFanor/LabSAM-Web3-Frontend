import { CompanyCreateRequest, CompanyUpdateRequest } from "../dtos/requests/Company";
import { ApprovalRequest } from "../dtos/responses/Approval";
import { CompanyGetResponse } from "../dtos/responses/Company";
import { CountResponse } from "../dtos/responses/Count";
import { SubtopicCountResponse } from "../dtos/responses/SubtopicCount";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/company`;

export const createCompany = async (company: CompanyCreateRequest) => {
    const response = await FetchWithAuth(BASE_URL, {
        method: "POST",
        body: JSON.stringify(company),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear la compañia");
    }
};

export const getAllCompany = async (page: number, limit: number) => {
    const response = await FetchWithOptionalAuth(
        `${BASE_URL}?page=${page}&limit=${limit}`,
        {
        method: "GET",
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las compañías");
    }

    const data = await response.json();
    return data;
};

export const getAllCompaniesByUserID = async (page: number, limit: number) => {
    const response = await FetchWithAuth(
        `${BASE_URL}/user/me?page=${page}&limit=${limit}`,
        { method: "GET" }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener tus compañías");
    }

    const data = await response.json();
    return data;
};

export const getAllCompaniesNotApproved = async (page: number, limit: number) => {
    const response = await FetchWithAuth(
        `${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`,
        { method: "GET" }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener compañías no aprobadas");
    }

    const data = await response.json();
    return data;
};

export const countCompaniesNotApproved = async (): Promise<CountResponse> => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar compañías no aprobadas");
    }

    const data = await response.json();
    return data;
};

export const countCompanyBySubtopic = async (): Promise<SubtopicCountResponse[]> => {
    const response = await fetch(`${BASE_URL}/count-by-subtopic`, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Error al contar noticias por subtema");

    const data = await response.json();
    return data as SubtopicCountResponse[];
};

export const getCompanyById = async ( id: number ): Promise<CompanyGetResponse> => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la compañia");
    }

    const data = await response.json();
    return data;
};

export const updateCompany = async ( id: number, company: CompanyUpdateRequest ) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(company),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la compañía");
    }
};

export const setCompanyApproval = async (id: number, approvalData: ApprovalRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
        method: "PUT",
        body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al aprobar o rechazar la compañía");
    }
};

export const deleteCompany = async (id: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la compañía");
    }
};