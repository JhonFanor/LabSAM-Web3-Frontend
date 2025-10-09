import React, { useState, useEffect } from "react";
import { JobBoardGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { JobBoardUpdateRequest } from "../../dtos/requests";
import { getAllTopics, getJobBoardById, updateJobBoard, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, ImageInputSelector } from "../../components";
import "./UpdateJobBoard.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateJobBoardSubtopic, DeleteJobBoardSubtopic } from "../../api/JobBoardSubtopicApi";
import { formatDateYYYYMMDD } from "../../utils/Date";
import { CurrencyTypeRequest } from "../../dtos/requests/CurrencyType";

interface UpdateJobBoardProps {
    onClose: () => void;
    jobBoardGetResponse: JobBoardGetResponse;
    onUpdated?: (updated: JobBoardGetResponse) => void;
}

export const UpdateJobBoard: React.FC<UpdateJobBoardProps> = ({ onClose, jobBoardGetResponse, onUpdated }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
    const [resetKey, setResetKey] = useState<number>(Date.now());
    const [descriptionError, setDescriptionError] = useState<boolean>(false);
    const [subtopicError, setSubtopicError] = useState<boolean>(false);
    const [currencies, setCurrencies] = useState<CurrencyTypeRequest[]>([]);
    const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);  

    const [jobBoard, setJobBoard] = useState<JobBoardUpdateRequest>({
        title: jobBoardGetResponse.title,
        logo: jobBoardGetResponse.logo,
        company: jobBoardGetResponse.company ?? "",
        description: jobBoardGetResponse.description,
        type: jobBoardGetResponse.type,
        salary_range: jobBoardGetResponse.salary_range,
        link: jobBoardGetResponse.link,
        start_date: jobBoardGetResponse.start_date,
        end_date: jobBoardGetResponse.end_date,
        currency_type: jobBoardGetResponse.currency_type,
    });

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: jobBoardGetResponse.subtopics.map((s) => s.id),
    });

    const [salaryType, setSalaryType] = useState<"none" | "fixed" | "range">("none");
    const [salaryFixed, setSalaryFixed] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [salaryError, setSalaryError] = useState("");
    const [currencyType, setCurrencyType] = useState("");

    const originalSubtopicIds = jobBoardGetResponse.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap((topic) => topic.subtopics);

    useEffect(() => {
        getAllTopics(setTopics);
        fetchCurrencies();

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

        // Configurar moneda existente
        if (jobBoardGetResponse.currency_type) {
            setCurrencyType(jobBoardGetResponse.currency_type.code);
        }
    }, [jobBoardGetResponse]);

    const fetchCurrencies = async () => {
        try {
            setLoadingCurrencies(true);
            const response = await fetch('https://restcountries.com/v3.1/all?fields=currencies');
            const data = await response.json();
            
            const currencySet = new Set();
            const uniqueCurrencies: CurrencyTypeRequest[] = [];

            data.forEach((country: any) => {
                if (country.currencies) {
                    Object.entries(country.currencies).forEach(([code, currencyInfo]: [string, any]) => {
                        if (!currencySet.has(code) && currencyInfo.name && currencyInfo.symbol) {
                            currencySet.add(code);
                            uniqueCurrencies.push({
                                code: code,
                                name: currencyInfo.name,
                                symbol: currencyInfo.symbol
                            });
                        }
                    });
                }
            });

            uniqueCurrencies.sort((a, b) => a.code.localeCompare(b.code));
            setCurrencies(uniqueCurrencies);
        } catch (error) {
            console.error("Error fetching currencies:", error);
            setCurrencies([
                { code: "USD", name: "United States Dollar", symbol: "$" },
                { code: "EUR", name: "Euro", symbol: "€" },
                { code: "MXN", name: "Mexican Peso", symbol: "$" },
                { code: "COP", name: "Colombian Peso", symbol: "$" },
                { code: "ARS", name: "Argentine Peso", symbol: "$" },
                { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
                { code: "CLP", name: "Chilean Peso", symbol: "$" },
                { code: "BRL", name: "Brazilian Real", symbol: "R$" },
            ]);
        } finally {
            setLoadingCurrencies(false);
        }
    };

    const getMinEndDate = (): string | undefined => {
        if (jobBoard.start_date) {
            return formatDateYYYYMMDD(jobBoard.start_date);
        }
    };

    const handleStartDateChange = (newStartDate: string) => {
        const currentEndDate = jobBoard.end_date;

        const shouldResetEndDate =
            currentEndDate && new Date(newStartDate) > new Date(currentEndDate);

        setJobBoard({
            ...jobBoard,
            start_date: newStartDate,
            end_date: shouldResetEndDate ? "" : currentEndDate,
        });
    };

    const handleReset = () => {
        setJobBoard({
            title: jobBoardGetResponse.title,
            logo: jobBoardGetResponse.logo,
            company: jobBoardGetResponse.company ?? "",
            description: jobBoardGetResponse.description,
            type: jobBoardGetResponse.type,
            salary_range: jobBoardGetResponse.salary_range,
            link: jobBoardGetResponse.link,
            start_date: jobBoardGetResponse.start_date,
            end_date: jobBoardGetResponse.end_date,
            currency_type: jobBoardGetResponse.currency_type,
        });
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedImageFile(null);
        setSelectedTopic(null);
        setImageUploaderKey(Date.now());
        setResetKey(Date.now());
        setDescriptionError(false);
        setSubtopicError(false);
        setSalaryError("");

        // Resetear salario
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

        // Resetear moneda
        if (jobBoardGetResponse.currency_type) {
            setCurrencyType(jobBoardGetResponse.currency_type.code);
        } else {
            setCurrencyType("");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setDescriptionError(false);
        setSubtopicError(false);
        setSalaryError("");

        if (!jobBoard.description || jobBoard.description.trim() === "" || jobBoard.description === "<p></p>") {
            setDescriptionError(true);
            setUploading(false);
            return;
        }

        if (subtopicIds.subtopic_ids.length === 0) {
            setSubtopicError(true);
            setUploading(false);
            return;
        }

        if (salaryType === "fixed") {
            if (!salaryFixed) {
                setSalaryError("Debes ingresar un salario fijo.");
                setUploading(false);
                return;
            }
            if (!currencyType) {
                setSalaryError("Debes seleccionar un tipo de moneda para el salario.");
                setUploading(false);
                return;
            }
        }

        if (salaryType === "range") {
            const min = parseFloat(salaryMin);
            const max = parseFloat(salaryMax);

            if (isNaN(min) || isNaN(max)) {
                setSalaryError("Los valores deben ser números válidos.");
                setUploading(false);
                return;
            }

            if (min > max) {
                setSalaryError("El salario mínimo no puede ser mayor que el máximo.");
                setUploading(false);
                return;
            }

            if (!currencyType) {
                setSalaryError("Debes seleccionar un tipo de moneda para el salario.");
                setUploading(false);
                return;
            }
        }

        try {
            let imagePath = jobBoard.logo;
            if (selectedImageFile) {
                try {
                    imagePath = await uploadImageFile(selectedImageFile, "job-board");
                } catch (uploadError) {
                    setUploading(false);
                    setSuccessMessage("Error al subir imagen:" + uploadError);
                    return;
                }
            }

            let currencyData: CurrencyTypeRequest | null = null;
            if ((salaryType === "fixed" || salaryType === "range") && currencyType) {
                const selectedCurrency = currencies.find(currency => currency.code === currencyType);
                if (selectedCurrency) {
                    currencyData = {
                        code: selectedCurrency.code,
                        name: selectedCurrency.name,
                        symbol: selectedCurrency.symbol
                    };
                }
            }

            const update: JobBoardUpdateRequest = {
                ...jobBoard,
                salary_range:
                    salaryType === "fixed"
                    ? salaryFixed
                    : salaryType === "range"
                    ? `${salaryMin} - ${salaryMax}`
                    : "",
                logo: imagePath,
                currency_type: currencyData,
                start_date: jobBoard.start_date ? new Date(jobBoard.start_date).toISOString() : "",
                end_date: jobBoard.end_date ? new Date(jobBoard.end_date).toISOString() : null,
            };

            const hasChanged =
                update.title !== jobBoardGetResponse.title ||
                update.logo !== jobBoardGetResponse.logo ||
                update.company !== jobBoardGetResponse.company ||
                update.description !== jobBoardGetResponse.description ||
                update.type !== jobBoardGetResponse.type ||
                update.salary_range !== jobBoardGetResponse.salary_range ||
                update.link !== jobBoardGetResponse.link ||
                update.start_date !== jobBoardGetResponse.start_date ||
                update.end_date !== jobBoardGetResponse.end_date ||
                JSON.stringify(update.currency_type) !== JSON.stringify(jobBoardGetResponse.currency_type);

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
                }
            }

            setSuccessMessage("Oferta de trabajo actualizada con éxito");
        } catch (error) {
            setSuccessMessage("Error al actualizar la oferta de trabajo: " + error); 
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
                    <label>Título*</label>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Título" 
                        value={jobBoard.title} 
                        onChange={(e) => setJobBoard({ ...jobBoard, title: e.target.value })} 
                        required 
                    />
                </div>
                
                <div className="form-group">	
                    <label>Logo</label>	
                    <ImageInputSelector 
                        value={jobBoard.logo || ""} 
                        onChange={(img) => setJobBoard({ ...jobBoard, logo: img })} 
                        onFileSelected={setSelectedImageFile} 
                        urlLabel="📎 URL de la imagen" 
                        fileLabel="🖼️ Subir la imagen" 
                        imageUploaderKey={imageUploaderKey}
                        resetKey={resetKey}
                    />
                </div>
                
                <div className="form-group">  
                    <label>Compañia*</label>
                    <input 
                        type="text" 
                        name="company" 
                        placeholder="Empresa" 
                        value={jobBoard.company} 
                        onChange={(e) => setJobBoard({ ...jobBoard, company: e.target.value })} 
                        required 
                    />
                </div>
                
                <div className="form-group">  
                    <label>Descripción*</label>
                    {descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
                    <JoditEditor 
                        value={jobBoard.description} 
                        onChange={(content) => setJobBoard({ ...jobBoard, description: content })} 
                        className="jodit-container" 
                    />
                </div>
                
                <div className="form-group">
                    <label>Tipo de oferta</label>
                    <input 
                        type="text" 
                        name="type" 
                        placeholder="Tipo de oferta" 
                        value={jobBoard.type} 
                        onChange={(e) => setJobBoard({ ...jobBoard, type: e.target.value })} 
                    />
                </div>
                
                <div className="form-group">
                    <label>Link a la oferta*</label>
                    <input 
                        type="text" 
                        name="link" 
                        placeholder="Link a la oferta de trabajo" 
                        value={jobBoard.link} 
                        onChange={(e) => setJobBoard({ ...jobBoard, link: e.target.value })} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label className="create-educational-offer__label" htmlFor="start_date">Fecha de inicio*</label>
                    <input 
                        type="date" 
                        name="start_date" 
                        value={formatDateYYYYMMDD(jobBoard.start_date || "")} 
                        onChange={(e) => handleStartDateChange(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className="form-group">	
                    <label className="create-educational-offer__label" htmlFor="start_date">Fecha de finalización</label>
                    <input 
                        type="date" 
                        name="end_date" 
                        min={getMinEndDate()} 
                        disabled={!jobBoard.start_date} 
                        value={formatDateYYYYMMDD(jobBoard.end_date || "")} 
                        onChange={(e) => setJobBoard({ ...jobBoard, end_date: e.target.value })} 
                    />
                </div>
                
                <div className="form-group">
                    <label>Tipo de salario:</label>
                    <select 
                        className="update-job-board__select" 
                        value={salaryType} 
                        onChange={(e) => { 
                            const value = e.target.value as "none" | "fixed" | "range"; 
                            setSalaryType(value); 
                            setSalaryError(""); 
                            setCurrencyType("");
                            if (value === "none") { 
                                setSalaryFixed(""); 
                                setSalaryMin(""); 
                                setSalaryMax(""); 
                            } 
                        }} 
                    >
                        <option value="none">No especificar</option>
                        <option value="fixed">Valor fijo</option>
                        <option value="range">Rango</option>
                    </select>

                    {salaryType === "fixed" && (
                        <div className="salary-fixed-field">
                            <input 
                                type="text" 
                                name="salary_fixed" 
                                placeholder="Salario fijo" 
                                value={salaryFixed} 
                                onChange={(e) => setSalaryFixed(e.target.value)} 
                                required 
                            />
                        </div>
                    )}

                    {salaryType === "range" && (
                        <div className="salary-range-fields">
                            <input 
                                type="number" 
                                min="0" 
                                placeholder="Salario mínimo" 
                                value={salaryMin} 
                                onChange={(e) => setSalaryMin(e.target.value)} 
                                required 
                            />
                            <input 
                                type="number" 
                                min="0" 
                                placeholder="Salario máximo" 
                                value={salaryMax} 
                                onChange={(e) => setSalaryMax(e.target.value)} 
                                required 
                            />
                        </div>
                    )}

                    {(salaryType === "fixed" || salaryType === "range") && (
                        <div className="form-group">
                            <label>Tipo de Moneda*</label>
                            {loadingCurrencies ? (
                                <p>Cargando monedas...</p>
                            ) : (
                                <select 
                                    className="update-job-board__select" 
                                    value={currencyType} 
                                    onChange={(e) => setCurrencyType(e.target.value)} 
                                    required
                                >
                                    <option value="">Selecciona una moneda</option>
                                    {currencies.map((currency) => (
                                        <option key={currency.code} value={currency.code}>
                                            {currency.code} - {currency.name} ({currency.symbol})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {salaryError && <p className="error">{salaryError}</p>}
                </div>

                {subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
                
                <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
                <SubtopicSelector 
                    topics={topics} 
                    selectedTopic={selectedTopic} 
                    data={subtopicIds} 
                    setData={setSubtopicIds} 
                    subtopicsKey="subtopic_ids" 
                />
                <SelectedSubtopics 
                    data={subtopicIds} 
                    setData={setSubtopicIds} 
                    subtopicsKey="subtopic_ids" 
                    subtopicsList={allSubtopics} 
                />

                <div className="update-job-board__buttons">
                    <button type="submit" disabled={uploading}>
                        {uploading ? "Actualizando..." : "Actualizar Oferta"}
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
            </form>
        </div>
    );
};