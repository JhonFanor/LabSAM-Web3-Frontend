import React, { useState, useEffect } from "react";
import { LegislationGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { LegislationUpdateRequest } from "../../dtos/requests";
import { getAllTopics, updateLegislation, uploadDocumentFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector } from "../../components";
import "./UpdateLegislation.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateLegislationSubtopic, DeleteLegislationSubtopic } from "../../api/LegislationSubtopicApi";

interface UpdateLegislationProps {
	onClose: () => void;
    legislationGetResponse: LegislationGetResponse;
}

export const UpdateLegislation: React.FC<UpdateLegislationProps> = ({ onClose, legislationGetResponse }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
	const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());
    const [resetKey, setResetKey] = useState<number>(Date.now());

	const [legislation, setLegislation] = useState<LegislationUpdateRequest>({
		title: legislationGetResponse.title,
		description: legislationGetResponse.description,
		link: legislationGetResponse.link,
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
        setLegislation(legislationGetResponse);
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedDocumentFile(null);
        setSelectedTopic(null);
        setDocumentUploaderKey(Date.now());
        setResetKey(Date.now());
    };
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);

		try {
			let documentPath = legislation.link;

			if (selectedDocumentFile) {
				documentPath = await uploadDocumentFile(selectedDocumentFile, "investigation")
			}

			const update: LegislationUpdateRequest = {
				...legislation,
				link: documentPath,
			}

            const hasChanged =
                update.title !== legislationGetResponse.title ||
                update.description !== legislationGetResponse.description ||
                update.link !== legislationGetResponse.link;

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
            }

            onClose();
		} catch (error) {
			console.error("Error al actualizar la legislación:", error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="update-legislation">
			<ButtonClose onClick={onClose}/>
			<h2 className="update-legislation__title">Crear Legislación</h2>
			<form className="update-legislation__form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Título</label>
					<input type="text" name="title" placeholder="Título" value={legislation.title} onChange={(e) => setLegislation({ ...legislation, title: e.target.value })} required />
				</div>
				<div className="form-group">	
					<label>Descripción</label>
					<JoditEditor value={legislation.description} onChange={(content) => setLegislation({ ...legislation, description: content })} className="jodit-container"/>
				</div>	
				<div className="form-group">	
					<label>Documento de la legislación</label>	
					<DocumentInputSelector value={legislation.link || ""} onChange={(document) => setLegislation({...legislation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la legislación" fileLabel="📄 Subir la legislación" documentUploaderKey={documentUploaderKey} resetKey={resetKey}/>
				</div>
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