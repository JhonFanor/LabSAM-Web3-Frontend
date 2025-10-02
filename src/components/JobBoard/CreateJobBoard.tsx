import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { JobBoardCreateRequest } from "../../dtos/requests";
import { createJobBoard, getAllTopics } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics } from "../../components";
import "./CreateJobBoard.css";

interface CreateJobBoardProps {
    onClose: () => void;
}

export const CreateJobBoard: React.FC<CreateJobBoardProps> = ({ onClose }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [descriptionError, setDescriptionError] = useState<boolean>(false);
    const [subtopicError, setSubtopicError] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);  

    const [jobBoard, setJobBoard] = useState<JobBoardCreateRequest>({
        title: "",
        company: "",
        description: "",
        type: "",
        salary_range: "",
        link: "",
        subtopic_ids: [],
    });

    const [salaryType, setSalaryType] = useState<"none" | "fixed" | "range">("none");
    const [salaryFixed, setSalaryFixed] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [salaryError, setSalaryError] = useState("");

    useEffect(() => {
        getAllTopics(setTopics);
    }, []);

    const allSubtopics = topics.flatMap(topic => topic.subtopics);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDescriptionError(false);
        setSubtopicError(false);

        if (!jobBoard.description || jobBoard.description.trim() === "" || jobBoard.description === "<p></p>") {
            setDescriptionError(true);
            return;
        }

        if (jobBoard.subtopic_ids.length === 0) {
            setSubtopicError(true);
            return;
        }

        if (salaryType === "range") {
        const min = parseFloat(salaryMin);
        const max = parseFloat(salaryMax);

        if (isNaN(min) || isNaN(max)) {
            setSalaryError("Los valores deben ser números válidos.");
            return;
        }

        if (min > max) {
            setSalaryError("El salario mínimo no puede ser mayor que el máximo.");
            return;
        }

        setSalaryError("");
        }

        const preparedJobBoard: JobBoardCreateRequest = {
            ...jobBoard,
            salary_range:
                salaryType === "fixed"
                ? salaryFixed
                : salaryType === "range"
                ? `${salaryMin} - ${salaryMax}`
                : "",
        };

        try {
            console.log(preparedJobBoard);
            await createJobBoard(preparedJobBoard);

            setSelectedTopic(null);
            setSalaryFixed("");
            setSalaryMin("");
            setSalaryMax("");
            setSalaryType("none");
            setSalaryError("");

            setJobBoard({
                title: "",
                company: "",
                description: "",
                type: "",
                salary_range: "",
                link: "",
                subtopic_ids: [],
            });

            setSuccessMessage("Oferta de trabajo creada exitosamente.");
            return ;
        } catch (error) {
            setSuccessMessage("Error al crear oferta de trabajo:" + error);
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timeout = setTimeout(() => setSuccessMessage(null), 10000); 
            return () => clearTimeout(timeout);
        }       
    }, [successMessage]);

    return (
        <div className="create-job-board">
            <ButtonClose onClick={onClose} />
            <h2 className="create-job-board__title">Crear Oferta de Trabajo</h2>
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}
            <form className="create-job-board__form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Título*</label>
                    <input type="text" name="title" placeholder="Título" value={jobBoard.title} onChange={(e) => setJobBoard({ ...jobBoard, title: e.target.value })} required />
                </div>
                <div className="form-group">  
                    <label>Compañia*</label>
                    <input type="text" name="company" placeholder="Empresa" value={jobBoard.company} onChange={(e) => setJobBoard({ ...jobBoard, company: e.target.value })} required />
                </div>
                <div className="form-group">  
                    <label>Descripción*</label>
                    {descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
                    <JoditEditor value={jobBoard.description} onChange={(content) => setJobBoard({ ...jobBoard, description: content })} className="jodit-container" />
                </div>
                <div className="form-group">
                    <label>Tipo de oferta</label>
                    <input type="text" name="type" placeholder="Tipo de oferta" value={jobBoard.type} onChange={(e) => setJobBoard({ ...jobBoard, type: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Link a la oferta*</label>
                    <input type="text" name="link" placeholder="Link a la oferta de trabajo" value={jobBoard.link} onChange={(e) => setJobBoard({ ...jobBoard, link: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Tipo de salario:</label>
                    <select className="create-job-board__select" value={salaryType} onChange={(e) => { const value = e.target.value as "none" | "fixed" | "range"; setSalaryType(value); setSalaryError(""); if (value === "none") { setSalaryFixed(""); setSalaryMin(""); setSalaryMax(""); } }} >
                        <option value="none">No especificar</option>
                        <option value="fixed">Valor fijo</option>
                        <option value="range">Rango</option>
                    </select>

                    {salaryType === "fixed" && (
                        <input type="text" name="salary_fixed" placeholder="Salario fijo" value={salaryFixed} onChange={(e) => setSalaryFixed(e.target.value)} required />
                    )}

                    {salaryType === "range" && (
                        <div className="salary-range-fields">
                            <input type="number" min="0" placeholder="Salario mínimo" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} required />
                            <input type="number" min="0" placeholder="Salario máximo" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} required />
                            {salaryError && <p className="error">{salaryError}</p>}
                        </div>
                    )}
                </div>
                { subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
                <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
                <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={jobBoard} setData={setJobBoard} subtopicsKey="subtopic_ids" />
                <SelectedSubtopics data={jobBoard} setData={setJobBoard} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

                <button className="create-job-board__submit" type="submit">
                    Guardar Oferta
                </button>
            </form>
        </div>
    );
};
