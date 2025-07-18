import React, { useState, useEffect } from "react";
import { InvestigationGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { InvestigationUpdateRequest } from "../../dtos/requests/Investigation";
import { getAllTopics, updateInvestigation, uploadDocumentFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector } from "../../components";
import "./UpdateInvestigation.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateInvestigationSubtopic, DeleteInvestigationSubtopic } from "../../api/InvestigationSubtopicApi";

interface UpdateInvestigationProps {
	onClose: () => void;
    investigationGetResponse: InvestigationGetResponse;
}

export const UpdateInvestigation: React.FC<UpdateInvestigationProps> = ({ onClose, investigationGetResponse }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
	const [documentUploaderKey, setDocumentUploaderKey] = useState<number>(Date.now());
    const [resetKey, setResetKey] = useState<number>(Date.now());

	const [investigation, setInvestigation] = useState<InvestigationUpdateRequest>({
		title: investigationGetResponse.title,
		description: investigationGetResponse.description,
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
            description: investigationGetResponse.description,
            date: investigationGetResponse.date ? new Date(investigationGetResponse.date).toISOString().split("T")[0] : "",
            link: investigationGetResponse.link,
        });
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedTopic(null);
        setSelectedDocumentFile(null);
        setDocumentUploaderKey(Date.now());
        setResetKey(Date.now());
    };
		
	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);

		try {
			let documentPath = investigation.link;
			if (selectedDocumentFile) {
				documentPath = await uploadDocumentFile(selectedDocumentFile, "investigation")

			}

			const update: InvestigationUpdateRequest = {
				...investigation,
				link: documentPath,
				date: investigation && investigation.date ? new Date(investigation.date).toISOString() : "",
			};

            const hasChanged =
                investigationGetResponse.title !== update.title ||
                investigationGetResponse.description !== update.description ||
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
            }

            onClose();
		} catch(error){
			console.error("Error al actualizar la investigación:", error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="update-investigation">
			<ButtonClose onClick={onClose}/>
			<h2 className="update-investigation__title">Crear Investigación</h2>
			<form className="update-investigation__form" onSubmit={handleUpdate}>
				<input type="text" name="title" placeholder="Título" value={investigation.title} onChange={(e) => setInvestigation({ ...investigation, title: e.target.value })} required />
				
				<JoditEditor value={investigation.description} onChange={(content) => setInvestigation({ ...investigation, description: content })} className="jodit-container"/>
				
				<input type="date" name="date" placeholder="Fecha" value={investigation.date} onChange={(e) => setInvestigation({ ...investigation, date: e.target.value })} required />
				
				<DocumentInputSelector value={investigation.link || ""} onChange={(document) => setInvestigation({...investigation, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la investigación" fileLabel="📄 Subir la investigación" documentUploaderKey={documentUploaderKey} resetKey={resetKey}/>

				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
				
				<div className="update-investigation__buttons">
                    <button type="submit">
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
