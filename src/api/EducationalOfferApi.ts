import { EducationalOfferCreateRequest, EducationalOfferUpdateRequest } from "../dtos/requests/EducationalOffer";
import { EducationalOfferGetResponse } from "../dtos/responses/EducationalOffer";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
import { ApprovalRequest } from "../dtos/responses/Approval";
import { SubtopicCountResponse } from "../dtos/responses/SubtopicCount";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/educational-offer`;

export const createEducationalOffer = async (educationalOffer: EducationalOfferCreateRequest) => { 
    const response = await FetchWithAuth(BASE_URL, {
        method: "POST",
        body: JSON.stringify(educationalOffer),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear la oferta educativa");
    }
};

export const getAllEducationalOffer = async (page: number, limit: number) => {
    const response = await FetchWithOptionalAuth(
        `${BASE_URL}?page=${page}&limit=${limit}`,
        { method: "GET",}
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las ofertas educativas");
    }

    const data = await response.json();
    return data;
};

export const getAllEducationalOffersByUserID = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las ofertas educativas del usuario");
    }

    const data = await response.json();
    return data;
};

export const getAllEducationalOffersNotApproved = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las ofertas educativas no aprobadas");
    }
    
    const data = await response.json();
    return data;
};

export const countEducationalOffersNotApproved = async (): Promise<CountResponse> => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
        method: "GET",
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar documentaciones no aprobadas");
    }

    const data = await response.json();
    return data;
};

export const countEducationalOfferBySubtopic = async (): Promise<SubtopicCountResponse[]> => {
    const response = await fetch(`${BASE_URL}/count-by-subtopic`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar ofertas educativas por subtema");
    }

    const data = await response.json();
    return data as SubtopicCountResponse[];
};

export const getEducationalOfferById = async (id: number): Promise<EducationalOfferGetResponse> => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la oferta educativa");
    }

    const data = await response.json();
    return data as EducationalOfferGetResponse;
};

export const updateEducationalOffer = async ( id: number, educationalOffer: EducationalOfferUpdateRequest ) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(educationalOffer),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la oferta educativa");
    }
};

export const setEducationalOfferApproval = async (id: number, approvalData: ApprovalRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
        method: "PUT",
        body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al aprobar o rechazar la oferta educativa");
    }
};

export const deleteEducationalOffer = async (id: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la noticia");
    }
};
