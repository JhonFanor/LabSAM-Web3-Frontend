import { EventCreateRequest, EventUpdateRequest } from "../dtos/requests/Event";
import { EventGetResponse } from "../dtos/responses/Event";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
import { ApprovalRequest } from "../dtos/responses/Approval";
import { SubtopicCountResponse } from "../dtos/responses/SubtopicCount";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/event`;

export const createEvent = async (event: EventCreateRequest) => { 
    const response = await FetchWithAuth(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(event),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Error al crear el evento");
    }
};

export const getAllEvent = async (page: number, limit: number) => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener los eventos");
    }

    const data = await response.json();
    return data;
};

export const getAllEventsByUserID = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener el evento");
    }

    const data = await response.json();
    return data;
};

export const getAllEventsNotApproved = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener los eventos no aprobados");
    }

    const data = await response.json();
    return data;
};

export const countEventsNotApproved = async (): Promise<CountResponse> => {
    const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar eventos no aprobados");
    }

    const data = await response.json();
    return data as CountResponse;
};

export const countEventBySubtopic = async (): Promise<SubtopicCountResponse[]> => {
    const response = await fetch(`${BASE_URL}/count-by-subtopic`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al contar eventos por subtema");
    }

    const data = await response.json();
    return data as SubtopicCountResponse[];
};

export const getEventById = async (id: number): Promise<EventGetResponse> => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener el evento");
    }

    const data = await response.json();
    return data as EventGetResponse;
};

export const updateEvent = async (id: number, event: EventUpdateRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(event),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el evento");
    }
};

export const setEventApproval = async (id: number, approvalData: ApprovalRequest) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
        method: "PUT",
        body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al aprobar o rechazar el evento");
    }
};

export const deleteEvent = async (id: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el evento");
    }
};
