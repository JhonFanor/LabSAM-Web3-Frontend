import { EducationalOffer } from "../models/EducationalOffer";

export const createEducationalOffer = async (educationalOffer: EducationalOffer) => { 
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
