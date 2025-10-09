import { TypeEducationResponse } from "../dtos/responses/TypeEducation";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/type-education`;

export const getAllTypeEducation = async (): Promise<TypeEducationResponse[]> => {
    const response = await fetch(`${BASE_URL}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener los tipos de educación");
    }

    const data = await response.json();
    return data as TypeEducationResponse[];
};
