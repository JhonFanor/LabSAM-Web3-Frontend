import { BankOfResumeCreateDto } from "../dtos/BankOfResume";

export const createBankOfResume = async (bankOfResume: BankOfResumeCreateDto) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/bank-of-resume", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(bankOfResume), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear la hoja de vida");
      }
  
      alert("Hoja de vida creada con éxito!");
    } catch (error) {
      alert("Hubo un error al crear la hoja de vida.");
    }
};
