import { LegislationCreateRequest } from "../dtos/requests/Legislation";
import { LegislationGetResponse } from "../dtos/responses/Legislation";

export const createLegislation = async (legislation: LegislationCreateRequest) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/legislation", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(legislation), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear la legislación");
      }
  
      alert("Hoja de vida creada con éxito!");
    } catch (error) {
      alert("Hubo un error al crear la hoja de vida.");
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
  const response = await fetch(`http://localhost:8080/api/legislation/${id}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener la legislación");
  }

  const data = await response.json();
  return data as LegislationGetResponse;
};
