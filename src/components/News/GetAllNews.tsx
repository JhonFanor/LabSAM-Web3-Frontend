import React, { useEffect, useState } from "react";
import { NewsGetAllResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllNews } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllNews.css";

export const GetAllNews: React.FC = () => {
    const [newsList, setNewsList] = useState<NewsGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const getNews = async () => {
            try {
                const data = await getAllNews(page, limit);
                setNewsList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay noticias disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las noticias");
            }
        };

        getNews();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        searchParams.set("page", newPage.toString());
        setSearchParams(searchParams);
    };


    return (
        <section className="get-all-news">
            <GetAllError message={error}/>

            <div className="get-all-news__list">
                {newsList.map((news) => (
                <Link to={`/news/${news.id}`} key={news.id} className="get-all-news__list-item">
                    <h3 className="get-all-news__list-item-title">{news.title}</h3>
                    <img src={news.image} alt={news.title} className="get-all-news__list-item-image" />
                    <p className="get-all-news__list-item-date">{new Date(news.date).toLocaleDateString()}</p>
                    <p className="get-all-news__list-item-user">
                        Subido por:<img src={news.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>{" "}{ news.user.regular_user?.name || news.user.university_user?.name || news.user.business_user?.name || "Anónimo" }
                    </p>
                </Link>
                ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};
