import { SubtopicIDsRequest } from "../dtos/requests/Subtopic";
import { SuccessResponse } from "../dtos/responses/Success";
import { FetchWithAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/job-board-subtopic`;

export const CreateJobBoardSubtopic = async (id: number, data: SubtopicIDsRequest): Promise<SuccessResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al asignar subtemas a la bolsa de empleo");
  }

  return await response.json();
};

export const DeleteJobBoardSubtopic = async (id: number, data: SubtopicIDsRequest): Promise<SuccessResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al eliminar subtemas de la bolsa de empleo");
  }

  return await response.json();
};
