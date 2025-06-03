import { EducationalOfferCreateRequest } from "../dtos/requests/EducationalOffer";
import { EducationalOfferGetResponse } from "../dtos/responses/EducationalOffer";

export const createEducationalOffer = async (educationalOffer: EducationalOfferCreateRequest) => { 
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No tienes una sesión activa.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/educational-offer", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(educationalOffer), 
    });

    if (response.status === 401) {
      alert("Sesión expirada. Inicia sesión nuevamente.");
      return;
    }

    if (!response.ok) {
      throw new Error("Error al crear la oferta educativa");
    }

    alert("Oferta educativa creada con éxito!");
  } catch (error) {
    alert("Hubo un error al crear la Oferta educativa.");
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
  const response = await fetch(`http://localhost:8080/api/educational-offer/${id}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener Oferta educativa");
  }

  const data = await response.json();
  return data as EducationalOfferGetResponse;
};

