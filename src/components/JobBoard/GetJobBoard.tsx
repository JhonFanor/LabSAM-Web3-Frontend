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
import "../Button/ButtonsUpdateDelete.css";
import { createRejectionComment } from "../../api/RejectionCommentApi";
import { GetAllRejectComment } from "../RejectionComment/GetAllRejectComment";

interface GetJobBoardProps {
  job: JobBoardGetResponse;
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("es-ES", { 
		year: "numeric", 
		month: "long", day: 
		"numeric" 
	});
};

export const GetJobBoard: React.FC<GetJobBoardProps> = ({ job }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(job.is_approved ?? null);
	const [currentJob, setCurrentJob] = useState<JobBoardGetResponse>(job);

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setJobBoardApproval(currentJob.id, approvalData);
		setIsApproved(approved);

		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "job_board",
				resource_id: currentJob.id,
				comment,
			});
		}
	};
	return (
		<>
			<div className="job-container">
				{isAuthenticated && !isLoading && (user.id == currentJob.user.id || user.role == "admin") &&(
					<div className="buttons-update-delete">
						<ButtonUpdate>
							{(onClose) => (
								<UpdateJobBoard onClose={onClose} jobBoardGetResponse={currentJob} onUpdated={(updateJob) => setCurrentJob(updateJob)} />
							)}
						</ButtonUpdate>
						<ButtonDelete
							onDelete={() => deleteJobBoard(currentJob.id)}
							message="¿Estás seguro de que deseas eliminar este trabajo?"
						/>
					</div>
				)}
				{user?.role === "admin" && isApproved == null && (
					<div className="resume-actions">
						<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar este trabajo?" onApprove={() => handleApproval(true)} onReject={() => {}} />
						<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar este trabajo?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />
					</div>
				)}
				<h1 className="job-title">{currentJob.title}</h1>

				<div className="job-meta-container">
					{currentJob.company && <p className="job-meta">Empresa: {currentJob.company}</p>}
					{currentJob.type && <p className="job-meta">Tipo de contrato: {currentJob.type}</p>}
					{currentJob.salary_range && <p className="job-meta">Rango salarial:{currentJob.currency_type.code} {currentJob.currency_type.symbol} {currentJob.salary_range}</p>}
					{currentJob.start_date &&  <p className="job-meta">Fecha de inicio: {formatDate(currentJob.start_date)}</p>}
					{currentJob.end_date &&  <p className="job-meta">Fecha de finalización: {formatDate(currentJob.end_date)}</p>}
					<p className="job-meta">
					Subido por:{" "}
					<img src={currentJob.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
					{
						currentJob.user.regular_user?.name ||
						currentJob.user.university_user?.name ||
						currentJob.user.business_user?.name ||
						"Anónimo"
					}
					</p>
				</div>

				<p className="job-meta">Subtemas: {currentJob.subtopics.map((s) => s.name).join(", ")}</p>

				<div className="job-content">
					<img className="job-image" src={currentJob.logo? currentJob.logo: "/src/assets/img/Logo.jpeg"} alt={currentJob.title} />

					<div
						className="job-description"
						dangerouslySetInnerHTML={{ __html: currentJob.description }}
					/>
				</div>

				<div className="job-link">
					<a href={currentJob.link} target="_blank" rel="noopener noreferrer">
					🌐 Ver oferta completa
					</a>
				</div>
			</div>
			{isAuthenticated && !isLoading && (user.id === currentJob.user.id || user.role === "admin") && (
				<GetAllRejectComment resourceType="job_board" resourceId={currentJob.id} isApproved={isApproved} />
			)}
		</>
	);
};
