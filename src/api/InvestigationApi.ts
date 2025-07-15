import { InvestigationCreateRequest } from "../dtos/requests/Investigation";
import { InvestigationGetResponse } from "../dtos/responses/Investigation";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

export const createInvestigation = async (investigation: InvestigationCreateRequest) => {   
    try {
      const response = await FetchWithAuth("http://localhost:8080/api/investigation", {
        method: "POST",
        body: JSON.stringify(investigation), 
      });
  
      if (!response.ok) {
        throw new Error("Error al crear la investigación");
      }
  
      alert("Investigación creada con éxito!");
    } catch (error) {
      alert((error as Error).message || "Hubo un error al crear la investigación.");
    }
};

export const getAllInvestigation = async (page: number, limit: number) => {
  const response = await fetch(`http://localhost:8080/api/investigation?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener las investigaciones");
  }

  const data = await response.json();
  return data;
};


export const getInvestigationById = async (id: number): Promise<InvestigationGetResponse> => {
  const response = await FetchWithOptionalAuth(`http://localhost:8080/api/investigation/${id}`, { 
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener la investigación");
  }

  const data = await response.json();
  return data as  InvestigationGetResponse;
};
