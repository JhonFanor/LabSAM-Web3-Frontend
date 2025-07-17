import { LegislationCreateRequest, LegislationUpdateRequest } from "../dtos/requests/Legislation";
import { LegislationGetResponse } from "../dtos/responses/Legislation";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
import { ApprovalRequest } from "../dtos/responses/Approval";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/legislation`;

export const createLegislation = async (legislation: LegislationCreateRequest) => {
  try {
    const response = await FetchWithAuth(BASE_URL, {
      method: "POST",
      body: JSON.stringify(legislation),
    });

    if (!response.ok) throw new Error("Error al crear la legislación");

    alert("Legislación creada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al crear la legislación.");
  }
};

export const getAllLegislation = async (page: number, limit: number) => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener las legislaciones");

  const data = await response.json();
  return data;
};

export const getAllLegislationsByUserID = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener tus legislaciones");

  const data = await response.json();
  return data;
};

export const getAllLegislationsNotApproved = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener legislaciones no aprobadas");

  const data = await response.json();
  return data;
};

export const countLegislationsNotApproved = async (): Promise<CountResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al contar legislaciones no aprobadas");

  const data = await response.json();
  return data as CountResponse;
};

export const getLegislationById = async (id: number): Promise<LegislationGetResponse> => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener la legislación");

  const data = await response.json();
  return data as LegislationGetResponse;
};

export const updateLegislation = async (id: number, legislation: LegislationUpdateRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(legislation),
    });

    if (!response.ok) throw new Error("Error al actualizar la legislación");

    alert("Legislación actualizada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar la legislación.");
  }
};

export const setLegislationApproval = async (id: number, approvalData: ApprovalRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
      method: "PUT",
      body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar estado de aprobación");
    }

    alert("Estado de aprobación de la legislación actualizado correctamente.");
  } catch (error) {
    alert(
      (error as Error).message || "Hubo un error al actualizar el estado de aprobación."
    );
  }
};

export const deleteLegislation = async (id: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar la legislación");

  alert("Legislación eliminada con éxito!");
};
