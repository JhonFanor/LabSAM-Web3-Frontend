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
import "../Button/ButtonsUpdateDelete.css"

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

	const handleApproval = async (approved: boolean) => {
		const approvalData: ApprovalRequest = { approved };
		await setLegislationApproval(legislation.id, approvalData);
		setIsApproved(approved);
	};

	const isDownload = isInternalLink(legislation.link);
	const url = isDownload ? transformDownloadURL(legislation.link) : legislation.link;

	return (
		<div className="legislation-container">
			{isAuthenticated && !isLoading && (user.id === legislation.user.id || user.role === "admin") && (
				<div className="buttons-update-delete">
					<ButtonUpdate>
						{(onClose) => (
							<UpdateLegislation onClose={onClose} legislationGetResponse={legislation} />
						)}
					</ButtonUpdate>
					<ButtonDelete
						onDelete={() => deleteLegislation(legislation.id)}
						message="¿Estás seguro de que deseas eliminar esta legislación?"
					/>
				</div>
			)}
			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} onClick={handleApproval} message="¿Estás seguro de que deseas aprobar esta legislación?" />
					<ApprovalButton approved={false} onClick={handleApproval} message="¿Estás seguro de que deseas desaprobar esta legislación?" />
				</div>
			)}
			<h1 className="legislation-title">{legislation.title}</h1>

			{legislation.user.regular_user?.name && (
				<p className="legislation-meta">Subido Por: {legislation.user.regular_user.name}</p>
			)}

			<p className="legislation-meta">
				Subtemas: {legislation.subtopics.map((s) => s.name).join(", ")}
			</p>

			<div className="legislation-description">
				<div dangerouslySetInnerHTML={{ __html: legislation.description }} />
			</div>

			<div className="legislation-link">
				{isDownload ? (
					<a href={url} download>
						📥 Descargar documento
					</a>
				) : (
					<a href={url} target="_blank" rel="noopener noreferrer">
						🌐 Ver legislación
					</a>
				)}
			</div>
		</div>
	);
};
