import { JobBoard } from "../models/JobBoard";

export const createJobBoard = async (jobBoard: JobBoard) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/job-board/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(jobBoard), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear la empleo");
      }
  
      alert("Hoja de vida creada con éxito!");
    } catch (error) {
      alert("Hubo un error al crear  el empleo.");
    }
};
