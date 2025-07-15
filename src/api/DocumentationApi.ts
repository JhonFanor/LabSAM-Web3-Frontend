import { DocumentationCreateRequest } from "../dtos/requests/Documentation";
import { DocumentationGetResponse } from "../dtos/responses/Documentation";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

export const createDocumentation = async (documentation: DocumentationCreateRequest) => { 
  try {
    const response = await FetchWithAuth("http://localhost:8080/api/documentation", {
      method: "POST",
      body: JSON.stringify(documentation), 
    });

    if (!response.ok) {
      throw new Error("Error al crear la documentación");
    }

    alert("Documentación creado con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al crear el documentación.");
  }
};

export const getAllDocumentation = async (page: number, limit: number) => {
  const response = await fetch(`http://localhost:8080/api/documentation?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener las documentaciones");
  }

  const data = await response.json();
  return data;
};


export const getDocumentationById = async (id: number): Promise<DocumentationGetResponse> => {
  const response = await FetchWithOptionalAuth(`http://localhost:8080/api/documentation/${id}`,{
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener la documentación");
  }

  const data = await response.json();
  return data as DocumentationGetResponse;
};
