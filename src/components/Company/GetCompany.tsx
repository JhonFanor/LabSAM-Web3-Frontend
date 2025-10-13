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
import "../Button/ButtonsUpdateDelete.css";
import { createRejectionComment } from "../../api/RejectionCommentApi";
import { GetAllRejectComment } from "../RejectionComment/GetAllRejectComment";
import imagePage from "../../assets/img/Logo.jpeg"

interface GetCompanyProps {
  company: CompanyGetResponse;
}

export const GetCompany: React.FC<GetCompanyProps> = ({ company }) => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [isApproved, setIsApproved] = useState<boolean | null>(company.is_approved ?? null);
	const [currentCompany, setCurrentCompany] = useState<CompanyGetResponse>(company);

	const handleApproval = async (approved: boolean, comment?: string) => {
		const approvalData: ApprovalRequest = { approved };
		await setCompanyApproval(currentCompany.id, approvalData);
		setIsApproved(approved);
		
		if (!approved && comment) {
			await createRejectionComment({
				resource_type: "company",
				resource_id: currentCompany.id,
				comment,
			});
		}
	};

	// Convertir proyectos de string a array
	const projectsArray = currentCompany.projects 
		? currentCompany.projects.split(';').filter(project => project.trim() !== '')
		: [];

	return (
		<>
			<div className="company-container">
				{isAuthenticated && !isLoading && (user.id == currentCompany.user.id || user.role == "admin") &&(
					<div className="buttons-update-delete">
						<ButtonUpdate>
							{(onClose) => (
								<UpdateCompany onClose={onClose} companyGetResponse={currentCompany}  onUpdated={(updateCompany) => setCurrentCompany(updateCompany)} />
							)}
						</ButtonUpdate>
						<ButtonDelete
							onDelete={() => deleteCompany(currentCompany.id)}
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
				
				<div className="company-header">
					<img 
						src={currentCompany.logo || imagePage} 
						alt={`Logo de ${currentCompany.name}`}
						className="company-logo"
					/>
					<div className="company-header-info">
						<h1 className="company-title">{currentCompany.name}</h1>
						<p className="company-industry">{currentCompany.industry}</p>
					</div>
				</div>

				<div className="company-meta-container">
					{currentCompany.website && (
					<p className="company-meta">
						🌐 Sitio web:{" "}
						<a href={currentCompany.website} target="_blank" rel="noopener noreferrer">
						{currentCompany.website}
						</a>
					</p>
					)}
					{currentCompany.email && <p className="company-meta">📧 {currentCompany.email}</p>}

					<p className="company-meta">
					👤 Subido por:{" "}
					<img src={currentCompany.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
					{
						currentCompany.user.regular_user?.name ||
						currentCompany.user.university_user?.name ||
						currentCompany.user.business_user?.name ||
						"Anónimo"
					}
					</p>
				</div>

				<p className="company-subtopics">
					🏷️ Subtemas: {currentCompany.subtopics.map((s) => s.name).join(", ")}
				</p>

				{projectsArray.length > 0 && (
					<div className="company-projects">
						<h3>🚀 Proyectos ({projectsArray.length})</h3>
						<div className="projects-list">
							{projectsArray.map((project, index) => (
								<div key={index} className="project-item">
									<span className="project-number">{index + 1}</span>
									<span className="project-name">{project}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{currentCompany.localitation &&
					typeof currentCompany.localitation.latitude === "number" &&
					typeof currentCompany.localitation.longitude === "number" && (
					<div className="company-map-container">
					<h3>📍 Ubicación</h3>
					<p className="company-meta">{currentCompany.localitation.address}</p>
					<MapContainer
						center={[currentCompany.localitation.latitude, currentCompany.localitation.longitude]}
						zoom={15}
						scrollWheelZoom={false}
						className="company-map"
					>
						<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={[currentCompany.localitation.latitude, currentCompany.localitation.longitude]}>
						<Popup>{currentCompany.localitation.address}</Popup>
						</Marker>
					</MapContainer>
					</div>
				)}
			</div>
			{isAuthenticated && !isLoading && (user.id === currentCompany.user.id || user.role === "admin") && (
				<GetAllRejectComment resourceType="company" resourceId={currentCompany.id} isApproved={isApproved} />
			)}
		</>
	);
};