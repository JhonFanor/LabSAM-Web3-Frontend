import React, { useState } from "react";
import "./GetInvestigation.css";
import { InvestigationGetResponse } from "../../dtos/responses/Investigation";
import { useAuth } from "../../providers/Auth";
import { deleteInvestigation, setInvestigationApproval } from "../../api";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { ApprovalButton } from "../Button/ApprovalButton";
import { UpdateInvestigation } from "./UpdateInvestigation";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { ButtonDelete } from "../Button/ButtonDelete";
import "../Button/ButtonsUpdateDelete.css";
import { createRejectionComment } from "../../api/RejectionCommentApi";
import { GetAllRejectComment } from "../RejectionComment/GetAllRejectComment";

interface GetInvestigationProps {
	investigation: InvestigationGetResponse;
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
};

const isInternalLink = (url: string) => url.includes("/uploads/");

const transformDownloadURL = (url: string) => {
	const base = "/api/download/";
	const relativePath = url.split("/uploads/")[1];
	return base + relativePath;
};

export const GetInvestigation: React.FC<GetInvestigationProps> = ({ investigation }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(investigation.is_approved ?? null);
	const [currentInvestigation, setCurrentInvestigation] = useState<InvestigationGetResponse>(investigation);	

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setInvestigationApproval(currentInvestigation.id, approvalData);
		setIsApproved(approved);

		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "investigation",
				resource_id: currentInvestigation.id,
				comment,
			});
		}
	};
	
	const download = isInternalLink(currentInvestigation.link);
	const downloadUrl = download ? transformDownloadURL(currentInvestigation.link) : currentInvestigation.link;

	return (
		<>
			<div className="investigation-container">
				{isAuthenticated && !isLoading && (user.id == currentInvestigation.user.id || user.role == "admin") &&(
					<div className="buttons-update-delete">
						<ButtonUpdate>
							{(onClose) => (
								<UpdateInvestigation onClose={onClose} investigationGetResponse={currentInvestigation} onUpdated={(updateInvestigation) => setCurrentInvestigation(updateInvestigation)} />
							)}
						</ButtonUpdate>
						<ButtonDelete
							onDelete={() => deleteInvestigation(currentInvestigation.id)}
							message="¿Estás seguro de que deseas eliminar esta investigación?"
						/>
					</div>
				)}

				{user?.role === "admin" && isApproved == null && (
					<div className="resume-actions">
						<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar esta investigación?" onApprove={() => handleApproval(true)} onReject={() => {}} />
						<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar esta investigación?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />				
					</div>
				)}

				<h1 className="investigation-title">{currentInvestigation.title}</h1>

				<div className="investigation-meta-container">
					<p className="investigation-meta">{formatDate(currentInvestigation.date)}</p>
					<p className="investigation-meta">Author: {currentInvestigation.author}</p>
					<p className="investigation-meta">
						Subido por:{" "}
						<img src={currentInvestigation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
						{
							currentInvestigation.user.regular_user?.name ||
							currentInvestigation.user.university_user?.name ||
							currentInvestigation.user.business_user?.name ||
							"Anónimo"
						}
					</p>
				</div>

				<p className="investigation-meta">
					Subtemas: {currentInvestigation.subtopics.map((s) => s.name).join(", ")}
				</p>

				<div className="investigation-content">
					<img className="investigation-image" src={currentInvestigation.logo? currentInvestigation.logo:"/src/assets/img/Logo.jpeg"} alt={currentInvestigation.title} />

					<div
						className="investigation-description"
						dangerouslySetInnerHTML={{ __html: currentInvestigation.description }}
					/>
				</div>

				<div className="investigation-link">
					{download ? (
						<a href={downloadUrl} download>
							📥 Descargar investigación
						</a>
					) : (
						<a href={downloadUrl} target="_blank" rel="noopener noreferrer">
							🌐 Ver investigación completa
						</a>
					)}
				</div>
			</div>
			{isAuthenticated && !isLoading && (user.id === currentInvestigation.user.id || user.role === "admin") && (
				<GetAllRejectComment resourceType="investigation" resourceId={currentInvestigation.id} isApproved={isApproved} />
			)}
		</>		
	);
};
