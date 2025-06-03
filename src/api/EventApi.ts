import { EventCreateRequest } from "../dtos/requests/Event";
import { EventGetResponse } from "../dtos/responses/Event";

export const createEvent = async (event: EventCreateRequest) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/event", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(event), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear el evento");
      }
  
      alert("Evento creado con éxito!");
    } catch (error) {
      alert("Hubo un error al crear el evento.");
    }
};

export const getAllEvent = async (page: number, limit: number) => {
  const response = await fetch(`http://localhost:8080/api/event?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener los eventos");
  }

  const data = await response.json();
  return data;
};


export const getEventById = async (id: number): Promise<EventGetResponse> => {
  const response = await fetch(`http://localhost:8080/api/event/${id}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener el evento");
  }

  const data = await response.json();
  return data as EventGetResponse;
};
