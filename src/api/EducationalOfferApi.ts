import { EducationalOfferCreateRequest, EducationalOfferUpdateRequest } from "../dtos/requests/EducationalOffer";
import { EducationalOfferGetResponse } from "../dtos/responses/EducationalOffer";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
import { ApprovalRequest } from "../dtos/responses/Approval";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/educational-offer`;

export const createEducationalOffer = async (educationalOffer: EducationalOfferCreateRequest) => { 
  try {
    const response = await FetchWithAuth(BASE_URL, {
      method: "POST",
      body: JSON.stringify(educationalOffer),
    });
    if (!response.ok) throw new Error("Error al crear la oferta educativa");

    alert("Oferta educativa creada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al crear la oferta educativa.");
    console.error(error);
  }
};

export const getAllEducationalOffer = async (page: number, limit: number) => {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener las ofertas educativas");
  }

  const data = await response.json();
  return data;
};

export const getAllEducationalOffersByUserID = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Error al obtener las ofertas educativas del usuario");
  }
  const data = await response.json();
  return data;
};

export const getAllEducationalOffersNotApproved = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Error al obtener las ofertas educativas no aprobadas");
  }
  const data = await response.json();
  return data;
};

export const countEducationalOffersNotApproved = async (): Promise<CountResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Error al contar ofertas educativas no aprobadas");
  }
  const data = await response.json();
  return data as CountResponse;
};

export const getEducationalOfferById = async (id: number): Promise<EducationalOfferGetResponse> => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Error al obtener Oferta educativa");
  }
  const data = await response.json();
  return data as EducationalOfferGetResponse;
};

export const updateEducationalOffer = async ( id: number, educationalOffer: EducationalOfferUpdateRequest ) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(educationalOffer),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar la oferta educativa");
    }
    alert("Oferta educativa actualizada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar la oferta educativa.");
  }
};

export const setEducationalOfferApproval = async (id: number, approvalData: ApprovalRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}/approval`, {
      method: "PUT",
      body: JSON.stringify(approvalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al aprobar o rechazar la oferta educativa");
    }

    alert("Estado de aprobación actualizado correctamente.");
  } catch (error) {
    alert(
      (error as Error).message || "Hubo un error al actualizar el estado de aprobación."
    );
  }
};

export const deleteEducationalOffer = async (id: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la oferta educativa");
  }
  alert("Oferta educativa eliminada con éxito!");
};
