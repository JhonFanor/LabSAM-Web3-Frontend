import React, { useState } from "react";
import "./GetEducationalOffer.css";
import { EducationalOfferGetResponse } from "../../dtos/responses/EducationalOffer";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { deleteEducationalOffer, setEducationalOfferApproval } from "../../api";
import { ApprovalButton } from "../Button/ApprovalButton";
import { useAuth } from "../../providers/Auth";
import { UpdateEducationalOffer } from "./UpdateEducationalOffer";
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
								<UpdateEducationalOffer onClose={onClose} educationalOfferGetResponse={currentOffer}  onUpdated={(updateOffer) => setCurrentOffer(updateOffer)}  />
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


				<div className="offer-meta-container">
					<div className="offer-meta">
						<p>Inicio: {formatDate(currentOffer.start_date)}</p>
						<p>Fin: {formatDate(currentOffer.end_date)}</p>
					</div>

					<p className="offer-meta">Costo: {currentOffer.currency_type.symbol}{currentOffer.cost} {currentOffer.currency_type.code}</p>
					<p className="offer-meta">Tipo de educación: {currentOffer.type_education.name}</p>
					<p className="offer-meta">
						Subido por:{" "}
						<img src={currentOffer.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
						{
							currentOffer.user.regular_user?.name ||
							currentOffer.user.university_user?.name ||
							currentOffer.user.business_user?.name ||
							"Anónimo"
						}
					</p>
				</div>

				<p className="offer-meta">Subtemas: {currentOffer.subtopics.map((s) => s.name).join(", ")}</p>

				<div className="offer-content">
					<img className="offer-image" src={currentOffer.logo? currentOffer.logo: "/src/assets/img/Logo.jpeg"} alt={currentOffer.title} />

					<div
						className="offer-description"
						dangerouslySetInnerHTML={{ __html: currentOffer.description }}
					/>
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
