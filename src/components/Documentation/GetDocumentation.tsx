import React, { useState } from "react";
import "./GetDocumentation.css";
import { DocumentationGetResponse } from "../../dtos/responses/Documentation";
import { ApprovalButton } from "../Button/ApprovalButton";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { setDocumentationApproval } from "../../api";
import { useAuth } from "../../providers/Auth";
import { UpdateDocumentation } from "./UpdateDocumentation";
import { ButtonUpdate } from "../Button/ButtonUpdate";

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

	const handleApproval = async (approved: boolean) => {
		const approvalData: ApprovalRequest = { approved };
		await setDocumentationApproval(documentation.id, approvalData);
		setIsApproved(approved);
	};
	const isDownload = isInternalLink(documentation.link);
	const url = isDownload ? transformDownloadURL(documentation.link) : documentation.link;

	return (
		<div className="doc-container">
			{isAuthenticated && !isLoading && (user.id == documentation.user.id || user.role == "admin") &&(
				<ButtonUpdate>
					{(onClose) => (
						<UpdateDocumentation onClose={onClose} documentationGetResponse={documentation} />
					)}
				</ButtonUpdate>
			)}
			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} onClick={handleApproval} message="¿Estás seguro de que deseas aprobar esta documentación?" />
					<ApprovalButton approved={false} onClick={handleApproval} message="¿Estás seguro de que deseas desaprobar esta documentación?" />
				</div>
			)}

			<h1 className="doc-title">{documentation.title}</h1>

			{documentation.user.regular_user?.name && (
				<p className="doc-meta">Subido por: {documentation.user.regular_user.name}</p>
			)}

			<p className="doc-meta">
				Subtemas: {documentation.subtopics.map((s) => s.name).join(", ")}
			</p>

			<div className="doc-description">
				<div dangerouslySetInnerHTML={{ __html: documentation.description }} />
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
	);
	};
