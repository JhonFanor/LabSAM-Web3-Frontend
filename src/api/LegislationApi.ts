import { LegislationCreateRequest } from "../dtos/requests/Legislation";
import { LegislationGetResponse } from "../dtos/responses/Legislation";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

export const createLegislation = async (legislation: LegislationCreateRequest) => { 
    try {
      const response = await FetchWithAuth("http://localhost:8080/api/legislation", {
        method: "POST",
        body: JSON.stringify(legislation), 
      });
  
      if (!response.ok) {
        throw new Error("Error al crear la legislación");
      }
  
      alert("Hoja de vida creada con éxito!");
    } catch (error) {
      alert((error as Error).message || "Hubo un error al crear la hoja de vida.");
    }
};

export const getAllLegislation = async (page: number, limit: number) => {
  const response = await fetch(`http://localhost:8080/api/legislation?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener las legislaciones");  
  }

  const data = await response.json();
  return data;
};


export const getLegislationById = async (id: number): Promise<LegislationGetResponse> => {
  const response = await FetchWithOptionalAuth(`http://localhost:8080/api/legislation/${id}`,{
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener la legislación");
  }

  const data = await response.json();
  return data as LegislationGetResponse;
};
