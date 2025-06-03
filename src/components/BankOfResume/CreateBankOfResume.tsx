import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { createBankOfResume } from "../../api/BankOfResumeApi.ts";
import { GetAllTopics } from "../../api/TopicApi";
import { FaTimes } from "react-icons/fa";
import TopicSelector from "../Topic/TopicSelector";
import SubtopicSelector from "../Subtopic/SubtopicSelector";
import SelectedSubtopics from "../Subtopic/SelectedSubtopics";
import "./CreateBankOfResume.css";
import { Topic } from "../../models/Topic.ts";
import { BankOfResumeCreateRequest } from "../../dtos/requests/BankOfResume";
import ImageInputSelector from "../Selector/ImageInputSelector.tsx";
import { uploadDocumentFile, uploadImageFile } from "../../api/Upload.ts";
import DocumentInputSelector from "../Selector/DocumentInputSelector.tsx";

interface CreateBankOfResumeProps {
  onClose: () => void;
}

export const CreateBankOfResume: React.FC<CreateBankOfResumeProps> = ({ onClose }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);

  const [bankOfResume, setBankOfResume] = useState<BankOfResumeCreateRequest>({
    photo: "",
    title: "",
    summary: "",
    link: "",
    subtopic_ids: [] as number[],
  });

  useEffect(() => {
    GetAllTopics(setTopics);
  }, []);

  const allSubtopics = topics.flatMap(topic => topic.subtopics); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true)

    try{

      let imagePath = bankOfResume.photo;

      if (selectedImageFile){
        try {
          imagePath = await uploadImageFile(selectedImageFile, "bank of resume");
        } catch (uploadError) {
          setUploading(false);
          console.error("Error al subir foto:", uploadError);
          alert("No se pudo subir la foto. Por favor, inténtalo de nuevo.");
          return;
        }
      }

      let documentPath = bankOfResume.link

      if (selectedDocumentFile){
        try {
          documentPath = await uploadDocumentFile(selectedDocumentFile, "bank of resume");
        } catch (uploadError) {
          setUploading(false);
          console.error("Error al subir foto:", uploadError);
          alert("No se pudo subir la foto. Por favor, inténtalo de nuevo.");
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

      setBankOfResume({
        photo: "",
        title: "",
        summary: "",
        link: "",
        subtopic_ids: [],
      });
    } catch(error){
      console.error("Error al guardar hoja de vida:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="create-bank-of-resume__content">
      <button className="create-bank-of-resume__close-button" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="create-bank-of-resume__title">Crear Hoja de vida</h2>
      <form className="create-bank-of-resume__form" onSubmit={handleSubmit}>

        <ImageInputSelector value={bankOfResume.photo} onChange={(img) => setBankOfResume({ ...bankOfResume, photo: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la foto" fileLabel="🖼️ Subir foto" />

        <input type="text" name="title" placeholder="Título" value={bankOfResume.title} onChange={(e) => setBankOfResume({ ...bankOfResume, title: e.target.value })} required />
        
        <JoditEditor value={bankOfResume.summary} onChange={(content) => setBankOfResume({ ...bankOfResume, summary: content })} className="jodit-container"/>
                
        <DocumentInputSelector value={bankOfResume.link} onChange={(document) => setBankOfResume({...bankOfResume, link: document})} onFileSelected={setSelectedDocumentFile} urlLabel="📎 URL de la hoja de vida" fileLabel="📄 Subir la hoja de vida" />

        <TopicSelector topics={topics}  selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
        <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={bankOfResume} setData={setBankOfResume} subtopicsKey="subtopic_ids" />
        <SelectedSubtopics data={bankOfResume} setData={setBankOfResume} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />
        
        <button className="create-bank-of-resume__submit" type="submit">
          {uploading ? "Guardando..." : "Guardar Hoja de Vida" }  
        </button>
      </form>
    </div>
  );
};
