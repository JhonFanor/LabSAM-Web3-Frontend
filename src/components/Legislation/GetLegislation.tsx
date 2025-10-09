import React, { useState } from "react";
import "./GetLegislation.css";
import { LegislationGetResponse } from "../../dtos/responses/Legislation";
import { useAuth } from "../../providers/Auth";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { deleteLegislation, setLegislationApproval } from "../../api";
import { ApprovalButton } from "../Button/ApprovalButton";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { UpdateLegislation } from "./UpdateLegislation";
import { ButtonDelete } from "../Button/ButtonDelete";
import "../Button/ButtonsUpdateDelete.css";
import { createRejectionComment } from "../../api/RejectionCommentApi";
import { GetAllRejectComment } from "../RejectionComment/GetAllRejectComment";

interface GetLegislationProps {
	legislation: LegislationGetResponse;
}

const isInternalLink = (url: string) => url.includes("/uploads/");
const transformDownloadURL = (url: string) => {
	const base = "/api/download/";
	const relativePath = url.split("/uploads/")[1];
	return base + relativePath;
};

export const GetLegislation: React.FC<GetLegislationProps> = ({ legislation }) => {
	const { isAuthenticated, isLoading, user } = useAuth();
	const [isApproved, setIsApproved] = useState<boolean | null>(legislation.is_approved ?? null);
	const [currentLegislation, setCurrentLegislation] = useState<LegislationGetResponse>(legislation);	

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setLegislationApproval(currentLegislation.id, approvalData);
		setIsApproved(approved);
		if (!approved && comment) {
			await createRejectionComment({ resource_type: "legislation", resource_id: currentLegislation.id, comment });
		}
	};

	const isDownload = isInternalLink(currentLegislation.link);
	const url = isDownload ? transformDownloadURL(currentLegislation.link) : currentLegislation.link;

	return (
		<>
			<div className="legislation-container">
				{isAuthenticated && !isLoading && (user.id === currentLegislation.user.id || user.role === "admin") && (
					<div className="buttons-update-delete">
						<ButtonUpdate>
							{(onClose) => (
								<UpdateLegislation onClose={onClose} legislationGetResponse={legislation} onUpdated={(updateLegislation) => setCurrentLegislation(updateLegislation)}/>
							)}
						</ButtonUpdate>
						<ButtonDelete onDelete={() => deleteLegislation(currentLegislation.id)} message="¿Estás seguro de que deseas eliminar esta legislación?" />
					</div>
				)}
				{user?.role === "admin" && isApproved == null && (
					<div className="resume-actions">
						<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar esta legislacion?" onApprove={() => handleApproval(true)} onReject={() => {}} />
						<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar esta legislación?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />				
					</div>
				)}
				<h1 className="legislation-title">{currentLegislation.title}</h1>
				<p className="legislation-date">{new Date(currentLegislation.date).toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"})}</p>
				<p className="legislation-type">Tipo de ley: {currentLegislation.type_of_law?.name || "No especificado"}</p>
				<div className="legislation-meta-container">
					<p className="legislation-meta">Subido por: <img src={currentLegislation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
					{currentLegislation.user.regular_user?.name || currentLegislation.user.university_user?.name || currentLegislation.user.business_user?.name || "Anónimo"}</p>
				</div>
				<p className="legislation-meta">Subtemas: {currentLegislation.subtopics.map((s) => s.name).join(", ")}</p>
				<div className="legislation-content">
					<img src={currentLegislation.logo  || "/src/assets/img/Logo.jpeg"} alt={currentLegislation.title} className="legislation-logo" />
					<div className="legislation-description"><div dangerouslySetInnerHTML={{ __html: currentLegislation.description }}/></div>
				</div>	
				<div className="legislation-link">
					{isDownload ? (<a href={url} download>📥 Descargar documento</a>) : (<a href={url} target="_blank" rel="noopener noreferrer">🌐 Ver legislación</a>)}
				</div>
			</div>
			{isAuthenticated && !isLoading && (user.id === currentLegislation.user.id || user.role === "admin") && (
				<GetAllRejectComment resourceType="legislation" resourceId={currentLegislation.id} isApproved={isApproved} />
			)}
		</>
	);
};
