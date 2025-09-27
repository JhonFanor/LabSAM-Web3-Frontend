import { PermissionResponse } from "../dtos/responses/Permission";
import { FetchWithAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/permission-role`;


export const getPermissionsByRoleExcludingDenied = async (roleId: number, userId: number): Promise<PermissionResponse[]> => {
    const response = await FetchWithAuth(`${BASE_URL}/role/${roleId}/user/${userId}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener permisos del rol excluyendo los denegados");
    }

    const data = await response.json();
    return data as PermissionResponse[];
};
