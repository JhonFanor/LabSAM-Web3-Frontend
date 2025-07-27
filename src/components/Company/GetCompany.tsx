import React, { useState } from "react";
import "./GetCompany.css";
import { CompanyGetResponse } from "../../dtos/responses/Company";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ApprovalRequest } from "../../dtos/responses/Approval";
import { deleteCompany, setCompanyApproval } from "../../api";
import { ApprovalButton } from "../Button/ApprovalButton";
import { useAuth } from "../../providers/Auth";
import { ButtonUpdate } from "../Button/ButtonUpdate";
import { UpdateCompany } from "./UpdateCompany";
import { ButtonDelete } from "../Button/ButtonDelete";
import "../Button/ButtonsUpdateDelete.css"
import { createRejectionComment } from "../../api/RejectionCommentApi";

interface GetCompanyProps {
  company: CompanyGetResponse;
}

export const GetCompany: React.FC<GetCompanyProps> = ({ company }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(company.is_approved ?? null);
	
	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setCompanyApproval(company.id, approvalData);
		setIsApproved(approved);
		
		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "company",
				resource_id: company.id,
				comment,
			});
		}
	};

	return (
		<div className="company-container">
			{isAuthenticated && !isLoading && (user.id == company.user.id || user.role == "admin") &&(
				<div className="buttons-update-delete">
					<ButtonUpdate>
						{(onClose) => (
							<UpdateCompany onClose={onClose} companyGetResponse={company} />
						)}
					</ButtonUpdate>
					<ButtonDelete
						onDelete={() => deleteCompany(company.id)}
						message="¿Estás seguro de que deseas eliminar esta empresa?"
					/>
				</div>
			)}
		
			{user?.role === "admin" && isApproved == null && (
				<div className="resume-actions">
					<ApprovalButton approved={true} message="¿Estás seguro de que deseas aprobar esta empresa?" onApprove={() => handleApproval(true)} onReject={() => {}} />
					<ApprovalButton approved={false} message="¿Estás seguro de que deseas desaprobar esta empresa?" onApprove={() => {}} onReject={(comment) => handleApproval(false, comment)} />
				</div>
			)}
			  
		
			<h1 className="company-title">{company.name}</h1>

			<div className="company-meta-container">
				<p className="company-meta">Industria: {company.industry}</p>
				{company.website && (
				<p className="company-meta">
					🌐 Sitio web:{" "}
					<a href={company.website} target="_blank" rel="noopener noreferrer">
					{company.website}
					</a>
				</p>
				)}
				{company.email && <p className="company-meta">Correo: {company.email}</p>}

				<p className="company-meta">
				Subido por:{" "}
				{company.user.regular_user?.name ||
					company.user.university_user?.name ||
					company.user.business_user?.name ||
					"Anónimo"}
				</p>
			</div>

			<p className="company-meta">Subtemas: {company.subtopics.map((s) => s.name).join(", ")}</p>

			{company.localitation && (
				<div className="company-map-container">
				<h3>📍 Ubicación</h3>
				<p className="company-meta">{company.localitation.address}</p>
				<MapContainer
					center={[company.localitation.latitude, company.localitation.longitude]}
					zoom={15}
					scrollWheelZoom={false}
					className="company-map"
				>
					<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={[company.localitation.latitude, company.localitation.longitude]}>
					<Popup>{company.localitation.address}</Popup>
					</Marker>
				</MapContainer>
				</div>
			)}
		</div>
	);
};
