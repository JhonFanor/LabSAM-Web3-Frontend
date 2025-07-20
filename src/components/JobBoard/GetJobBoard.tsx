import React, { useState } from "react";
import "./GetJobBoard.css";
import { JobBoardGetResponse } from "../../dtos/responses/JobBoard";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { UpdateJobBoard } from "./UpdateJobBoard";
import { ApprovalButton } from "../Button/ApprovalButton";
import { deleteJobBoard, setJobBoardApproval } from "../../api";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { useAuth } from "../../providers/Auth";
import { ButtonDelete } from "../Button/ButtonDelete";

interface GetJobBoardProps {
  job: JobBoardGetResponse;
}

export const GetJobBoard: React.FC<GetJobBoardProps> = ({ job }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(job.is_approved ?? null);

	const handleApproval = async (approved: boolean) => {
		const approvalData: ApprovalRequest = { approved };
		await setJobBoardApproval(job.id, approvalData);
		setIsApproved(approved);
	};
	return (
		<div className="job-container">
			{isAuthenticated && !isLoading && (user.id == job.user.id || user.role == "admin") &&(
				<>
					<ButtonUpdate>
						{(onClose) => (
							<UpdateJobBoard onClose={onClose} jobBoardGetResponse={job} />
						)}
					</ButtonUpdate>
					<ButtonDelete
						onDelete={() => deleteJobBoard(job.id)}
						message="¿Estás seguro de que deseas eliminar este trabajo?"
					/>
				</>
			)}
			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} onClick={handleApproval} message="¿Estás seguro de que deseas aprobar este trabajo?" />
					<ApprovalButton approved={false} onClick={handleApproval} message="¿Estás seguro de que deseas desaprobar este trabajo?" />
				</div>
			)}
			<h1 className="job-title">{job.title}</h1>

			<div className="job-meta-container">
				{job.company && <p className="job-meta">Empresa: {job.company}</p>}
				{job.type && <p className="job-meta">Tipo de contrato: {job.type}</p>}
				{job.salary_range && <p className="job-meta">Rango salarial: {job.salary_range}</p>}
				<p className="job-meta">
				Subido por:{" "}
				{job.user.regular_user?.name ||
					job.user.university_user?.name ||
					job.user.business_user?.name ||
					"Anónimo"}
				</p>
			</div>

			<p className="job-meta">Subtemas: {job.subtopics.map((s) => s.name).join(", ")}</p>

			<div className="job-description">
				<div dangerouslySetInnerHTML={{ __html: job.description }} />
			</div>

			<div className="job-link">
				<a href={job.link} target="_blank" rel="noopener noreferrer">
				🌐 Ver oferta completa
				</a>
			</div>
		</div>
	);
};
