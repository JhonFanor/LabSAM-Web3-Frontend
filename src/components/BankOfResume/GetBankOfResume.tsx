import React, { useState } from "react";
import "./GetBankOfResume.css";
import { BankOfResumeGetResponse } from "../../dtos/responses/BankOfResume";
import { ApprovalButton } from "../Button/ApprovalButton";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { setBankOfResumeApproval } from "../../api";
import { useAuth } from "../../providers/Auth";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { UpdateBankOfResume } from "./UpdateBankOfResume";

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
	const { user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(resume.is_approved ?? null);

	const handleApproval = async (approved: boolean) => {
		const approvalData: ApprovalRequest = { approved };
		await setBankOfResumeApproval(resume.id, approvalData);
		setIsApproved(approved);
	};

	const isDownload = isInternalLink(resume.link);
	const url = isDownload ? transformDownloadURL(resume.link) : resume.link;
	const userName = resume.user.regular_user?.name;

 	 return (
		<div className="resume-container">
			<ButtonUpdate>
				{(onClose) => (
					<UpdateBankOfResume onClose={onClose} resume={resume} />
				)}
			</ButtonUpdate>

			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} onClick={handleApproval} message="¿Estás seguro de que deseas aprobar esta hoja de vida?" />
					<ApprovalButton approved={false} onClick={handleApproval} message="¿Estás seguro de que deseas desaprobar esta hoja de vida?" />
				</div>
			)}
		
			<h1 className="resume-title">{resume.title}</h1>

			{userName && <h3 className="resume-subtitle">{userName}</h3>}

			<p className="resume-meta">Subtemas: {resume.subtopics.map(s => s.name).join(", ")}</p>

			<div className="resume-content">
				{resume.photo && (
				<img
					src={resume.photo}
					className="resume-photo"
					alt="Foto del postulante"
				/>
				)}

				<div className="resume-summary">
				<div dangerouslySetInnerHTML={{ __html: resume.summary }} />
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
	);
};
