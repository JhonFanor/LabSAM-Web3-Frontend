import { CompanyCreateRequest } from "../dtos/requests/Company";
import { CompanyGetResponse } from "../dtos/responses/Company";

export const createCompany = async (company: CompanyCreateRequest) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/company", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(company), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear la compañia");
      }
  
      alert("Compañia creada con éxito!");
    } catch (error) {
      alert("Hubo un error al crear la compañia.");
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
  const response = await fetch(`http://localhost:8080/api/company/${id}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener la compañia");
  }

  const data = await response.json();
  return data as CompanyGetResponse;
};

