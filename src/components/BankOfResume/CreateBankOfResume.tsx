import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { BankOfResumeCreateRequest } from "../../dtos/requests";
import { createBankOfResume, getAllTopics, uploadDocumentFile, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, DocumentInputSelector, ImageInputSelector } from "../../components";
import "./CreateBankOfResume.css";

interface CreateBankOfResumeProps {
    onClose: () => void;
}

export const CreateBankOfResume: React.FC<CreateBankOfResumeProps> = ({ onClose }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
    const [uploaderKey, setUploaderKey] = useState<number>(Date.now());
    const [photoError, setPhotoError] = useState<boolean>(false);
    const [summaryError, setSummaryError] = useState<boolean>(false);
    const [documentError, setDocumentError] = useState<boolean>(false);
    const [subtopicError, setSubtopicError] = useState<boolean>(false);

    const [bankOfResume, setBankOfResume] = useState<BankOfResumeCreateRequest>({
        photo: "",
        title: "",
        summary: "",
        link: "",
        subtopic_ids: [] as number[],
    });

    useEffect(() => {
        getAllTopics(setTopics);
    }, []);

    const allSubtopics = topics.flatMap(topic => topic.subtopics);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setPhotoError(false);
        setSummaryError(false);
        setSubtopicError(false);
        setSubtopicError(false);
        
        if (!bankOfResume.photo && !selectedImageFile) {
            setPhotoError(true);
            setUploading(false);
            return;
        }

        if (!bankOfResume.summary || bankOfResume.summary.trim() === "" || bankOfResume.summary === "<p></p>") {
            setSummaryError(true);
            setUploading(false);
            return;
        }
        
        if (!bankOfResume.link && !selectedDocumentFile) {
            setDocumentError(true);
            setUploading(false);
            return;
        }

        if (bankOfResume.subtopic_ids.length === 0) {
            setUploading(false);
            setSubtopicError(true);
            return;
        }
        try {
            let imagePath = bankOfResume.photo;

            if (selectedImageFile) {
                try {
                    imagePath = await uploadImageFile(selectedImageFile, "bank of resume");
                } catch (uploadError) {
                    console.error("Error al subir foto:", uploadError);
                    alert("No se pudo subir la foto. Por favor, inténtalo de nuevo.");
                    setUploading(false);
                    return;
                }
            }

            let documentPath = bankOfResume.link;

            if (selectedDocumentFile) {
                try {
                    documentPath = await uploadDocumentFile(selectedDocumentFile, "bank of resume");
                } catch (uploadError) {
                    console.error("Error al subir hoja de vida:", uploadError);
                    alert("No se pudo subir la hoja de vida. Por favor, inténtalo de nuevo.");
                    setUploading(false);
                    return;
                }
            }

            const bankOfResumeToSend: BankOfResumeCreateRequest = {
                ...bankOfResume,
                photo: imagePath,
                link: documentPath,
            };

            await createBankOfResume(bankOfResumeToSend);

            setSelectedTopic(null);
            setUploading(false);
            setSelectedImageFile(null);
            setSelectedDocumentFile(null);
            setUploaderKey(Date.now());

            setBankOfResume({
                photo: "",
                title: "",
                summary: "",
                link: "",
                subtopic_ids: [],
            });
        } catch (error) {
            console.error("Error al guardar hoja de vida:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="create-bank-of-resume">
            <ButtonClose onClick={onClose} />
            <h2 className="create-bank-of-resume__title">Crear Hoja de vida</h2>
            <form className="create-bank-of-resume__form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Foto*</label>
                    {photoError && (
                        <span className="form-error">La foto es obligatoria.</span>
                    )}
                    <ImageInputSelector value={bankOfResume.photo} onChange={(img) => setBankOfResume({ ...bankOfResume, photo: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la foto" fileLabel="🖼️ Subir foto" imageUploaderKey={uploaderKey} />
                </div>
                <div className="form-group">
                    <label>Título*</label>
                    <input type="text" name="title" placeholder="Título" value={bankOfResume.title} onChange={(e) => setBankOfResume({ ...bankOfResume, title: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Resumen*</label>
                    {summaryError && (
                        <span className="form-error">El resumen es obligatorio.</span>
                    )}
                    <JoditEditor value={bankOfResume.summary} onChange={(content) => setBankOfResume({ ...bankOfResume, summary: content })} className="jodit-container" />
                </div>
                <div className="form-group">
                    <label>Hoja de vida*</label>
                    {documentError && (
                        <span className="form-error">El documento de la hoja de vida es obligatoria.</span>
                    )}
                    <DocumentInputSelector value={bankOfResume.link} onChange={(document) => setBankOfResume({ ...bankOfResume, link: document })} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la hoja de vida" fileLabel="📄 Subir la hoja de vida" documentUploaderKey={uploaderKey} />
                </div>
                { subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}

                <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
                <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={bankOfResume} setData={setBankOfResume} subtopicsKey="subtopic_ids" />
                <SelectedSubtopics data={bankOfResume} setData={setBankOfResume} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

                <button className="create-bank-of-resume__submit" type="submit">
                    {uploading ? "Guardando..." : "Guardar Hoja de Vida"}
                </button>
            </form>
        </div>
    );
};
