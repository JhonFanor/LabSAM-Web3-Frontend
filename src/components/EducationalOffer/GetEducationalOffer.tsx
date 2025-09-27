import React, { useState } from "react";
import "./GetEducationalOffer.css";
import { EducationalOfferGetResponse } from "../../dtos/responses/EducationalOffer";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { deleteEducationalOffer, setEducationalOfferApproval } from "../../api";
import { ApprovalButton } from "../Button/ApprovalButton";
import { useAuth } from "../../providers/Auth";
import { UpdpateEducationalOffer } from "./UpdateEducationalOffer";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { ButtonDelete } from "../Button/ButtonDelete";
import "../Button/ButtonsUpdateDelete.css";
import { createRejectionComment } from "../../api/RejectionCommentApi";
import { GetAllRejectComment } from "../RejectionComment/GetAllRejectComment";

interface GetEducationalOfferProps {
	offer: EducationalOfferGetResponse;
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const formatCurrency = (value: number) =>
	value.toLocaleString("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	});

export const GetEducationalOffer: React.FC<GetEducationalOfferProps> = ({ offer }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(offer.is_approved ?? null);
	const [currentOffer, setCurrentOffer] = useState<EducationalOfferGetResponse>(offer);

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setEducationalOfferApproval(currentOffer.id, approvalData);
		setIsApproved(approved);

		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "educational_offer",
				resource_id: currentOffer.id,
				comment,
			});
		}
	};

	return (
		<>
			<div className="offer-container">
				{isAuthenticated && !isLoading && (user.id == currentOffer.user.id || user.role == "admin") &&(
					<div className="buttons-update-delete">
						<ButtonUpdate>
							{(onClose) => (
								<UpdpateEducationalOffer onClose={onClose} educationalOfferGetResponse={currentOffer}  onUpdated={(updateOffer) => setCurrentOffer(updateOffer)}  />
							)}
						</ButtonUpdate>
						<ButtonDelete
							onDelete={() => deleteEducationalOffer(currentOffer.id)}
							message="¿Estás seguro de que deseas eliminar esta oferta educativa?"
						/>
					</div>
				)}
				{user?.role === "admin" && isApproved == null && (
					<div className="resume-actions">
						<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar esta oferta educativa?" onApprove={() => handleApproval(true)} onReject={() => {}} />
						<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar esta oferta educativa?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />
					</div>
				)}

				<h1 className="offer-title">{currentOffer.title}</h1>

				<h3 className="offer-subtitle">Institución: {currentOffer.institution}</h3>


				<div className="offer-meta">
					

					<div className="offer-dates">
						<p>Inicio: {formatDate(currentOffer.start_date)}</p>
						<p>Fin: {formatDate(currentOffer.end_date)}</p>
					</div>

					<p>Costo: {formatCurrency(currentOffer.cost)}</p>
					<p>
						Subido por:{" "}
						<img src={currentOffer.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
						{
							currentOffer.user.regular_user?.name ||
							currentOffer.user.university_user?.name ||
							currentOffer.user.business_user?.name ||
							"Anónimo"
						}
					</p>
					<p>Subtemas: {currentOffer.subtopics.map((s) => s.name).join(", ")}</p>
				</div>

				<div className="offer-description">
					<div dangerouslySetInnerHTML={{ __html: currentOffer.description }} />
				</div>

				{currentOffer.link && (
					<div className="offer-link">
						<a href={currentOffer.link} target="_blank" rel="noopener noreferrer">
							🌐 Ir a la oferta educativa
						</a>
					</div>
				)}
			</div>
			{isAuthenticated && !isLoading && (user.id === currentOffer.user.id || user.role === "admin") && (
				<GetAllRejectComment resourceType="educational_offer" resourceId={currentOffer.id} isApproved={isApproved} />
			)}
		</>
	);
};
