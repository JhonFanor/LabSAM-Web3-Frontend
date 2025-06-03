import { BankOfResumeCreateRequest } from "../dtos/requests/BankOfResume";
import { BankOfResumeGetResponse } from "../dtos/responses/BankOfResume";

export const createBankOfResume = async (bankOfResume: BankOfResumeCreateRequest) => { 
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

export const getAllBankOfResume = async (page: number, limit: number) => {
  const response = await fetch(`http://localhost:8080/api/bank-of-resume?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener las hojas de vida");
  }

  const data = await response.json();
  return data;
};


export const getBankOfResumeById = async (id: number): Promise<BankOfResumeGetResponse> => {
  const response = await fetch(`http://localhost:8080/api/bank-of-resume/${id}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener la hoja de vida");
  }

  const data = await response.json();
  return data as BankOfResumeGetResponse;
};
