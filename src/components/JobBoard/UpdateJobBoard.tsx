import React, { useState, useEffect } from "react";
import { JobBoardGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { JobBoardUpdateRequest } from "../../dtos/requests";
import { getAllTopics, getJobBoardById, updateJobBoard } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics } from "../../components";
import "./UpdateJobBoard.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateJobBoardSubtopic, DeleteJobBoardSubtopic } from "../../api/JobBoardSubtopicApi";

interface UpdateJobBoardProps {
    onClose: () => void;
    jobBoardGetResponse: JobBoardGetResponse;
    onUpdated?: (updated: JobBoardGetResponse) => void;
}

export const UpdateJobBoard: React.FC<UpdateJobBoardProps> = ({ onClose, jobBoardGetResponse, onUpdated }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [uploading] = useState(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);  

    const [jobBoard, setJobBoard] = useState<JobBoardUpdateRequest>({
        title: jobBoardGetResponse.title,
        company: jobBoardGetResponse.company,
        description: jobBoardGetResponse.description,
        type: jobBoardGetResponse.type,
        salary_range: jobBoardGetResponse.salary_range,
        link: jobBoardGetResponse.link,
    });

    const [salaryType, setSalaryType] = useState<"none" | "fixed" | "range">("none");
    const [salaryFixed, setSalaryFixed] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [salaryError, setSalaryError] = useState("");

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: jobBoardGetResponse.subtopics.map((s) => s.id),
    });

    const originalSubtopicIds = jobBoardGetResponse.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap((topic) => topic.subtopics);

    useEffect(() => {
        getAllTopics(setTopics);

        const salary = jobBoardGetResponse.salary_range?.trim();

        if (!salary) {
            setSalaryType("none");
        } else if (salary.includes(" - ")) {
            const [min, max] = salary.split(" - ").map((s) => s.trim());
            setSalaryType("range");
            setSalaryMin(min);
            setSalaryMax(max);
        } else {
            setSalaryType("fixed");
            setSalaryFixed(salary);
        }
    }, []);

    const handleReset = () => {
        setJobBoard({
            title: jobBoardGetResponse.title,
            company: jobBoardGetResponse.company,
            description: jobBoardGetResponse.description,
            type: jobBoardGetResponse.type,
            salary_range: jobBoardGetResponse.salary_range,
            link: jobBoardGetResponse.link,
        });
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedTopic(null);
        setSalaryError("");

        const salary = jobBoardGetResponse.salary_range?.trim();

        if (!salary) {
            setSalaryType("none");
            setSalaryFixed("");
            setSalaryMin("");
            setSalaryMax("");
        } else if (salary.includes(" - ")) {
            const [min, max] = salary.split(" - ").map((s) => s.trim());
            setSalaryType("range");
            setSalaryMin(min);
            setSalaryMax(max);
            setSalaryFixed("");
        } else {
            setSalaryType("fixed");
            setSalaryFixed(salary);
            setSalaryMin("");
            setSalaryMax("");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

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

        try {
            const update: JobBoardUpdateRequest = {
                ...jobBoard,
                salary_range:
                    salaryType === "fixed"
                        ? salaryFixed
                        : salaryType === "range"
                        ? `${salaryMin} - ${salaryMax}`
                        : "",
            };

            const hasChanged =
                update.title !== jobBoardGetResponse.title ||
                update.company !== jobBoardGetResponse.company ||
                update.description !== jobBoardGetResponse.description ||
                update.type !== jobBoardGetResponse.type ||
                update.salary_range !== jobBoardGetResponse.salary_range ||
                update.link !== jobBoardGetResponse.link;

            const currentSet = new Set(subtopicIds.subtopic_ids);
            const originalSet = new Set(originalSubtopicIds);

            const added = subtopicIds.subtopic_ids.filter(id => !originalSet.has(id));
            const removed = originalSubtopicIds.filter(id => !currentSet.has(id));

            if (added.length > 0) {
                await CreateJobBoardSubtopic(jobBoardGetResponse.id, { subtopic_ids: added });
            }

            if (removed.length > 0) {
                await DeleteJobBoardSubtopic(jobBoardGetResponse.id, { subtopic_ids: removed });
            }

            const subtopicsChanged = added.length > 0 || removed.length > 0;

            if (hasChanged || subtopicsChanged) {
                await updateJobBoard(jobBoardGetResponse.id, update);
                const refreshedJobBoard = await getJobBoardById(jobBoardGetResponse.id);
                if (onUpdated) {
                    onUpdated(refreshedJobBoard);
                    jobBoardGetResponse = refreshedJobBoard;
                }
            }

            setSuccessMessage("Oferta de trabajo actualizada con éxito");
        } catch (error) {
            setSuccessMessage("Error al actualizar la oferta de trabajo:" + error); 
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timeout = setTimeout(() => setSuccessMessage(null), 10000); 
            return () => clearTimeout(timeout);
        }
    }, [successMessage]);

    return (
        <div className="update-job-board">
            <ButtonClose onClick={onClose} />
            <h2 className="update-job-board__title">Actualizar Oferta de Trabajo</h2>
            {successMessage && (
                <div className="success-message">
                	{successMessage}
                </div>
            )}
            <form className="update-job-board__form" onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>Título</label>
                    <input type="text" name="title" placeholder="Título" value={jobBoard.title} onChange={(e) => setJobBoard({ ...jobBoard, title: e.target.value })} required />
                </div>
                <div className="form-group">  
                    <label>Compañia</label>
                    <input type="text" name="company" placeholder="Empresa" value={jobBoard.company} onChange={(e) => setJobBoard({ ...jobBoard, company: e.target.value })} required />
                </div>
                <div className="form-group">  
                    <label>Descripción</label>
                    <JoditEditor value={jobBoard.description} onChange={(content) => setJobBoard({ ...jobBoard, description: content })} className="jodit-container" />
                </div>
                <div className="form-group">
                    <label>Tipo de oferta</label>
                    <input type="text" name="type" placeholder="Tipo de oferta" value={jobBoard.type} onChange={(e) => setJobBoard({ ...jobBoard, type: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Link a la oferta</label>
                    <input type="text" name="link" placeholder="Link a la oferta de trabajo" value={jobBoard.link} onChange={(e) => setJobBoard({ ...jobBoard, link: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Tipo de salario:</label>
                    <select className="update-job-board__select" value={salaryType} onChange={(e) => { const value = e.target.value as "none" | "fixed" | "range"; setSalaryType(value); setSalaryError(""); if (value === "none") { setSalaryFixed(""); setSalaryMin(""); setSalaryMax(""); }}} >
                        <option value="none">No especificar</option>
                        <option value="fixed">Valor fijo</option>
                        <option value="range">Rango</option>
                    </select>
                    {salaryType === "fixed" && (
                        <input type="text" name="salary_fixed" placeholder="Salario fijo"value={salaryFixed} onChange={(e) => setSalaryFixed(e.target.value)} required />
                    )}
                    
                    {salaryType === "range" && (
                        <div className="salary-range-fields">
                            <input type="number" min="0" placeholder="Salario mínimo" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} required />
                            <input type="number" min="0" placeholder="Salario máximo" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} required />
                            {salaryError && <p className="error">{salaryError}</p>}
                        </div>
                    )}
                </div>
                <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
                <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" />
                <SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

                <div className="update-job-board__buttons">
                    <button type="submit">
                        {uploading ? "Actualizando..." : "Actualizar Oferta de Trabajos"}
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
            </form>
        </div>
    );
};
