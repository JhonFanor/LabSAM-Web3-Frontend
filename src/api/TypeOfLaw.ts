import { TypeOfLawResponse } from "../dtos/responses/TypeOfLaw";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/type-of-law`;

export const getAllTypeOfLaw = async (): Promise<TypeOfLawResponse[]> => {
    const response = await fetch(`${BASE_URL}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener los tipos de leyes");
    }

    const data = await response.json();
    return data as TypeOfLawResponse[];
};
