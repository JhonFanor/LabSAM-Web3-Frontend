import { DocumentationCreateRequest } from "../dtos/requests/Documentation";
import { DocumentationGetResponse } from "../dtos/responses/Documentation";

export const createDocumentation = async (documentation: DocumentationCreateRequest) => { 
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No tienes una sesión activa.");
    return;
  }
  
  try {
    const response = await fetch("http://localhost:8080/api/documentation", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(documentation), 
    });

    if (response.status === 401) {
      alert("Sesión expirada. Inicia sesión nuevamente.");
      return;
    }

    if (!response.ok) {
      throw new Error("Error al crear la documentación");
    }

    alert("Documentación creado con éxito!");
  } catch (error) {
    alert("Hubo un error al crear el documentación.");
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
  const response = await fetch(`http://localhost:8080/api/news/${id}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener la documentación");
  }

  const data = await response.json();
  return data as DocumentationGetResponse;
};
