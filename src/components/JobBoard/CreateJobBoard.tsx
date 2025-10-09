import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { JobBoardCreateRequest } from "../../dtos/requests";
import { createJobBoard, getAllTopics, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, ImageInputSelector } from "../../components";
import "./CreateJobBoard.css";
import { CurrencyTypeRequest } from "../../dtos/requests/CurrencyType";

interface CreateJobBoardProps {
    onClose: () => void;
}

export const CreateJobBoard: React.FC<CreateJobBoardProps> = ({ onClose }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
    const [descriptionError, setDescriptionError] = useState<boolean>(false);
    const [subtopicError, setSubtopicError] = useState<boolean>(false);
    const [currencies, setCurrencies] = useState<CurrencyTypeRequest[]>([]);
    const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);  

    const [jobBoard, setJobBoard] = useState<JobBoardCreateRequest>({
        title: "",
        logo: "",
        company: "",
        description: "",
        type: "",
        salary_range: "",
        link: "",
        start_date: "",
        end_date: "",
        currency_type: null,
        subtopic_ids: [],
    });

    const [salaryType, setSalaryType] = useState<"none" | "fixed" | "range">("none");
    const [salaryFixed, setSalaryFixed] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [salaryError, setSalaryError] = useState("");
    const [currencyType, setCurrencyType] = useState("");

    useEffect(() => {
        getAllTopics(setTopics);
        fetchCurrencies();
    }, []);

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
            return jobBoard.start_date;
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

    const allSubtopics = topics.flatMap(topic => topic.subtopics);

    const handleSubmit = async (e: React.FormEvent) => {
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

        if (jobBoard.subtopic_ids.length === 0) {
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
                    setSuccessMessage("Error al subir imagen:"+uploadError);
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

            const preparedJobBoard: JobBoardCreateRequest = {
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

            await createJobBoard(preparedJobBoard);

            setSelectedTopic(null);
            setSalaryFixed("");
            setSalaryMin("");
            setSalaryMax("");
            setSalaryType("none");
            setSalaryError("");
            setCurrencyType("");
            setUploading(false);
            setSelectedImageFile(null);
            setImageUploaderKey(Date.now());

            setJobBoard({
                title: "",
                logo: "",
                company: "",
                description: "",
                type: "",
                salary_range: "",
                link: "",
                start_date: "",
                end_date: "",
                currency_type: null,
                subtopic_ids: [],
            });

            setSuccessMessage("Oferta de trabajo creada exitosamente.");
        } catch (error) {
            setSuccessMessage("Error al crear oferta de trabajo:" + error);
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
                    <label>Imagen</label>	
                    <ImageInputSelector value={jobBoard.logo || ""} onChange={(img) => setJobBoard({ ...jobBoard, logo: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" imageUploaderKey={imageUploaderKey} />
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
                    <label className="create-educational-offer__label" htmlFor="start_date">Fecha de inicio*</label>
                    <input type="date" name="start_date" value={jobBoard.start_date} onChange={(e) => handleStartDateChange(e.target.value)} required />
                </div>
                <div className="form-group">	
                    <label className="create-educational-offer__label" htmlFor="start_date">Fecha de finalización</label>
                    <input type="date" name="end_date" min={getMinEndDate()} disabled={!jobBoard.start_date} value={jobBoard.end_date || ""} onChange={(e) => setJobBoard({ ...jobBoard, end_date: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Tipo de salario:</label>
                    <select className="create-job-board__select" value={salaryType} onChange={(e) => { 
                        const value = e.target.value as "none" | "fixed" | "range"; 
                        setSalaryType(value); 
                        setSalaryError(""); 
                        setCurrencyType("");
                        if (value === "none") { 
                            setSalaryFixed(""); 
                            setSalaryMin(""); 
                            setSalaryMax(""); 
                        } 
                    }} >
                        <option value="none">No especificar</option>
                        <option value="fixed">Valor fijo</option>
                        <option value="range">Rango</option>
                    </select>

                    {salaryType === "fixed" && (
                        <div className="salary-fixed-field">
                            <input type="text" name="salary_fixed" placeholder="Salario fijo" value={salaryFixed} onChange={(e) => setSalaryFixed(e.target.value)} required />
                        </div>
                    )}

                    {salaryType === "range" && (
                        <div className="salary-range-fields">
                            <input type="number" min="0" placeholder="Salario mínimo" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} required />
                            <input type="number" min="0" placeholder="Salario máximo" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} required />
                        </div>
                    )}

                    {(salaryType === "fixed" || salaryType === "range") && (
                        <div className="form-group">
                            <label>Tipo de Moneda*</label>
                            {loadingCurrencies ? (
                                <p>Cargando monedas...</p>
                            ) : (
                                <select className="create-job-board__select" value={currencyType} onChange={(e) => setCurrencyType(e.target.value)} required>
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

                { subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
                <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
                <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={jobBoard} setData={setJobBoard} subtopicsKey="subtopic_ids" />
                <SelectedSubtopics data={jobBoard} setData={setJobBoard} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

                <button className="create-job-board__submit" type="submit" disabled={uploading}>
                    {uploading ? "Guardando..." : "Guardar Oferta"}
                </button>
            </form>
        </div>
    );
};