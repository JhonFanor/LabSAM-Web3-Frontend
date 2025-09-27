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
import "../Button/ButtonsUpdateDelete.css";
import { createRejectionComment } from "../../api/RejectionCommentApi";
import { GetAllRejectComment } from "../RejectionComment/GetAllRejectComment";

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
	const [currentNews, setCurrentNews] = useState<NewsGetResponse>(news);

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setNewsApproval(currentNews.id, approvalData);
		setIsApproved(approved);

		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "news",
				resource_id: currentNews.id,
				comment,
			});
		}
	};

	return (
		<>
			<div className="get-new">
				{isAuthenticated && !isLoading && (user.id == currentNews.user.id || user.role == "admin") && (
					<div className="buttons-update-delete">
						<ButtonUpdate>
							{(onClose) => (
								<UpdateNews onClose={onClose} newsGetResponse={currentNews} onUpdated={(updatedNews) => setCurrentNews(updatedNews)}/>
							)}
						</ButtonUpdate>
						<ButtonDelete onDelete={() => deleteNews(currentNews.id)} message="¿Estás seguro de que deseas eliminar esta noticia?" />
					</div>
				)}

				{user?.role === "admin" && isApproved == null && (
					<div className="resume-actions">
						<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar este noticia?" onApprove={() => handleApproval(true)} onReject={() => {}} />
						<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar este noticia?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />
					</div>
				)}

				<h1 className="get-new-title">{currentNews.title}</h1>

				<div className="get-new-meta-container">
					<p className="get-new-meta">{formatDate(currentNews.date)}</p>
					<p className="get-new-meta">
						Subido por:{" "}
						<img src={currentNews.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
						{
							currentNews.user.regular_user?.name ||
							currentNews.user.university_user?.name ||
							currentNews.user.business_user?.name ||
							"Anónimo"
						}
					</p>
				</div>
				<p className="get-new-meta">
					Subtemas: {currentNews.subtopics.map((s) => s.name).join(", ")}
				</p>

				<div className="get-new-content">
					<img className="get-new-image" src={currentNews.image || "default-image.jpg"} alt={currentNews.title} />
					<div className="get-new-description" dangerouslySetInnerHTML={{ __html: currentNews.description }} />
				</div>

				<div className="get-new-link">
					{currentNews.link ? (
					<a href={currentNews.link} target="_blank" rel="noopener noreferrer">
						Enlace a la noticia
					</a>
					) : null}
				</div>
			</div>
			{isAuthenticated && !isLoading && (user.id === currentNews.user.id || user.role === "admin") && (
				<GetAllRejectComment resourceType="news" resourceId={currentNews.id} isApproved={isApproved} />
			)}
		</>
	);
};
