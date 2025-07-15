import React from "react";
import "./GetNews.css";
import { NewsGetResponse } from "../../dtos/responses/News";

interface GetNewsProps {
  news: NewsGetResponse;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
};

export const GetNews: React.FC<GetNewsProps> = ({ news }) => {
  return (
    <div className="news-container">
      <h1 className="news-title">{news.title}</h1>
      <div className="news-meta-container">
        <p className="news-meta">{formatDate(news.date)}</p>
        <p className="news-meta">
          {news.user.avatar && (
            <img
              src={news.user.avatar}
              style={{ width: 30, height: 30, borderRadius: "50%", marginLeft: 10 }}
            />
          )}
        </p>
        <p className="news-meta">
          Subido por:{" "}
          {
            news.user.regular_user?.name ||
            news.user.university_user?.name ||
            news.user.business_user?.name ||
            "Anónimo"
          }
        </p>
      </div>
      <p className="news-meta">Subtemas: {news.subtopics.map((s) => s.name).join(", ")}</p>

      <div className="news-content">
        <img className="news-image" src={news.image || "default-image.jpg"} alt={news.title} />
        <div
          className="news-description"
          dangerouslySetInnerHTML={{ __html: news.description }}
        />
      </div>
    </div>
  );
};
