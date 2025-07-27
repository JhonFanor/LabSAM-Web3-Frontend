import { UserGetResponse } from "../dtos/responses";
import { FetchWithAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/user/admin`;

export const getAllUsers = async ( page: number, limit: number ) => {
    const response = await FetchWithAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener usuarios");
    }

    const data = await response.json();
    return data;
};

export const getUserById = async (id: number): Promise<UserGetResponse> => {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener el usuario");
    }

    const data = await response.json();
    return data as UserGetResponse;
};
