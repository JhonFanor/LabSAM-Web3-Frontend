import { EducationalOfferCreateRequest } from "../dtos/requests/EducationalOffer";
import { EducationalOfferGetResponse } from "../dtos/responses/EducationalOffer";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

export const createEducationalOffer = async (educationalOffer: EducationalOfferCreateRequest) => { 
  try {
    const response = await FetchWithAuth("http://localhost:8080/api/educational-offer", {
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
  const response = await fetch(`http://localhost:8080/api/educational-offer?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener las ofertas educativas");
  }

  const data = await response.json();
  return data;
};


export const getEducationalOfferById = async (id: number): Promise<EducationalOfferGetResponse> => {
  const response = await FetchWithOptionalAuth(`http://localhost:8080/api/educational-offer/${id}`,{
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener Oferta educativa");
  }

  const data = await response.json();
  return data as EducationalOfferGetResponse;
};

