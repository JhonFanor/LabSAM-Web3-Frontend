import React, { useState } from "react";
import "./GetBankOfResume.css";
import { BankOfResumeGetResponse } from "../../dtos/responses/BankOfResume";
import { ApprovalButton } from "../Button/ApprovalButton";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { deleteBankOfResume, setBankOfResumeApproval } from "../../api";
import { useAuth } from "../../providers/Auth";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { UpdateBankOfResume } from "./UpdateBankOfResume";
import { ButtonDelete } from "../Button/ButtonDelete";
import "../Button/ButtonsUpdateDelete.css";
import { createRejectionComment } from "../../api/RejectionCommentApi";
import { GetAllRejectComment } from "../RejectionComment/GetAllRejectComment";

interface GetBankOfResumeProps {
	resume: BankOfResumeGetResponse;
}

const isInternalLink = (url: string) => url.includes("/uploads/");
const transformDownloadURL = (url: string) => {
	const base = "/api/download/";
	const relativePath = url.split("/uploads/")[1];
	return base + relativePath;
};

export const GetBankOfResume: React.FC<GetBankOfResumeProps> = ({ resume }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(resume.is_approved ?? null);
	const [currentResume, setCurrentResume] = useState<BankOfResumeGetResponse>(resume);

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setBankOfResumeApproval(currentResume.id, approvalData);
		setIsApproved(approved);

		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "bank_of_resume",
				resource_id: currentResume.id,
				comment,
			});
		}
	};

	const isDownload = isInternalLink(currentResume.link);
	const url = isDownload ? transformDownloadURL(currentResume.link) : currentResume.link;
	const userName = currentResume.user.regular_user?.name;

 	 return (
		<>
			<div className="resume-container">
				{isAuthenticated && !isLoading && (user.id === currentResume.user.id || user.role === "admin") && (
					<div className="buttons-update-delete">
						<ButtonUpdate>
							{(onClose) => (
								<UpdateBankOfResume onClose={onClose} resume={currentResume} onUpdated={(updateResume) => setCurrentResume(updateResume)} />
							)}
						</ButtonUpdate>
						<ButtonDelete onDelete={() => deleteBankOfResume(currentResume.id)} message="¿Estás seguro de que deseas eliminar esta hoja de vida?" />
					</div>
				)}

				{user?.role === "admin" && isApproved == null && (
					<div className="resume-actions">
						<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar esta hoja de vida?" onApprove={() => handleApproval(true)} onReject={() => {}} />
						<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar esta hoja de vida?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />
					</div>
				)}
			
				<h1 className="resume-title">{currentResume.title}</h1>

				{userName && <h3 className="resume-subtitle">{userName}</h3>}

				<p className="resume-meta">Subtemas: {currentResume.subtopics.map(s => s.name).join(", ")}</p>

				<div className="resume-content">
					{currentResume.photo && (
						<img src={currentResume.photo} className="resume-photo" alt="Foto del postulante" /> 
					)}
					<div className="resume-summary">
						<div dangerouslySetInnerHTML={{ __html: currentResume.summary }} />
					</div>
				</div>

				<div className="resume-link">
					{isDownload ? (
						<a href={url} download>
							📥 Descargar hoja de vida
						</a>
					) : (
						<a href={url} target="_blank" rel="noopener noreferrer">
							🌐 Ver hoja de vida
						</a>
					)}
				</div>
			</div>
			{isAuthenticated && !isLoading && (user.id === currentResume.user.id || user.role === "admin") && (
				<GetAllRejectComment resourceType="bank_of_resume" resourceId={currentResume.id} isApproved={isApproved} />
			)}
		</>
	);
};
