import React, { useState, useEffect } from "react";
import { LegislationGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { LegislationUpdateRequest } from "../../dtos/requests";
import { getAllTopics, getLegislationById, updateLegislation, uploadDocumentFile, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector, ImageInputSelector } from "../../components";
import "./UpdateLegislation.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateLegislationSubtopic, DeleteLegislationSubtopic } from "../../api/LegislationSubtopicApi";
import { TypeOfLawResponse } from "../../dtos/responses/TypeOfLaw";
import { getAllTypeOfLaw } from "../../api/TypeOfLaw";
import { formatDateYYYYMMDD } from "../../utils/Date";

interface UpdateLegislationProps {
	onClose: () => void;
    legislationGetResponse: LegislationGetResponse;
	onUpdated?: (updated: LegislationGetResponse) => void;
}

export const UpdateLegislation: React.FC<UpdateLegislationProps> = ({ onClose, legislationGetResponse, onUpdated }) => {
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
	const [typesOfLaw, setTypesOfLaw] = useState<TypeOfLawResponse[]>([]);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);	

	const [legislation, setLegislation] = useState<LegislationUpdateRequest>({
		title: legislationGetResponse.title,
		description: legislationGetResponse.description,
		logo: legislationGetResponse.logo,
		date: legislationGetResponse.date,
		link: legislationGetResponse.link,
		type_of_law_id: legislationGetResponse.type_of_law.id
	});

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: legislationGetResponse.subtopics.map((s) => s.id),
    });

    const originalSubtopicIds = legislationGetResponse.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap((topic) => topic.subtopics);
	
    useEffect(() => {
		getAllTopics(setTopics);
	}, []);
	
    const handleReset = () => {
		setLegislation({
			title: legislationGetResponse.title,
			description: legislationGetResponse.description,
			logo: legislationGetResponse.logo,
			date: legislationGetResponse.date,
			link: legislationGetResponse.link,
			type_of_law_id: legislationGetResponse.type_of_law.id
		});
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
		setSelectedImageFile(null);
        setSelectedDocumentFile(null);
        setSelectedTopic(null);
		setImageUploaderKey(Date.now())
        setDocumentUploaderKey(Date.now());
        setResetKey(Date.now());
    };
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);

		if (!legislation.description || legislation.description.trim() === "" || legislation.description === "<p></p>") {
            setDescriptionError(true);
            setUploading(false);
            return;
        }
        
        if (!legislation.link && !selectedDocumentFile) {
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

			let imagePath = legislation.logo;
			
			if (selectedImageFile) {
				imagePath = await uploadImageFile(selectedImageFile, "legislation");
			}
			let documentPath = legislation.link;

			if (selectedDocumentFile) {
				documentPath = await uploadDocumentFile(selectedDocumentFile, "investigation")
			}

			const update: LegislationUpdateRequest = {
				...legislation,
				link: documentPath,
				logo: imagePath,
				date: legislation.date ? new Date(legislation.date).toISOString() : "",
			}

            const hasChanged =
                update.title !== legislationGetResponse.title ||
                update.description !== legislationGetResponse.description ||
				update.logo !== legislationGetResponse.logo ||
				update.date !== legislationGetResponse.date ||
                update.link !== legislationGetResponse.link ||
				update.type_of_law_id !== legislationGetResponse.type_of_law.id;

            const currentSet = new Set(subtopicIds.subtopic_ids);
            const originalSet = new Set(originalSubtopicIds);

            const added = subtopicIds.subtopic_ids.filter(id => !originalSet.has(id));
            const removed = originalSubtopicIds.filter(id => !currentSet.has(id));

            if (added.length > 0) {
                await CreateLegislationSubtopic(legislationGetResponse.id, { subtopic_ids: added });
            }

            if (removed.length > 0) {
                await DeleteLegislationSubtopic(legislationGetResponse.id, { subtopic_ids: removed });
            }

            const subtopicsChanged = added.length > 0 || removed.length > 0;

            if (hasChanged || subtopicsChanged) {
                await updateLegislation(legislationGetResponse.id, update);
				const refreshedLegislation = await getLegislationById(legislationGetResponse.id);
				if (onUpdated) {
					onUpdated(refreshedLegislation);
					legislationGetResponse = refreshedLegislation;	
				}
            }

			setSuccessMessage("Legislación actualizada con éxito.");
		} catch (error) {
			setSuccessMessage("Error al actualizar la legislación.");
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

	useEffect(() => {
		const fetchTypes = async () => {
			try {
				const data = await getAllTypeOfLaw();
				setTypesOfLaw(data);
			} catch (error) {
				console.error("Error al obtener tipos de leyes:", error);
			}
		};
		fetchTypes();
	}, []);

	return (
		<div className="update-legislation">
			<ButtonClose onClick={onClose}/>
			<h2 className="update-legislation__title">Crear Legislación</h2>
			{successMessage && (
                <div className="success-message">
                	{successMessage}
                </div>
            )}
			<form className="update-legislation__form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Título*</label>
					<input type="text" name="title" placeholder="Título" value={legislation.title} onChange={(e) => setLegislation({ ...legislation, title: e.target.value })} required />
				</div>
				<div className="form-group">	
					<label>Imagen</label>	
					<ImageInputSelector value={legislation.logo || ""} onChange={(img) => setLegislation({ ...legislation, logo: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" imageUploaderKey={imageUploaderKey} />
				</div>
				<div className="form-group">	
					<label>Descripción*</label>
					{descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
					<JoditEditor value={legislation.description} onChange={(content) => setLegislation({ ...legislation, description: content })} className="jodit-container"/>
				</div>	
				<div className="form-group">	
					<label>Documento de la legislación*</label>	
					{documentError && (
                        <span className="form-error">El documento de la legislación es obligatoria.</span>
                    )}
					<DocumentInputSelector value={legislation.link || ""} onChange={(document) => setLegislation({...legislation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la legislación" fileLabel="📄 Subir la legislación" documentUploaderKey={documentUploaderKey} resetKey={resetKey}/>
				</div>
				<div className="form-group">
					<label>Fecha*</label>
					<input type="date" name="date"  value={formatDateYYYYMMDD(legislation.date || "")} onChange={(e) => setLegislation({ ...legislation, date: e.target.value })} required/>
				</div>
				<div className="form-group">
					<label>Tipo de Ley*</label>
					<select
						value={legislation.type_of_law_id === 0 ? "" : legislation.type_of_law_id}
						onChange={(e) =>
							setLegislation({ ...legislation, type_of_law_id: Number(e.target.value) })
						}
						required
					>
						<option value="" disabled>Selecciona un tipo de ley</option>
						{typesOfLaw.map((type) => (
							<option key={type.id} value={type.id}>
								{type.name}
							</option>
						))}
					</select>
				</div>
				{ subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
				
                <div className="update-legislation__buttons">
                    <button type="submit">
                        {uploading ? "Actualizando..." : "Actualizar Legislación"}
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
			</form>
		</div>
	);
};