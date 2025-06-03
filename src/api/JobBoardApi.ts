import { JobBoardCreateRequest } from "../dtos/requests/JobBoard";
import { JobBoardGetResponse } from "../dtos/responses/JobBoard";

export const createJobBoard = async (jobBoard: JobBoardCreateRequest) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/job-board", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(jobBoard), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear la empleo");
      }
  
      alert("Empleo creada con éxito!");
    } catch (error) {
      alert("Hubo un error al crear  el empleo.");
    }
};

export const getAllJobBoard = async (page: number, limit: number) => {
  const response = await fetch(`http://localhost:8080/api/job-board?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener los empleos");
  }

  const data = await response.json();
  return data;
};


export const getJobBoardById = async (id: number): Promise<JobBoardGetResponse> => {
  const response = await fetch(`http://localhost:8080/api/job-board/${id}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener el empleo");
  }

  const data = await response.json();
  return data as JobBoardGetResponse;
};
