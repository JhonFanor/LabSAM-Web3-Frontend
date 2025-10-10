import React, { useState, useEffect } from "react";
import { createCompany, getAllTopics, uploadImageFile } from "../../api";
import { TopicGetAllResponse } from "../../dtos/responses";
import { CompanyCreateRequest } from "../../dtos/requests";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, Localitation, ImageInputSelector } from "../../components";
import "./CreateCompany.css";

interface CreateCompanyProps {
	onClose: () => void;
}

export const CreateCompany: React.FC<CreateCompanyProps> = ({ onClose }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
	const [subtopicError, setSubtopicError] = useState<boolean>(false);
	const [projectInput, setProjectInput] = useState<string>("");
	const [projectsList, setProjectsList] = useState<string[]>([]);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);	

	const [company, setCompany] = useState<CompanyCreateRequest>({
		name: "",
		logo: "",
		industry: "",
		website: "",
		email: "",
		projects: "",
		localitation: undefined,
		subtopic_ids: [],
	});

	const [localitation, setLocalitation] = useState<{ address: string; latitude: number; longitude: number } | undefined >(undefined);

	useEffect(() => {
		getAllTopics(setTopics);
	}, []);

	const allSubtopics = topics.flatMap(topic => topic.subtopics);

	const handleAddProject = () => {
		if (projectInput.trim() === "") return;
		
		const newProjects = [...projectsList, projectInput.trim()];
		setProjectsList(newProjects);
		setProjectInput("");
		
		setCompany({
			...company,
			projects: newProjects.join(";")
		});
	};

	const handleRemoveProject = (index: number) => {
		const newProjects = projectsList.filter((_, i) => i !== index);
		setProjectsList(newProjects);
		
		setCompany({
			...company,
			projects: newProjects.join(";")
		});
	};

	const handleProjectKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddProject();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);
		setSubtopicError(false);

		if (company.subtopic_ids.length === 0) {
            setSubtopicError(true);
            setUploading(false);
            return;
        }

		try {
			let imagePath = company.logo;
			
			if (selectedImageFile) {
				try {
					imagePath = await uploadImageFile(selectedImageFile, "company");
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir imagen:" + uploadError);
					return;
				}
			}

			const companyToSend: CompanyCreateRequest = {
				...company,
				logo: imagePath,
				...(localitation && { localitation }),
			}

			await createCompany(companyToSend);

			setSelectedTopic(null);
			setLocalitation(undefined);
			setSelectedImageFile(null);
			setImageUploaderKey(Date.now());
			setProjectsList([]);
			setProjectInput("");

			setCompany({
				name: "",
				logo: "",
				industry: "",
				website: "",
				email: "",
				projects: "",
				localitation: undefined,
				subtopic_ids: [],
			});

			setSuccessMessage("Empresa creada exitosamente.");
			return ;
		} catch (error) {
			setSuccessMessage("Error al crear empresa:" + error);
		} finally {
			setUploading(false);
		}
	};

	useEffect(() => {
		if (successMessage) {
			const timeout = setTimeout(() => setSuccessMessage(null), 10000); 
			return () => clearTimeout(timeout);
		}	
	}, [successMessage] );

	return (
		<div className="create-company">
			<ButtonClose onClick={onClose}/>
			<h2 className="create-company__title">Crear Empresa</h2>
			{successMessage && (
				<div className="success-message">
					{successMessage}
				</div>
			)}
			<form className="create-company__form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Nombre de la empresa*</label>
					<input 
						type="text" 
						name="name" 
						placeholder="Nombre de la empresa" 
						value={company.name} 
						onChange={(e) => setCompany({ ...company, name: e.target.value })} 
						required 
					/>
				</div>
				<div className="form-group">
					<label>Industria*</label>
					<input 
						type="text" 
						name="industry" 
						placeholder="Industria" 
						value={company.industry} 
						onChange={(e) => setCompany({ ...company, industry: e.target.value })} 
						required 
					/>
				</div>
				<div className="form-group">
					<label>Logo</label>
					<ImageInputSelector 
						value={company.logo ?? ""} 
						onChange={(img) => setCompany({ ...company, logo: img })} 
						onFileSelected={setSelectedImageFile} 
						urlLabel="📎 URL de la imagen" 
						fileLabel="🖼️ Subir la imagen" 
						imageUploaderKey={imageUploaderKey} 
					/>
				</div>
				<div className="form-group">
					<label>Website</label>
					<input 
						type="text" 
						name="website" 
						placeholder="Sitio web" 
						value={company.website} 
						onChange={(e) => setCompany({ ...company, website: e.target.value })} 
					/>
				</div>
				<div className="form-group">
					<label>Email</label>
					<input 
						type="email" 
						name="email" 
						placeholder="Correo electrónico" 
						value={company.email} 
						onChange={(e) => setCompany({ ...company, email: e.target.value })} 
					/>
				</div>

				<div className="form-group">
					<label>Proyectos</label>
					<div className="projects-input-container">
						<div className="projects-input-wrapper">
							<input
								type="text"
								placeholder="Nombre del proyecto"
								value={projectInput}
								onChange={(e) => setProjectInput(e.target.value)}
								onKeyPress={handleProjectKeyPress}
								className="projects-input"
							/>
							<button
								type="button"
								onClick={handleAddProject}
								className="add-project-button"
								disabled={projectInput.trim() === ""}
							>
								+
							</button>
						</div>
						{projectsList.length > 0 && (
							<div className="projects-list">
								{projectsList.map((project, index) => (
									<div key={index} className="project-item">
										<span className="project-name">{project}</span>
										<button
											type="button"
											onClick={() => handleRemoveProject(index)}
											className="remove-project-button"
										>
											×
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
				
				{ subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={company} setData={setCompany} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={company} setData={setCompany} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

				{!localitation ? (
					<button type="button" className="create-company__localitation" onClick={() => setLocalitation({ address: "", latitude: 4.5709, longitude: -74.2973,})} >
						Añadir localización
					</button>
				) : (
					<div style={{ marginBottom: "1rem" }}>
						<Localitation value={localitation} onChange={setLocalitation} />
						<button type="button" className="remove-localitation-button" onClick={() => setLocalitation(undefined)} style={{ marginTop: "0.5rem", backgroundColor: "#f44336", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "4px", }} >
							Quitar localización
						</button>
					</div>
				)}

				<button className="create-company__submit" type="submit" disabled={uploading}>
					{uploading ? "Guardando..." : "Guardar Empresa"}
				</button>
			</form>
		</div>
	);
};