import { DocumentationCreateRequest, DocumentationUpdateRequest } from "../dtos/requests/Documentation";
import { DocumentationGetResponse } from "../dtos/responses/Documentation";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
import { ApprovalRequest } from "../dtos/responses/Approval";
import { SubtopicCountResponse } from "../dtos/responses/SubtopicCount";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/documentation`;

export const createDocumentation = async (documentation: DocumentationCreateRequest) => { 
  try {
    const response = await FetchWithAuth(BASE_URL, {
      method: "POST",
      body: JSON.stringify(documentation), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al crear la documentación");
    }

    alert("Documentación creada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al crear la documentación.");
  }
};

export const getAllDocumentation = async (page: number, limit: number) => {
  const response = await FetchWithOptionalAuth(
    `${BASE_URL}?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener las documentaciones");
  }

  const data = await response.json();
  return data;
};

export const getAllDocumentationsByUserID = async (page: number, limit: number) => {
  const response = await FetchWithAuth(
    `${BASE_URL}/user/me?page=${page}&limit=${limit}`,
    { method: "GET" }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener tus documentaciones");
  }

  return await response.json();
};

export const getAllDocumentationsNotApproved = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`,{ 
    method: "GET" 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener documentaciones no aprobadas");
  }

  return await response.json();
};

export const countDocumentationsNotApproved = async (): Promise<CountResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al contar documentaciones no aprobadas");
  }

  return await response.json();
};

export const countDocumentationBySubtopic = async (): Promise<SubtopicCountResponse[]> => {
    const response = await fetch(`${BASE_URL}/count-by-subtopic`, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Error al contar noticias por subtema");

    const data = await response.json();
    return data as SubtopicCountResponse[];
};

export const getDocumentationById = async ( id: number ): Promise<DocumentationGetResponse> => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener la documentación");
  }

  return await response.json();
};

export const updateDocumentation = async ( id: number, documentation: DocumentationUpdateRequest ) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(documentation),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la documentación");
    }

    alert("Documentación actualizada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar la documentación.");
  }
};

export const setDocumentationApproval = async ( id: number, approvalData: ApprovalRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
      method: "PUT",
      body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al aprobar o rechazar la documentación");
    }

    alert("Estado de aprobación actualizado correctamente.");
  } catch (error) {
    alert(
      (error as Error).message || "Hubo un error al actualizar el estado de aprobación."
    );
  }
};

export const deleteDocumentation = async (id: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al eliminar la documentación");
  }

  alert("Documentación eliminada con éxito!");
};
