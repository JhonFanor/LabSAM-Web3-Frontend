import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GetNews from "../components/News/GetNews";
import { getNewsById } from "../api/NewsApi";
import { NewsResponseDto } from "../dtos/News";

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const [news, setNews] = useState<NewsResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await getNewsById(Number(id));
        console.log(data)
        setNews(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la noticia");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const handleBack = () => {
    navigate(`/news?page=${page}`);
  };

  if (loading) return <p>Cargando noticia...</p>;
  if (error) return <p>{error}</p>;
  if (!news) return <p>🔍 Noticia no encontrada...</p>;

  return (
    <div>
      <button onClick={handleBack}>← Volver</button>
      <GetNews news={news} />
    </div>
  );
};

export default NewsDetail;
