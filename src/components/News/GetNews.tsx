import React, { useState } from "react";
import "./GetNews.css";
import { NewsGetResponse } from "../../dtos/responses/News";
import { useAuth } from "../../providers/Auth";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { deleteNews, setNewsApproval } from "../../api";
import { ApprovalButton } from "../Button/ApprovalButton";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { UpdateNews } from "./UpdateNews";
import { ButtonDelete } from "../Button/ButtonDelete";
import "../Button/ButtonsUpdateDelete.css"
import { createRejectionComment } from "../../api/RejectionCommentApi";

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

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setNewsApproval(news.id, approvalData);
		setIsApproved(approved);

		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "news",
				resource_id: news.id,
				comment,
			});
		}
	};

	return (
		<div className="news-container">
			{isAuthenticated && !isLoading && (user.id == news.user.id || user.role == "admin") &&(
				<div className="buttons-update-delete">
					<ButtonUpdate>
						{(onClose) => (
							<UpdateNews onClose={onClose} newsGetResponse={news} />
						)}
					</ButtonUpdate>
					<ButtonDelete
						onDelete={() => deleteNews(news.id)}
						message="¿Estás seguro de que deseas eliminar esta noticia?"
					/>
				</div>
			)}
			
			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar este noticia?" onApprove={() => handleApproval(true)} onReject={() => {}} />
					<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar este noticia?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />
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
