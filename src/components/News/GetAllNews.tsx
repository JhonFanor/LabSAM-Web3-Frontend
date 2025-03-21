import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "../Pagination/Pagination";
import "./GetAllNews.css";

interface NewsItem {
  id: number;
  title: string;
  image: string;
  date: string;
  user: { username: string; avatar: string };
}

export const GetAllNews: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Obtiene la página actual desde la URL, o usa 1 como predeterminado
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    // Simulación de API
    const fetchedData = {
      total_record: 50,
      total_page: 5,
      offset: (page - 1) * limit,
      limit: 10,
      page,
      prev_page: Math.max(1, page - 1),
      next_page: Math.min(5, page + 1),
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1 + (page - 1) * limit,
        title: `Noticia ${i + 1 + (page - 1) * limit}`,
        image: "https://img.freepik.com/foto-gratis/escena-primavera-flores-mariposas_23-2150169999.jpg",
        date: "2024-03-17T00:00:00Z",
        user: { username: "JhonFanor", avatar: "" }
      }))
    };

    setNewsList(fetchedData.data);
    setTotalPages(fetchedData.total_page);
  }, [page]);

  // Función para cambiar de página y actualizar la URL
  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    navigate(`/news?page=${newPage}`); // Actualiza la URL
  };

  return (
    <section className="news-get-all-container">
      <div className="news-get-all-list">
        {newsList.map((news) => (
          <Link to={`/news/${news.id}?page=${page}`} key={news.id} className="news-get-all-item">
            <h3>{news.title}</h3>
            <img src={news.image} alt={news.title} className="news-get-all-image" />
            <div className="news-get-all-meta-container">
              <p className="news-get-all-meta">{new Date(news.date).toLocaleDateString()}</p>
              <p className="news-get-all-meta">Subido por: {news.user.username}</p>
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </section>
  );
};
