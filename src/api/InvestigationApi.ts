import { InvestigationCreateRequest } from "../dtos/requests/Investigation";
import { InvestigationGetResponse } from "../dtos/responses/Investigation";

export const createInvestigation = async (investigation: InvestigationCreateRequest) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/investigation", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(investigation), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear la investigación");
      }
  
      alert("Investigación creada con éxito!");
    } catch (error) {
      alert("Hubo un error al crear la investigación.");
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
  const response = await fetch(`http://localhost:8080/api/investigation/${id}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener la investigación");
  }

  const data = await response.json();
  return data as  InvestigationGetResponse;
};
