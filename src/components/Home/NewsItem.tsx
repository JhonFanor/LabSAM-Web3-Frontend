import React from "react";
import { Link } from "react-router-dom";
import { NewsGetAllResponse } from "../../dtos/responses";
import "./NewsItem.css";

type Props = {
    news: NewsGetAllResponse;
};

export const NewsItem: React.FC<Props> = ({ news }) => (
    <Link to={`/news/${news.id}`} className="news-item__list-item">
        <h1>Noticia</h1>
        <h3 className="news-item__list-item-title">{news.title}</h3>
        <img src={news.image} alt={news.title} className="news-item__list-item-image" />
        <p className="news-item__list-item-date">{new Date(news.date).toLocaleDateString()}</p>
        <p className="news-item__list-item-user">
            Subido por: <img src={news.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/> {news.user.regular_user?.name || news.user.university_user?.name || news.user.business_user?.name || "Anónimo"}
        </p>
    </Link>
);
