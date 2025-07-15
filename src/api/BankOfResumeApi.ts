import { BankOfResumeCreateRequest } from "../dtos/requests/BankOfResume";
import { BankOfResumeGetResponse } from "../dtos/responses/BankOfResume";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

export const createBankOfResume = async (bankOfResume: BankOfResumeCreateRequest) => { 
    try {
      const response = await FetchWithAuth("http://localhost:8080/api//bank-of-resume", {
          method: "POST",
          body: JSON.stringify(bankOfResume),
      });
  
      if (!response.ok) {
        throw new Error("Error al crear la hoja de vida");
      }
  
      alert("Hoja de vida creada con éxito!");
    } catch (error) {
      alert((error as Error).message || "Hubo un error al crear la hoja de vida.");
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
  const response = await FetchWithOptionalAuth(`http://localhost:8080/api/bank-of-resume/${id}`,{
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener la hoja de vida");
  }

  const data = await response.json();
  return data as BankOfResumeGetResponse;
};
