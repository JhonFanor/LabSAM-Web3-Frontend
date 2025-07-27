import { BankOfResumeCreateRequest, BankOfResumeUpdateRequest } from "../dtos/requests/BankOfResume";
import { ApprovalRequest } from "../dtos/responses/Approval";
import { BankOfResumeGetResponse} from "../dtos/responses/BankOfResume";
import { CountResponse } from "../dtos/responses/Count";
import { SubtopicCountResponse } from "../dtos/responses/SubtopicCount";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
const API_BASE = import.meta.env.VITE_API_URL;

const BASE_URL = `${API_BASE}/bank-of-resume`;

export const createBankOfResume = async (
  bankOfResume: BankOfResumeCreateRequest
) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}`, {
      method: "POST",
      body: JSON.stringify(bankOfResume),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al crear la hoja de vida");
    }

    alert("Hoja de vida creada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al crear la hoja de vida.");
  }
};

export const getAllBankOfResume = async (page: number, limit: number) => {
  const response = await FetchWithOptionalAuth(
    `${BASE_URL}?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener las hojas de vida");
  }

  const data = await response.json();
  return data;
};

export const getAllBankOfResumesByUserID = async ( page: number, limit: number ) => {
  const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener la hoja de vida");
  }

  const data = await response.json();
  return data;
};

export const getAllBankOfResumesNotApproved = async ( page: number, limit: number ) => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener las hojas de vida no aprobadas");
  }

  const data = await response.json();
  return data;
};

export const countBankOfResumesNotApproved = async (): Promise<CountResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al contar hojas de vida no aprobadas");
  }

  const data = await response.json();
  return data as CountResponse;
};

export const countBankOfResumeBySubtopic = async (): Promise<SubtopicCountResponse[]> => {
    const response = await fetch(`${BASE_URL}/count-by-subtopic`, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Error al contar noticias por subtema");

    const data = await response.json();
    return data as SubtopicCountResponse[];
};

export const getBankOfResumeById = async ( id: number ): Promise<BankOfResumeGetResponse> => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener la hoja de vida");
  }

  const data = await response.json();
  return data as BankOfResumeGetResponse;
};

export const updateBankOfResume = async ( id: number, bankOfResume: BankOfResumeUpdateRequest ) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(bankOfResume),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la hoja de vida");
    }

    alert("Hoja de vida actualizada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar la hoja de vida.");
  }
};

export const setBankOfResumeApproval = async (id: number, approvalData: ApprovalRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
      method: "PUT",
      body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al aprobar o rechazar la hoja de vida");
    }

  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar el estado de aprobación.");
  }
};

export const deleteBankOfResume = async (id: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al eliminar la hoja de vida");
  }

  alert("Hoja de vida eliminada con éxito!");
};
