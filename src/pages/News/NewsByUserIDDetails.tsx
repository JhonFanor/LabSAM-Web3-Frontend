import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetNews } from "../../components";
import { getAllNewsByUserID, getNewsById } from "../../api/NewsApi";
import { NewsGetResponse } from "../../dtos/responses/News";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const NewsByUserIDDetails: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("newsPage") || "1");

    const [news, setNews] = useState<NewsGetResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchNews = async () => {
            setLoading(true);
            try {
                const data = await getNewsById(Number(id));
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

    const handleBack = async () => {
        try {
            const currentPageData = await getAllNewsByUserID(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/user/publications?newsPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllNewsByUserID(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/user/publications?newsPage=${page - 1}`);
                } else {
                    navigate("/user/publications");
                }
            } else {
                navigate("/user/publications");
            }
        } catch (err) {
            console.error("Error al verificar páginas disponibles", err);
            navigate("/user/publications");
        }
    };

    if (loading) return <p>Cargando noticia...</p>;
    if (error) return <p>{error}</p>;
    if (!news) return <p>🔍 Noticia no encontrada...</p>;

    return (
        <div>
            <ButtonReturn onClick={handleBack}/>
            <GetNews news={news} />
        </div>
    );
};

export default NewsByUserIDDetails;
