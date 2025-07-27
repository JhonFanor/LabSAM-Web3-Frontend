import { PermissionRequest } from "../dtos/requests/Permission";
import { PermissionResponse } from "../dtos/responses/Permission";
import { FetchWithAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/permissions`;

export const getAssignablePermissionsToUser = async (
    req: PermissionRequest
): Promise<PermissionResponse[]> => {
    const response = await FetchWithAuth(`${BASE_URL}/assignable`, {
        method: "POST",
        body: JSON.stringify(req),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener permisos asignables");
    }

    const data = await response.json();
    return data as PermissionResponse[];
};
