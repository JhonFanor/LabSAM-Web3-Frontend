import { EventCreateRequest } from "../dtos/requests/Event";
import { EventGetResponse } from "../dtos/responses/Event";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

export const createEvent = async (event: EventCreateRequest) => { 
    try {
      const response = await FetchWithAuth("http://localhost:8080/api/event", {
        method: "POST",
        body: JSON.stringify(event), 
      });
  
      if (!response.ok) {
        throw new Error("Error al crear el evento");
      }
  
      alert("Evento creado con éxito!");
    } catch (error) {
      alert((error as Error).message || "Hubo un error al crear el evento.");
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
  const response = await FetchWithOptionalAuth(`http://localhost:8080/api/event/${id}`,{
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Error al obtener el evento");
  }

  const data = await response.json();
  return data as EventGetResponse;
};
