import { CompanyCreateRequest, CompanyUpdateRequest } from "../dtos/requests/Company";
import { ApprovalRequest } from "../dtos/responses/Approval";
import { CompanyGetResponse } from "../dtos/responses/Company";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/company`;

export const createCompany = async (company: CompanyCreateRequest) => {
  try {
    const response = await FetchWithAuth(BASE_URL, {
      method: "POST",
      body: JSON.stringify(company),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al crear la compañia");
    }

    alert("Compañia creada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al crear la compañia.");
  }
};

export const getAllCompany = async (page: number, limit: number) => {
  const response = await FetchWithOptionalAuth(
    `${BASE_URL}?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener las compañías");
  }

  const data = await response.json();
  return data;
};

export const getAllCompaniesByUserID = async (page: number, limit: number) => {
  const response = await FetchWithAuth(
    `${BASE_URL}/user/me?page=${page}&limit=${limit}`,
    { method: "GET" }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener tus compañías");
  }

  return await response.json();
};

export const getAllCompaniesNotApproved = async (page: number, limit: number) => {
  const response = await FetchWithAuth(
    `${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`,
    { method: "GET" }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener compañías no aprobadas");
  }

  return await response.json();
};

export const countCompaniesNotApproved = async (): Promise<CountResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al contar compañías no aprobadas");
  }

  return await response.json();
};

export const getCompanyById = async ( id: number ): Promise<CompanyGetResponse> => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener la compañia");
  }

  return await response.json();
};

export const updateCompany = async ( id: number, company: CompanyUpdateRequest ) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(company),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la compañía");
    }

    alert("Compañía actualizada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar la compañía.");
  }
};

export const setCompanyApproval = async (id: number, approvalData: ApprovalRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
      method: "PUT",
      body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al aprobar o rechazar la compañía");
    }

    alert("Estado de aprobación actualizado correctamente.");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar el estado de aprobación.");
  }
};

export const deleteCompany = async (id: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al eliminar la compañía");
  }

  alert("Compañía eliminada con éxito!");
};