import { Legislation } from "../models/Legislation";

export const createLegislation = async (legislation: Legislation) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/legislation/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(legislation), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear la legislación");
      }
  
      alert("Hoja de vida creada con éxito!");
    } catch (error) {
      alert("Hubo un error al crear la legislación.");
    }
};
