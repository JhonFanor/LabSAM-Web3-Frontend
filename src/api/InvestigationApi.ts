import { InvestigationCreateDto } from "../dtos/Investigation";

export const createInvestigation = async (investigation: InvestigationCreateDto) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/investigation", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(investigation), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear la investigación");
      }
  
      alert("Investigación creada con éxito!");
    } catch (error) {
      alert("Hubo un error al crear la investigación.");
    }
};
