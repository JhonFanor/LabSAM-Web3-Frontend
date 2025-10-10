import React, { useState, useEffect } from "react";
import { getAllTopics, updateCompany, CreateCompanySubtopic, DeleteCompanySubtopic, getCompanyById, uploadImageFile } from "../../api";
import { CompanyGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import { CompanyUpdateRequest } from "../../dtos/requests";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, Localitation, ImageInputSelector } from "..";
import "./UpdateCompany.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";

interface UpdateCompanyProps {
    onClose: () => void;
    companyGetResponse: CompanyGetResponse;
    onUpdated?: (updated: CompanyGetResponse) => void; 
}

export const UpdateCompany: React.FC<UpdateCompanyProps> = ({ onClose, companyGetResponse, onUpdated }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
    const [resetKey, setResetKey] = useState<number>(Date.now());
    const [subtopicError, setSubtopicError] = useState<boolean>(false);
    const [projectInput, setProjectInput] = useState<string>("");
    const [projectsList, setProjectsList] = useState<string[]>([]);
   
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const [company, setCompany] = useState<CompanyUpdateRequest>({
        name: companyGetResponse.name,
        logo: companyGetResponse.logo ?? "",
        industry: companyGetResponse.industry,
        website: companyGetResponse.website,
        email: companyGetResponse.email,
        projects: companyGetResponse.projects,
        localitation: companyGetResponse.localitation
        ? {
            address: companyGetResponse.localitation.address,
            latitude: companyGetResponse.localitation.latitude ?? 0,
            longitude: companyGetResponse.localitation.longitude ?? 0,
        }
        : null,
    });

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: companyGetResponse.subtopics.map((s) => s.id),
    });

    const [localitation, setLocalitation] = useState<{
        address: string;
        latitude: number;
        longitude: number;
    } | undefined>(
    companyGetResponse.localitation
        ? {
            address: companyGetResponse.localitation.address,
            latitude: companyGetResponse.localitation.latitude ?? 0,
            longitude: companyGetResponse.localitation.longitude ?? 0,
        }
        : undefined
    );


    const originalSubtopicIds = companyGetResponse.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap(topic => topic.subtopics);

    useEffect(() => {
        getAllTopics(setTopics);
        
        // Inicializar lista de proyectos desde el string
        if (companyGetResponse.projects) {
            const projectsArray = companyGetResponse.projects.split(';').filter(project => project.trim() !== '');
            setProjectsList(projectsArray);
        }
    }, [companyGetResponse]);

    // Función para agregar un proyecto a la lista
    const handleAddProject = () => {
        if (projectInput.trim() === "") return;
        
        const newProjects = [...projectsList, projectInput.trim()];
        setProjectsList(newProjects);
        setProjectInput("");
        
        // Actualizar el campo projects en el estado company
        setCompany({
            ...company,
            projects: newProjects.join(";")
        });
    };

    // Función para eliminar un proyecto de la lista
    const handleRemoveProject = (index: number) => {
        const newProjects = projectsList.filter((_, i) => i !== index);
        setProjectsList(newProjects);
        
        // Actualizar el campo projects en el estado company
        setCompany({
            ...company,
            projects: newProjects.join(";")
        });
    };

    // Función para manejar la tecla Enter en el input de proyectos
    const handleProjectKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddProject();
        }
    };

    const handleReset = () => {
        setCompany({
            name: companyGetResponse.name,
            logo: companyGetResponse.logo ?? "",
            industry: companyGetResponse.industry,
            website: companyGetResponse.website,
            email: companyGetResponse.email,
            projects: companyGetResponse.projects,
            localitation: companyGetResponse.localitation
            ? {
                address: companyGetResponse.localitation.address,
                latitude: companyGetResponse.localitation.latitude ?? 0,
                longitude: companyGetResponse.localitation.longitude ?? 0,
            }
            : null,
        });
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedImageFile(null);
        setSelectedTopic(null);
        setImageUploaderKey(Date.now());
        setResetKey(Date.now());
        setSubtopicError(false);
        setProjectInput("");
        
        // Resetear lista de proyectos
        if (companyGetResponse.projects) {
            const projectsArray = companyGetResponse.projects.split(';').filter(project => project.trim() !== '');
            setProjectsList(projectsArray);
        } else {
            setProjectsList([]);
        }
        
       setLocalitation(
        companyGetResponse.localitation
            ? {
                address: companyGetResponse.localitation.address,
                latitude: companyGetResponse.localitation.latitude ?? 0,
                longitude: companyGetResponse.localitation.longitude ?? 0,
            }
            : undefined
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setSubtopicError(false);

        if (subtopicIds.subtopic_ids.length === 0) {
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

            const updatedCompany: CompanyUpdateRequest = {
                ...company,
                logo: imagePath,
                ...(localitation && { localitation }),
            };

            const hasCompanyChanged = 
                updatedCompany.name !== companyGetResponse.name ||
                updatedCompany.logo !== companyGetResponse.logo ||
                updatedCompany.industry !== companyGetResponse.industry ||
                updatedCompany.website !== companyGetResponse.website ||
                updatedCompany.email !== companyGetResponse.email ||
                updatedCompany.projects !== companyGetResponse.projects ||
                JSON.stringify(updatedCompany.localitation) !== JSON.stringify(companyGetResponse.localitation);

            const currentSet = new Set(subtopicIds.subtopic_ids);
            const originalSet = new Set(originalSubtopicIds);

            const added = subtopicIds.subtopic_ids.filter(id => !originalSet.has(id));
            const removed = originalSubtopicIds.filter(id => !currentSet.has(id));

            if (added.length > 0) {
                await CreateCompanySubtopic(companyGetResponse.id, { subtopic_ids: added });
            }

            if (removed.length > 0) {
                await DeleteCompanySubtopic(companyGetResponse.id, { subtopic_ids: removed });
            }

            const subtopicsChanged = added.length > 0 || removed.length > 0;

            if (hasCompanyChanged || subtopicsChanged) {
                await updateCompany(companyGetResponse.id, updatedCompany);
                const refreshedCompany = await getCompanyById(companyGetResponse.id);
                if (onUpdated) {
                    onUpdated(refreshedCompany);
                }
            }

            setSuccessMessage("Empresa actualizada con éxito.");
        } catch (error) {
            setSuccessMessage("Error al actualizar la empresa: " + error);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timeout = setTimeout(() => setSuccessMessage(null), 10000); 
            return () => clearTimeout(timeout);
        }
    }, [successMessage]);

    return (
        <div className="update-company">
            <ButtonClose onClick={onClose}/>
            <h2 className="update-company__title">Actualizar Empresa</h2>
            {successMessage && (
                <div className="success-message">
                	{successMessage}
                </div>
            )}
            <form className="update-company__form" onSubmit={handleSubmit}>
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
                        value={company.logo || ""} 
                        onChange={(img) => setCompany({ ...company, logo: img })} 
                        onFileSelected={setSelectedImageFile} 
                        urlLabel="📎 URL de la imagen" 
                        fileLabel="🖼️ Subir la imagen" 
                        imageUploaderKey={imageUploaderKey}
                        resetKey={resetKey}
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
					<label>Email*</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Correo electrónico" 
                        value={company.email} 
                        onChange={(e) => setCompany({ ...company, email: e.target.value })} 
                        required 
                    />
                </div>

                {/* Sección de Proyectos */}
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

                {subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
                
                <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
                <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" />
                <SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

                {!localitation ? (
                    <button type="button" className="update-company__localitation" onClick={() => setLocalitation({ address: "", latitude: 4.5709, longitude: -74.2973,})} >
                        Añadir localización
                    </button>
                ) : (
                    <div style={{ marginBottom: "1rem" }}>
                        <Localitation value={localitation} onChange={setLocalitation} />
                        <button type="button" className="remove-localitation-button" onClick={() => setLocalitation(undefined)}>
                            Quitar localización
                        </button>
                    </div>
                )}

                <div className="update-company__buttons">
                    <button type="submit" disabled={uploading}>
                        {uploading ? "Actualizando..." : "Actualizar Empresa"}
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
            </form>
        </div>
    );
};