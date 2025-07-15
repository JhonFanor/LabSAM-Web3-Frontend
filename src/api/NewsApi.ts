import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";
import { NewsCreateRequest } from "../dtos/requests/News";
import { NewsGetResponse } from "../dtos/responses/News";


export const createNews = async (news: NewsCreateRequest) => { 
  try {
    const response = await FetchWithAuth("http://localhost:8080/api/news", {
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
  const response = await fetch(`http://localhost:8080/api/news?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  if (!response.ok) {
    throw new Error("Error al obtener las noticias");
  }

  const data = await response.json();
  return data;
};


export const getNewsById = async (id: number): Promise<NewsGetResponse> => {

  const response = await FetchWithOptionalAuth(`http://localhost:8080/api/news/${id}`, {
      method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error al obtener la noticia");
  }

  const data = await response.json();
  return data as NewsGetResponse;
};
