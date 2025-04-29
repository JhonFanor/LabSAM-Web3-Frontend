import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "../Pagination/Pagination";
import { getAllNews } from "../../api/NewsApi";
import { NewsResponseDto } from "../../dtos/News";
import "./GetAllNews.css";


export const GetAllNews: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsResponseDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await getAllNews(page, limit);
        setNewsList(data.data);
        setTotalPages(data.total_page);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar las noticias");
        console.error(err);
      }
    };

    getNews();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    navigate(`/news?page=${newPage}`);
  };

  return (
    <section className="news-get-all-container">
      {error && <p className="error-message">{error}</p>}

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
