import { PermissionResponse } from "../dtos/responses/Permission";
import { FetchWithAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/denied-permissions`;

export interface AssignOrRevokePermissionRequest {
    permission_id: number;
    user_id: number;
}

export const getDeniedPermissionsByUser = async (userId: number): Promise<PermissionResponse[]> => {
    const response = await FetchWithAuth(`${BASE_URL}/user/${userId}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener permisos denegados");
    }

    const data = await response.json();
    return data as PermissionResponse[];
};

export const assignDeniedPermission = async (req: AssignOrRevokePermissionRequest): Promise<void> => {
    const response = await FetchWithAuth(`${BASE_URL}/assign`, {
        method: "POST",
        body: JSON.stringify(req),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al asignar permiso denegado");
    }
};

export const revokeDeniedPermission = async (req: AssignOrRevokePermissionRequest): Promise<void> => {
    const response = await FetchWithAuth(`${BASE_URL}/revoke`, {
        method: "POST",
        body: JSON.stringify(req),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al revocar permiso denegado");
    }
};
