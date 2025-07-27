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
import "../Button/ButtonsUpdateDelete.css"
import { createRejectionComment } from "../../api/RejectionCommentApi";

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

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setEducationalOfferApproval(offer.id, approvalData);
		setIsApproved(approved);

		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "educational_offer",
				resource_id: offer.id,
				comment,
			});
		}
	};

	return (
		<div className="offer-container">
			{isAuthenticated && !isLoading && (user.id == offer.user.id || user.role == "admin") &&(
				<div className="buttons-update-delete">
					<ButtonUpdate>
						{(onClose) => (
							<UpdpateEducationalOffer onClose={onClose} educationalOfferGetResponse={offer} />
						)}
					</ButtonUpdate>
					<ButtonDelete
						onDelete={() => deleteEducationalOffer(offer.id)}
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

			<h1 className="offer-title">{offer.title}</h1>

			<h3 className="offer-subtitle">Institución: {offer.institution}</h3>


			<div className="offer-meta">
				

				<div className="offer-dates">
					<p>Inicio: {formatDate(offer.start_date)}</p>
					<p>Fin: {formatDate(offer.end_date)}</p>
				</div>

				<p>Costo: {formatCurrency(offer.cost)}</p>
			
				{offer.user.regular_user?.name && (
					<p>Subido por:  {offer.user.regular_user.name}</p>
				)}

				<p>Subtemas: {offer.subtopics.map((s) => s.name).join(", ")}</p>
			</div>

			<div className="offer-description">
				<div dangerouslySetInnerHTML={{ __html: offer.description }} />
			</div>

			{offer.link && (
				<div className="offer-link">
					<a href={offer.link} target="_blank" rel="noopener noreferrer">
						🌐 Ir a la oferta educativa
					</a>
				</div>
			)}
		</div>
	);
};
