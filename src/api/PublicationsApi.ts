import { PublicationsResponse } from "../dtos/responses/Publication";
import { FetchWithOptionalAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/publications`;

export const getAllPublications = async (): Promise<PublicationsResponse[]> => {
    const response = await FetchWithOptionalAuth(`${BASE_URL}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener las publicaciones");
    }

    const data = await response.json();
    return data as PublicationsResponse[];
};
