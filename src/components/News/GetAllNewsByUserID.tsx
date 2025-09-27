import React, { useEffect, useState } from "react";
import { NewsGetAllByUserIDResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllNewsByUserID } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllNews.css";

export const GetAllNewsByUserID: React.FC = () => {
    const [newsList, setNewsList] = useState<NewsGetAllByUserIDResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("newsPage")) || 1;

    useEffect(() => {
        const getNews = async () => {
            try {
                const data = await getAllNewsByUserID(page, limit);
                setNewsList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay noticias disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las noticias");
                console.error(err);
            }
        };

        getNews();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        searchParams.set("newsPage", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-news">
            <GetAllError message={error}/>

            <div className="get-all-news__list">
                {newsList.map((news) => {
                    let statusLabel = null;
                    if (news.is_approved === false) {
                        statusLabel = <span className="status-label disapproved">Desaprobado</span>;
                    } else if (news.is_approved === null) {
                        statusLabel = <span className="status-label pending">En espera de aprobación</span>;
                    }
                    return(
                        <Link to={`/user/news/${news.id}`} key={news.id} className="get-all-news__list-item">
                            <h3 className="get-all-news__list-item-title">{news.title}</h3>
                            <img src={news.image} alt={news.title} className="get-all-news__list-item-image" />
                            <p className="get-all-news__list-item-date">{new Date(news.date).toLocaleDateString()}</p>
                            <p className="get-all-news__list-item-user">
                                Subido por: <img src={news.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>{" "}{ news.user.regular_user?.name || news.user.university_user?.name || news.user.business_user?.name || "Anónimo" }
                            </p>
                            {statusLabel && (
                                <div className="get-all-news__status">{statusLabel}</div>
                            )}
                        </Link>
                    );
                })}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};
