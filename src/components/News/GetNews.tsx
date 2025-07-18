import React, { useState } from "react";
import "./GetNews.css";
import { NewsGetResponse } from "../../dtos/responses/News";
import { useAuth } from "../../providers/Auth";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { setNewsApproval } from "../../api";
import { ApprovalButton } from "../Button/ApprovalButton";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { UpdateNews } from "./UpdateNews";

interface GetNewsProps {
  news: NewsGetResponse;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
};

export const GetNews: React.FC<GetNewsProps> = ({ news }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(news.is_approved ?? null);

	const handleApproval = async (approved: boolean) => {
		const approvalData: ApprovalRequest = { approved };
		await setNewsApproval(news.id, approvalData);
		setIsApproved(approved);
	};

	return (
		<div className="news-container">
			{isAuthenticated && !isLoading && (user.id == news.user.id || user.role == "admin") &&(
				<ButtonUpdate>
					{(onClose) => (
						<UpdateNews onClose={onClose} newsGetResponse={news} />
					)}
				</ButtonUpdate>
			)}
			
			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} onClick={handleApproval} message="¿Estás seguro de que deseas aprobar esta noticia?" />
					<ApprovalButton approved={false} onClick={handleApproval} message="¿Estás seguro de que deseas desaprobar esta noticia?" />
				</div>
			)}

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
