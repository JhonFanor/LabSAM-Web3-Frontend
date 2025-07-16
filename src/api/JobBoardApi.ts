import { JobBoardCreateRequest, JobBoardUpdateRequest } from "../dtos/requests/JobBoard";
import { JobBoardGetResponse } from "../dtos/responses/JobBoard";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/job-board`;

export const createJobBoard = async (jobBoard: JobBoardCreateRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}`, {
      method: "POST",
      body: JSON.stringify(jobBoard),
    });

    if (!response.ok) throw new Error("Error al crear el empleo");

    alert("Empleo creado con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al crear el empleo.");
  }
};

export const getAllJobBoard = async (page: number, limit: number) => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener los empleos");

  const data = await response.json();
  return data;
};

export const getAllJobsBoardByUserID = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener tus empleos");

  const data = await response.json();
  return data;
};

export const getAllJobsBoardNotApproved = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener empleos no aprobados");

  const data = await response.json();
  return data;
};

export const countJobsBoardNotApproved = async (): Promise<CountResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al contar empleos no aprobados");

  const data = await response.json();
  return data as CountResponse;
};

export const getJobBoardById = async (id: number): Promise<JobBoardGetResponse> => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener el empleo");

  const data = await response.json();
  return data as JobBoardGetResponse;
};

export const updateJobBoard = async (id: number, jobBoard: JobBoardUpdateRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(jobBoard),
    });

    if (!response.ok) throw new Error("Error al actualizar el empleo");

    alert("Empleo actualizado con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar el empleo.");
  }
};

export const deleteJobBoard = async (id: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar el empleo");

  alert("Empleo eliminado con éxito!");
};
