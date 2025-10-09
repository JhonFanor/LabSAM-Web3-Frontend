import React, { useState } from "react";
import "./GetDocumentation.css";
import { DocumentationGetResponse } from "../../dtos/responses/Documentation";
import { ApprovalButton } from "../Button/ApprovalButton";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { deleteDocumentation, setDocumentationApproval } from "../../api";
import { useAuth } from "../../providers/Auth";
import { UpdateDocumentation } from "./UpdateDocumentation";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { ButtonDelete } from "../Button/ButtonDelete";
import "../Button/ButtonsUpdateDelete.css";
import { createRejectionComment } from "../../api/RejectionCommentApi";
import { GetAllRejectComment } from "../RejectionComment/GetAllRejectComment";

interface GetDocumentationProps {
  	documentation: DocumentationGetResponse;
}

const isInternalLink = (url: string) => url.includes("/uploads/");

const transformDownloadURL = (url: string) => {
	const base = "/api/download/";
	const relativePath = url.split("/uploads/")[1];
	return base + relativePath;
};

export const GetDocumentation: React.FC<GetDocumentationProps> = ({ documentation }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(documentation.is_approved ?? null);
	const [currentDocumentation, setCurrentDocumentation] = useState<DocumentationGetResponse>(documentation);

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setDocumentationApproval(currentDocumentation.id, approvalData);
		setIsApproved(approved);
		
		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "documentation",
				resource_id: currentDocumentation.id,
				comment,
			});
		}
	};
	const isDownload = isInternalLink(currentDocumentation.link);
	const url = isDownload ? transformDownloadURL(currentDocumentation.link) : currentDocumentation.link;

	return (
		<>
			<div className="doc-container">
				{isAuthenticated && !isLoading && (user.id == currentDocumentation.user.id || user.role == "admin") &&(
					<div className="buttons-update-delete">
						<ButtonUpdate>
							{(onClose) => (
								<UpdateDocumentation onClose={onClose} documentationGetResponse={currentDocumentation} onUpdated={(updateDocumentation) => setCurrentDocumentation(updateDocumentation)} />
							)}
						</ButtonUpdate>
						<ButtonDelete
							onDelete={() => deleteDocumentation(currentDocumentation.id)}
							message="¿Estás seguro de que deseas eliminar esta documentación?"
						/>
					</div>
				)}
				{user?.role === "admin" && isApproved == null && (
					<div className="resume-actions">
						<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar esta documentación?" onApprove={() => handleApproval(true)} onReject={() => {}} />
						<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar esta documentación?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />

					</div>
				)}

				<h1 className="doc-title">{currentDocumentation.title}</h1>

				<div className="doc-meta-container">
					<p className="doc-meta">
						Autor: {documentation.author || "No especificado"}
					</p>
					<p className="doc-meta">
						Subido por:{" "}
						<img src={currentDocumentation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
						{
							currentDocumentation.user.regular_user?.name ||
							currentDocumentation.user.university_user?.name ||
							currentDocumentation.user.business_user?.name ||
							"Anónimo"
						}
					</p>
				</div>

				<p className="doc-meta">
					Subtemas: {currentDocumentation.subtopics.map((s) => s.name).join(", ")}
				</p>

				<div className="doc-description">
					<div dangerouslySetInnerHTML={{ __html: currentDocumentation.description }} />
				</div>

				<div className="doc-link">
					{isDownload ? (
					<a href={url} download>
						📥 Descargar documento
					</a>
					) : (
					<a href={url} target="_blank" rel="noopener noreferrer">
						🌐 Ver documentación
					</a>
					)}
				</div>
			</div>
			{isAuthenticated && !isLoading && (user.id === currentDocumentation.user.id || user.role === "admin") && (
				<GetAllRejectComment resourceType="documentation" resourceId={currentDocumentation.id} isApproved={isApproved} />
			)}
		</>
	);
};
