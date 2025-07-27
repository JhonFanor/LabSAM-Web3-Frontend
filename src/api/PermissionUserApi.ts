import { PermissionUserRequest } from "../dtos/requests/PermissionUser";
import { PermissionResponse } from "../dtos/responses/Permission";
import { FetchWithAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/permission-user`;

export const assignPermissionToUser = async (req: PermissionUserRequest): Promise<void> => {
    const response = await FetchWithAuth(`${BASE_URL}/assign`, {
        method: "POST",
        body: JSON.stringify(req),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al asignar permiso");
    }
};

export const revokePermissionFromUser = async (permissionId: number, userId: number): Promise<void> => {
    const response = await FetchWithAuth(`${BASE_URL}/${permissionId}/user/${userId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al revocar permiso");
    }
};

export const getPermissionsByUser = async (userId: number): Promise<PermissionResponse[]> => {
    const response = await FetchWithAuth(`${BASE_URL}/user/${userId}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener permisos del usuario");
    }

    const data = await response.json();
    return data as PermissionResponse[];
};
