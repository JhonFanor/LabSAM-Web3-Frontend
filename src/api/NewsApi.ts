import { NewsCreateRequest, NewsUpdateRequest } from "../dtos/requests/News";
import { NewsGetResponse } from "../dtos/responses/News";
import { CountResponse } from "../dtos/responses/Count";
import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/news`;

export const createNews = async (news: NewsCreateRequest) => {
  try {
    const response = await FetchWithAuth(BASE_URL, {
      method: "POST",
      body: JSON.stringify(news),
    });

    if (!response.ok) throw new Error("Error al crear la noticia");

    alert("Noticia creada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al crear la noticia.");
  }
};

export const getAllNews = async (page: number, limit: number) => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener las noticias");

  const data = await response.json();
  return data;
};

export const getAllNewsByUserID = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/user/me?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener tus noticias");

  const data = await response.json();
  return data;
};

export const getAllNewsNotApproved = async (page: number, limit: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved?page=${page}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener noticias no aprobadas");

  const data = await response.json();
  return data;
};

export const countNewsNotApproved = async (): Promise<CountResponse> => {
  const response = await FetchWithAuth(`${BASE_URL}/admin/not-approved/count`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al contar noticias no aprobadas");

  const data = await response.json();
  return data as CountResponse;
};

export const getNewsById = async (id: number): Promise<NewsGetResponse> => {
  const response = await FetchWithOptionalAuth(`${BASE_URL}/${id}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Error al obtener la noticia");

  const data = await response.json();
  return data as NewsGetResponse;
};

export const updateNews = async (id: number, news: NewsUpdateRequest) => {
  try {
    const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(news),
    });

    if (!response.ok) throw new Error("Error al actualizar la noticia");

    alert("Noticia actualizada con éxito!");
  } catch (error) {
    alert((error as Error).message || "Hubo un error al actualizar la noticia.");
  }
};

export const deleteNews = async (id: number) => {
  const response = await FetchWithAuth(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Error al eliminar la noticia");

  alert("Noticia eliminada con éxito!");
};
