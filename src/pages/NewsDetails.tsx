import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GetNews from "../components/News/GetNews"; // Se mantiene el nombre original

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  subtopics: { name: string }[];
  user: { username: string; avatar: string };
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    if (!id) return; // Si no hay ID, no buscar nada

    const fetchedData = {
      data: [
        {
          id: 1,
          title: "Noticia 1",
          description: "Descripción de la noticia 1",
          image: "https://img.freepik.com/foto-gratis/escena-primavera-flores-mariposas_23-2150169999.jpg",
          date: "2024-03-17",
          subtopics: [{ name: "Ejemplo" }],
          user: { username: "JhonFanor", avatar: "" },
        },
        {
          id: 2,
          title: "Noticia 2",
          description: "Descripción de la noticia 2",
          image: "imagen2.jpg",
          date: "2024-03-17",
          subtopics: [{ name: "Ejemplo" }],
          user: { username: "JhonFanor", avatar: "" },
        },
        {
          id: 18,
          title: "Noticia 18",
          description: "Descripción de la noticia 18",
          image: "imagen18.jpg",
          date: "2024-03-17",
          subtopics: [{ name: "Ejemplo" }],
          user: { username: "JhonFanor", avatar: "" },
        }
      ],
    };

    const foundNews = fetchedData.data.find((item) => item.id.toString() === id);
    setNews(foundNews || null);
  }, [id]);

  const handleBack = () => {
    navigate(`/news?page=${page}`);
  };

  if (!news) return <p>🔍 Noticia no encontrada...</p>;

  return (
    <div>
      <button onClick={handleBack}>Volver</button>
      <GetNews news={news} />
    </div>
  );
};

export default NewsDetail;
