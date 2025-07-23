import { NotificationGetResponse } from "../dtos/responses/Notification";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/notifications`;

export const getAllNotifications = async (page: number, limit: number) => {
    const response = await FetchWithAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Error al obtener las notificaciones");

    const data = await response.json();
    return data;
};

export const getNotificationById = async (id: number): Promise<NotificationGetResponse> => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Error al obtener la notificación");

    const data = await response.json();
    return data as NotificationGetResponse;
};

export const countNotificationsNotRead = async (): Promise<CountResponse> => {
    const response = await FetchWithAuth(`${BASE_URL}/not-read/count`, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Error al contar las notificaciones no leídas");

    const data = await response.json();
    return data as CountResponse;
};

export const markNotificationAsRead = async (id: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/read`, {
        method: "PATCH",
    });

    if (!response.ok) throw new Error("Error al marcar la notificación como leída");
};

export const markAllNotificationsAsRead = async () => {
    const response = await FetchWithAuth(`${BASE_URL}/read-all`, {
        method: "PATCH",
    });

    if (!response.ok) throw new Error("Error al marcar todas las notificaciones como leídas");

};

export const deleteNotification = async (id: number) => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) throw new Error("Error al eliminar la notificación");
};
