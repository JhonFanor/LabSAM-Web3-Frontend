import React, { useState, useEffect } from "react";
import { getAllTopics, updateCompany, CreateCompanySubtopic, DeleteCompanySubtopic } from "../../api";
import { CompanyGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import { CompanyUpdateRequest } from "../../dtos/requests";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, Localitation } from "..";
import "./UpdateCompany.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";

interface UpdateCompanyProps {
    onClose: () => void;
    companyGetResponse: CompanyGetResponse; 
}

export const UpdateCompany: React.FC<UpdateCompanyProps> = ({ onClose, companyGetResponse }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    
    const [company, setCompany] = useState<CompanyUpdateRequest>({
        name: companyGetResponse.name,
        industry: companyGetResponse.industry,
        website: companyGetResponse.website,
        email: companyGetResponse.email,
        localitation: companyGetResponse.localitation,
    });

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: companyGetResponse.subtopics.map((s) => s.id),
    });

    const [localitation, setLocalitation] = useState<{ 
        address: string; 
        latitude: number; 
        longitude: number 
    } | undefined>(companyGetResponse.localitation ? {
        address: companyGetResponse.localitation.address,
        latitude: companyGetResponse.localitation.latitude,
        longitude: companyGetResponse.localitation.longitude
    } : undefined);

    const originalSubtopicIds = companyGetResponse.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap(topic => topic.subtopics);

    useEffect(() => {
        getAllTopics(setTopics);
    }, []);

    const handleReset = () => {
        setCompany({
            name: companyGetResponse.name,
            industry: companyGetResponse.industry,
            website: companyGetResponse.website,
            email: companyGetResponse.email,
            localitation: companyGetResponse.localitation,
        });
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedTopic(null);
        setLocalitation(companyGetResponse.localitation ? {
            address: companyGetResponse.localitation.address,
            latitude: companyGetResponse.localitation.latitude,
            longitude: companyGetResponse.localitation.longitude
        } : undefined);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const updatedCompany: CompanyUpdateRequest = {
                ...company,
                ...(localitation) && {localitation},
            };

            const hasCompanyChanged = 
                updatedCompany.name !== companyGetResponse.name ||
                updatedCompany.industry !== companyGetResponse.industry ||
                updatedCompany.website !== companyGetResponse.website ||
                updatedCompany.email !== companyGetResponse.email ||
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

            if (hasCompanyChanged ||subtopicsChanged ) {
                await updateCompany(companyGetResponse.id, updatedCompany);
            }

            onClose();
        } catch (error) {
            console.error("Error al actualizar la compañía:", error);
            alert("Hubo un error al actualizar la compañía.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="update-company">
            <ButtonClose onClick={onClose}/>
            <h2 className="update-company__title">Actualizar Empresa</h2>
            <form className="update-company__form" onSubmit={handleSubmit}>
                <div className="form-group">
					<label>Nombre de la empresa</label>
                    <input type="text" name="name" placeholder="Nombre de la empresa" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })}  required />
                </div>
                <div className="form-group">
					<label>Industria</label>
                    <input type="text" name="industry" placeholder="Industria" value={company.industry} onChange={(e) => setCompany({ ...company, industry: e.target.value })} required />
                </div>
                <div className="form-group">
					<label>Website</label>
                    <input type="text" name="website" placeholder="Sitio web" value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })}  />
                </div>
                <div className="form-group">
					<label>Email</label>
                    <input type="email" name="email" placeholder="Correo electrónico" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} required />
                </div>
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
                        <button type="button" className="remove-localitation-button" onClick={() => setLocalitation(undefined)} style={{ marginTop: "0.5rem", backgroundColor: "#f44336", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "4px", }} >
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