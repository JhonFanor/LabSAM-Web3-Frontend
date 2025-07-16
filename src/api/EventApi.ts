import { EventCreateRequest, EventUpdateRequest } from "../dtos/requests/Event";
import { EventGetResponse } from "../dtos/responses/Event";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/event`;

export const createEvent = async (event: EventCreateRequest) => { 
  try {
    const response = await FetchWithAuth(`${BASE_URL}`, {
      method: "POST",
      body: JSON.stringify(event),
    });

    if (!response.ok) throw new Error("Error al crear el evento");

    alert("Evento creado con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al crear el evento.");
  }
};

export const getAllEvent = async (page: number, limit: number) => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener los eventos");

  const data = await response.json();
  return data;
};

export const getAllEventsByUserID = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener tus eventos");

  const data = await response.json();
  return data;
};

export const getAllEventsNotApproved = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener eventos no aprobados");

  const data = await response.json();
  return data;
};

export const countEventsNotApproved = async (): Promise<CountResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al contar eventos no aprobados");

  const data = await response.json();
  return data as CountResponse;
};

export const getEventById = async (id: number): Promise<EventGetResponse> => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener el evento");

  const data = await response.json();
  return data as EventGetResponse;
};

export const updateEvent = async (id: number, event: EventUpdateRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    });

    if (!response.ok) throw new Error("Error al actualizar el evento");

    alert("Evento actualizado con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar el evento.");
  }
};

export const deleteEvent = async (id: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar el evento");

  alert("Evento eliminado con éxito!");
};
