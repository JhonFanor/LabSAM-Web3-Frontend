import { useEffect, useState } from "react";
import { BankOfResumeUpdateRequest } from "../../dtos/requests";
import { BankOfResumeGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import { ButtonClose } from "../Button";
import { DocumentInputSelector, ImageInputSelector } from "../Selector";
import JoditEditor from "jodit-react";
import { TopicSelector } from "../Topic";
import { SelectedSubtopics, SubtopicSelector } from "../Subtopic";
import { getAllTopics, uploadImageFile, uploadDocumentFile, updateBankOfResume, CreateBankOfResumeSubtopic, DeleteBankOfResumeSubtopic } from "../../api";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import "./UpdateBankOfResume.css";

interface UpdateBankOfResumeProps {
    onClose: () => void;
    resume: BankOfResumeGetResponse;
}

export const UpdateBankOfResume: React.FC<UpdateBankOfResumeProps> = ({ onClose, resume }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploaderKey, setUploaderKey] = useState<number>(Date.now());
    const [resetKey, setResetKey] = useState<number>(Date.now());


    const [bankOfResume, setBankOfResume] = useState<BankOfResumeUpdateRequest>({
        photo: resume.photo,
        title: resume.title,
        summary: resume.summary,
        link: resume.link,
    });

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: resume.subtopics.map((s) => s.id),
    });

    const originalSubtopicIds = resume.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap((topic) => topic.subtopics);

    useEffect(() => {
        getAllTopics(setTopics);
    }, []);

    const handleReset = () => {
        setBankOfResume(resume);
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedImageFile(null);
        setSelectedDocumentFile(null);
        setSelectedTopic(null);
        setUploaderKey(Date.now());
        setResetKey(Date.now());
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let photoPath = bankOfResume.photo;
            if (selectedImageFile) {
                photoPath = await uploadImageFile(selectedImageFile, "bank of resume");
            }

            let documentPath = bankOfResume.link;
            if (selectedDocumentFile) {
                documentPath = await uploadDocumentFile(selectedDocumentFile, "bank of resume");
            }

            const updatedBank: BankOfResumeUpdateRequest = {
                ...bankOfResume,
                photo: photoPath,
                link: documentPath,
            };

            const hasChanged =
                updatedBank.photo !== resume.photo ||
                updatedBank.title !== resume.title ||
                updatedBank.summary !== resume.summary ||
                updatedBank.link !== resume.link;

            const currentSet = new Set(subtopicIds.subtopic_ids);
            const originalSet = new Set(originalSubtopicIds);

            const added = subtopicIds.subtopic_ids.filter(id => !originalSet.has(id));
            const removed = originalSubtopicIds.filter(id => !currentSet.has(id));

            if (added.length > 0) {
                await CreateBankOfResumeSubtopic(resume.id, { subtopic_ids: added });
            }

            if (removed.length > 0) {
                await DeleteBankOfResumeSubtopic(resume.id, { subtopic_ids: removed });
            }

            const subtopicsChanged = added.length > 0 || removed.length > 0;

            if (hasChanged || subtopicsChanged) {
                await updateBankOfResume(resume.id, updatedBank);
            }

            onClose();
        } catch (error) {
            console.error("Error al actualizar hoja de vida:", error);
            alert("Hubo un error al actualizar la hoja de vida.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="update-bank-of-resume">
            <ButtonClose onClick={onClose} />
            <h2 className="update-bank-of-resume__title">Actualizar Hoja de vida</h2>
            <form className="update-bank-of-resume__form" onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>Foto</label>
                    <ImageInputSelector value={bankOfResume.photo || ""} onChange={(img) => setBankOfResume({ ...bankOfResume, photo: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la foto" fileLabel="🖼️ Subir foto" imageUploaderKey={uploaderKey} resetKey={resetKey} />
                </div>
                <div className="form-group">
                    <label>Título</label>
                    <input type="text" name="title" placeholder="Título" value={bankOfResume.title} onChange={(e) => setBankOfResume({ ...bankOfResume, title: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Resumen</label>
                    <JoditEditor value={bankOfResume.summary} onChange={(content) => setBankOfResume({ ...bankOfResume, summary: content })} className="jodit-container" />
                </div>
                <div className="form-group">
                    <label>Hoja de vida</label>
                    <DocumentInputSelector value={bankOfResume.link || ""} onChange={(doc) => setBankOfResume({ ...bankOfResume, link: doc })} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la hoja de vida" fileLabel="📄 Subir la hoja de vida" documentUploaderKey={uploaderKey}  resetKey={resetKey} />
                </div>
                <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
                <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" />
                <SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

                <div className="update-bank-of-resume__buttons">
                    <button type="submit">
                        {uploading ? "Actualizando..." : "Actualizar Hoja de Vida"}
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
            </form>
        </div>
    );
};
