import { NewsCreateDto } from "../dtos/News";
import { NewsResponseDto } from "../dtos/News";

export const createNews = async (news: NewsCreateDto) => { 
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No tienes una sesión activa.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/news", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(news), 
      });
  
      if (response.status === 401) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al crear la noticia");
      }
  
      alert("Noticia creada con éxito!");
    } catch (error) {
      alert("Hubo un error al crear la noticia.");
    }
};

export const getAllNews = async (page: number, limit: number) => {
  const response = await fetch(`http://localhost:8080/api/news?page=${page}&limit=${limit}`);
  console.log("STATUS:", response.status);
  const text = await response.text();  // leer como texto sin asumir JSON
  console.log("Contenido bruto:", text); 
  if (!response.ok) {
    throw new Error("Error al obtener las noticias");
  }

  const data = await response.json();
  return data;
};


export const getNewsById = async (id: number): Promise<NewsResponseDto> => {
  const response = await fetch(`http://localhost:8080/api/news/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener la noticia");
  }

  const data = await response.json();
  return data.data as NewsResponseDto;
};
