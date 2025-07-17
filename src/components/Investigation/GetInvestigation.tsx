import React, { useState } from "react";
import "./GetInvestigation.css";
import { InvestigationGetResponse } from "../../dtos/responses/Investigation";
import { useAuth } from "../../providers/Auth";
import { setInvestigationApproval } from "../../api";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { ApprovalButton } from "../Button/ApprovalButton";

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
	const { user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(investigation.is_approved ?? null);
	
	const handleApproval = async (approved: boolean) => {
		const approvalData: ApprovalRequest = { approved };
		await setInvestigationApproval(investigation.id, approvalData);
		setIsApproved(approved);
	};
	
	const download = isInternalLink(investigation.link);
	const downloadUrl = download ? transformDownloadURL(investigation.link) : investigation.link;

	return (
		<div className="investigation-container">
			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} onClick={handleApproval} message="¿Estás seguro de que deseas aprobar esta investigación?" />
					<ApprovalButton approved={false} onClick={handleApproval} message="¿Estás seguro de que deseas desaprobar esta investigación?" />
				</div>
			)}

			<h1 className="investigation-title">{investigation.title}</h1>

			<div className="investigation-meta-container">
				<p className="investigation-meta">{formatDate(investigation.date)}</p>
				<p className="investigation-meta">
					Subido por:{" "}
					{investigation.user.regular_user?.name ||
						investigation.user.university_user?.name ||
						investigation.user.business_user?.name ||
						"Anónimo"}
				</p>
			</div>

			<p className="investigation-meta">
				Subtemas: {investigation.subtopics.map((s) => s.name).join(", ")}
			</p>

			<div className="investigation-description">
				<div dangerouslySetInnerHTML={{ __html: investigation.description }} />
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
	);
};
