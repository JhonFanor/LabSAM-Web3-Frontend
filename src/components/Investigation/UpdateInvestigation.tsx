import React, { useState, useEffect } from "react";
import { InvestigationGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { InvestigationUpdateRequest } from "../../dtos/requests/Investigation";
import { getAllTopics, getInvestigationById, updateInvestigation, uploadDocumentFile, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector, ImageInputSelector } from "../../components";
import "./UpdateInvestigation.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateInvestigationSubtopic, DeleteInvestigationSubtopic } from "../../api/InvestigationSubtopicApi";

interface UpdateInvestigationProps {
	onClose: () => void;
    investigationGetResponse: InvestigationGetResponse;
	onUpdated?: (updated: InvestigationGetResponse) => void;
}

export const UpdateInvestigation: React.FC<UpdateInvestigationProps> = ({ onClose, investigationGetResponse, onUpdated }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
	const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
	const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());
    const [resetKey, setResetKey] = useState<number>(Date.now());
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [documentError, setDocumentError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);	

	const [investigation, setInvestigation] = useState<InvestigationUpdateRequest>({
		title: investigationGetResponse.title,
		author: investigationGetResponse.author,
		description: investigationGetResponse.description,
		logo: investigationGetResponse.logo,
		date: investigationGetResponse.date ? new Date(investigationGetResponse.date).toISOString().split("T")[0] : "",
		link: investigationGetResponse.link,
	});

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: investigationGetResponse.subtopics.map((s) => s.id),
    });

    const originalSubtopicIds = investigationGetResponse.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap((topic) => topic.subtopics);

	useEffect(() => {
		getAllTopics(setTopics);
	}, []);

    const handleReset = () => {
        setInvestigation({
            title: investigationGetResponse.title,
            author: investigationGetResponse.author,
            description: investigationGetResponse.description,
            logo: investigationGetResponse.logo,
            date: investigationGetResponse.date ? new Date(investigationGetResponse.date).toISOString().split("T")[0] : "",
            link: investigationGetResponse.link,
        });
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedTopic(null);
        setSelectedImageFile(null);
        setSelectedDocumentFile(null);
        setImageUploaderKey(Date.now());
        setDocumentUploaderKey(Date.now());
        setResetKey(Date.now());
        setDescriptionError(false);
        setDocumentError(false);
        setSubtopicError(false);
    };
		
	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);
		setDescriptionError(false);
        setDocumentError(false);
        setSubtopicError(false);

		if (!investigation.description || investigation.description.trim() === "" || investigation.description === "<p></p>") {
            setDescriptionError(true);
            setUploading(false);
            return;
        }
        
        if (!investigation.link && !selectedDocumentFile) {
            setDocumentError(true);
            setUploading(false);
            return;
        }

        if (subtopicIds.subtopic_ids.length === 0) {
            setUploading(false);
            setSubtopicError(true);
            return;
        }

		try {
			let imagePath = investigation.logo;
						
			if (selectedImageFile) {
				try {
					imagePath = await uploadImageFile(selectedImageFile, "investigation");
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir imagen:" + uploadError);
					return;
				}
			}

			let documentPath = investigation.link;
			if (selectedDocumentFile) {
				try {
					documentPath = await uploadDocumentFile(selectedDocumentFile, "investigation")
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir documento:" + uploadError);
					return;
				}
			}

			const update: InvestigationUpdateRequest = {
				...investigation,
				logo: imagePath,
				link: documentPath,
				date: investigation && investigation.date ? new Date(investigation.date).toISOString() : "",
			};

            const hasChanged =
                investigationGetResponse.title !== update.title ||
                investigationGetResponse.author !== update.author ||
                investigationGetResponse.description !== update.description ||
                investigationGetResponse.logo !== update.logo ||
                investigationGetResponse.date !== update.date ||
                investigationGetResponse.link !== update.link;

            const currentSet = new Set(subtopicIds.subtopic_ids);
            const originalSet = new Set(originalSubtopicIds);

            const added = subtopicIds.subtopic_ids.filter(id => !originalSet.has(id));
            const removed = originalSubtopicIds.filter(id => !currentSet.has(id));

            if (added.length > 0) {
                await CreateInvestigationSubtopic(investigationGetResponse.id, { subtopic_ids: added });
            }

            if (removed.length > 0) {
                await DeleteInvestigationSubtopic(investigationGetResponse.id, { subtopic_ids: removed });
            }

            const subtopicsChanged = added.length > 0 || removed.length > 0;

            if (hasChanged || subtopicsChanged) {
                await updateInvestigation(investigationGetResponse.id, update);
				const refreshedInvestigation = await getInvestigationById(investigationGetResponse.id);
				if (onUpdated) {
					onUpdated(refreshedInvestigation);
				}
            }

            setSuccessMessage("Investigación actualizada con éxito.");
		} catch(error){
			setSuccessMessage("Error al actualizar la investigación: " + error);
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
		<div className="update-investigation">
			<ButtonClose onClick={onClose}/>
			<h2 className="update-investigation__title">Actualizar Investigación</h2>
			{successMessage && (
                <div className="success-message">
                	{successMessage}
                </div>
            )}
			<form className="update-investigation__form" onSubmit={handleUpdate}>
				<div className="form-group">
					<label>Título*</label>
					<input 
						type="text" 
						name="title" 
						placeholder="Título" 
						value={investigation.title} 
						onChange={(e) => setInvestigation({ ...investigation, title: e.target.value })} 
						required 
					/>
				</div>
				<div className="form-group">
					<label>Autor*</label>
					<input 
						type="text" 
						name="author" 
						placeholder="Autor" 
						value={investigation.author} 
						onChange={(e) => setInvestigation({ ...investigation, author: e.target.value })} 
						required 
					/>
				</div>
				<div className="form-group">
					<label>Logo</label>
					<ImageInputSelector 
						value={investigation.logo || ""} 
						onChange={(img) => setInvestigation({ ...investigation, logo: img })} 
						onFileSelected={setSelectedImageFile} 
						urlLabel="📎 URL de la imagen" 
						fileLabel="🖼️ Subir la imagen" 
						imageUploaderKey={imageUploaderKey}
						resetKey={resetKey}
					/>
				</div>
				<div className="form-group">
					<label>Descripción*</label>
					{descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
					<JoditEditor 
						value={investigation.description} 
						onChange={(content) => setInvestigation({ ...investigation, description: content })} 
						className="jodit-container"
					/>
				</div>
				<div className="form-group">	
					<label>Fecha*</label>
					<input 
						type="date" 
						name="date" 
						placeholder="Fecha" 
						value={investigation.date} 
						onChange={(e) => setInvestigation({ ...investigation, date: e.target.value })} 
						required 
					/>
				</div>
				<div className="form-group">
					<label>Documento de investigación*</label>			
					{documentError && (
                        <span className="form-error">El documento de la investigación es obligatorio.</span>
                    )}	
					<DocumentInputSelector 
						value={investigation.link || ""} 
						onChange={(document) => setInvestigation({...investigation, link: document})} 
						onFileSelected={setSelectedDocumentFile} 
						urlLabel="📎 URL de la investigación" 
						fileLabel="📄 Subir la investigación" 
						documentUploaderKey={documentUploaderKey} 
						resetKey={resetKey}
					/>
				</div>
				{subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
				
				<div className="update-investigation__buttons">
                    <button type="submit" disabled={uploading}>
                        {uploading ? "Actualizando..." : "Actualizar Investigación"}
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
			</form>
		</div>
	);
};