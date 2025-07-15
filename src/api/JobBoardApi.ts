import { JobBoardCreateRequest } from "../dtos/requests/JobBoard";
import { JobBoardGetResponse } from "../dtos/responses/JobBoard";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

export const createJobBoard = async (jobBoard: JobBoardCreateRequest) => { 
    try {
      const response = await FetchWithAuth("http://localhost:8080/api/job-board", {
        method: "POST",
        body: JSON.stringify(jobBoard), 
      });
  
      if (!response.ok) {
        throw new Error("Error al crear la empleo");
      }
  
      alert("Empleo creada con éxito!");
    } catch (error) {
      alert((error as Error).message || "Hubo un error al crear  el empleo.");
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
  const response = await FetchWithOptionalAuth(`http://localhost:8080/api/job-board/${id}`,{
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener el empleo");
  }

  const data = await response.json();
  return data as JobBoardGetResponse;
};
