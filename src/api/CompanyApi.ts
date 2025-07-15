import { CompanyCreateRequest } from "../dtos/requests/Company";
import { CompanyGetResponse } from "../dtos/responses/Company";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

export const createCompany = async (company: CompanyCreateRequest) => {   
    try {
      const response = await FetchWithAuth("http://localhost:8080/api/company", {
        method: "POST",
        body: JSON.stringify(company), 
      });
  
      if (!response.ok) {
        throw new Error("Error al crear la compañia");
      }
  
      alert("Compañia creada con éxito!");
    } catch (error) {
      alert((error as Error).message || "Hubo un error al crear la compañia.");
    }
};

export const getAllCompany = async (page: number, limit: number) => {
  const response = await fetch(`http://localhost:8080/api/company?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener las Compañias");
  }

  const data = await response.json();
  return data;
};


export const getCompanyById = async (id: number): Promise<CompanyGetResponse> => {
  const response = await FetchWithOptionalAuth(`http://localhost:8080/api/company/${id}`,{
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener la compañia");
  }

  const data = await response.json();
  return data as CompanyGetResponse;
};

