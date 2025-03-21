import React from "react";
import "./GetNews.css";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  subtopics: { name: string }[];
  user: { username: string; avatar: string };
}

interface GetNewsProps {
  news: NewsItem;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
};

const GetNews: React.FC<GetNewsProps> = ({ news }) => {
  return (
    <div className="news-container">
      <h1 className="news-title">{news.title}</h1>
      <div className="news-meta-container">
        <p className="news-meta">{formatDate(news.date)}</p>
        <p className="news-meta">
          Subido por: {news.user.username}
          {news.user.avatar && (
            <img
              src={news.user.avatar}
              alt={news.user.username}
              style={{ width: 30, height: 30, borderRadius: "50%", marginLeft: 10 }}
            />
          )}
        </p>
      </div>
      <p className="news-meta">Subtemas: {news.subtopics.map((s) => s.name).join(", ")}</p>

      <div className="news-content">
        <img className="news-image" src={news.image || "default-image.jpg"} alt={news.title} />
        <div className="news-description">{news.description}</div>
      </div>
    </div>
  );
};


export default GetNews;
