import React, { useState, useEffect } from "react";
import { EducationalOfferGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { EducationalOfferUpdateRequest } from "../../dtos/requests";
import { getAllTopics, getEducationalOfferById, updateEducationalOffer, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, ImageInputSelector } from "../../components";
import "./UpdateEducationalOffer.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateEducationalOfferSubtopic, DeleteEducationalOfferSubtopic } from "../../api/EducationalOfferSubtopicApi";
import { formatDateYYYYMMDD } from "../../utils/Date";
import { TypeEducationResponse } from "../../dtos/responses/TypeEducation";
import { getAllTypeEducation } from "../../api/TypeEducation";
import { CurrencyTypeRequest } from "../../dtos/requests/CurrencyType";

interface UpdateEducationalOfferProps {
	onClose: () => void;
	educationalOfferGetResponse: EducationalOfferGetResponse;
	onUpdated?: (updated: EducationalOfferGetResponse) => void;	
}

export const UpdateEducationalOffer: React.FC<UpdateEducationalOfferProps> = ({ onClose, educationalOfferGetResponse, onUpdated }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
	const [resetKey, setResetKey] = useState<number>(Date.now());
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);
	const [typeEducation, setTypeEducation] = useState<TypeEducationResponse[]>([]);
	const [currencies, setCurrencies] = useState<CurrencyTypeRequest[]>([]);
	const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);
	const [currencyType, setCurrencyType] = useState("");

	const [successMessage, setSuccessMessage] = useState<string | null>(null);	

	const [educationalOffer, setEducationalOffer] = useState<EducationalOfferUpdateRequest>({
		title: educationalOfferGetResponse.title,
		institution: educationalOfferGetResponse.institution,
		logo: educationalOfferGetResponse.logo,
		start_date: educationalOfferGetResponse.start_date,
		end_date: educationalOfferGetResponse.end_date,
		cost: educationalOfferGetResponse.cost,
		description: educationalOfferGetResponse.description,
		link: educationalOfferGetResponse.link,
		type_education_id: educationalOfferGetResponse.type_education.id,
	});
	
	const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
		subtopic_ids: educationalOfferGetResponse.subtopics.map((s) => s.id),
	});

	const originalSubtopicIds = educationalOfferGetResponse.subtopics.map((s) => s.id);
	const allSubtopics = topics.flatMap((topic) => topic.subtopics);

	useEffect(() => {
		getAllTopics(setTopics);
		fetchCurrencies();
		fetchTypes();
		
		// Configurar moneda existente
		if (educationalOfferGetResponse.currency_type) {
			setCurrencyType(educationalOfferGetResponse.currency_type.code);
		}
	}, [educationalOfferGetResponse]);

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

	const fetchTypes = async () => {
		try {
			const data = await getAllTypeEducation();
			setTypeEducation(data);
		} catch (error) {
			console.error("Error al obtener los tipos de educación:", error);
		}
	};

	const getTodayDate = (): string => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	const getMinEndDate = (): string => {
		if (educationalOffer.start_date) {
			return formatDateYYYYMMDD(educationalOffer.start_date);
		}
		return getTodayDate();
	};

	const handleStartDateChange = (newStartDate: string) => {
		const currentEndDate = educationalOffer.end_date;

		const shouldResetEndDate =
			currentEndDate && new Date(newStartDate) > new Date(currentEndDate);

		setEducationalOffer({
			...educationalOffer,
			start_date: newStartDate,
			end_date: shouldResetEndDate ? "" : currentEndDate,
		});
	};

    const handleReset = () => {
        setEducationalOffer({
			title: educationalOfferGetResponse.title,
			institution: educationalOfferGetResponse.institution,
			logo: educationalOfferGetResponse.logo,
			start_date: educationalOfferGetResponse.start_date,
			end_date: educationalOfferGetResponse.end_date,
			cost: educationalOfferGetResponse.cost,
			description: educationalOfferGetResponse.description,
			link: educationalOfferGetResponse.link,
			type_education_id: educationalOfferGetResponse.type_education.id,
		});
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedImageFile(null);
        setSelectedTopic(null);
        setImageUploaderKey(Date.now());
        setResetKey(Date.now());
        setDescriptionError(false);
        setSubtopicError(false);
        setErrorMessage(null);

		// Resetear moneda
		if (educationalOfferGetResponse.currency_type) {
			setCurrencyType(educationalOfferGetResponse.currency_type.code);
		} else {
			setCurrencyType("");
		}
    };

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);
		setErrorMessage(null);
		setDescriptionError(false);
        setSubtopicError(false);

		if (!educationalOffer.description || educationalOffer.description.trim() === "" || educationalOffer.description === "<p></p>") {
            setDescriptionError(true);
			setUploading(false);
            return;
        }
        
        if (subtopicIds.subtopic_ids.length === 0) {
            setSubtopicError(true);
			setUploading(false);
            return;
        }

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const startDate = new Date(educationalOffer.start_date);
		const endDate = new Date(educationalOffer.end_date);

		if (endDate.getTime() < startDate.getTime()) {
			setErrorMessage("La fecha final no puede ser anterior a la fecha de inicio.");
			setUploading(false);
			return;
		}

		try {
			let imagePath = educationalOffer.logo;
			if (selectedImageFile) {
				try {
					imagePath = await uploadImageFile(selectedImageFile, "educational-offer");
				} catch (uploadError) {
					setUploading(false);
					setSuccessMessage("Error al subir imagen:" + uploadError);
					return;
				}
			}

			let currencyData: CurrencyTypeRequest | null = null;
			if (educationalOffer.cost != 0 && currencyType) {
				const selectedCurrency = currencies.find(currency => currency.code === currencyType);
				if (selectedCurrency) {
					currencyData = {
						code: selectedCurrency.code,
						name: selectedCurrency.name,
						symbol: selectedCurrency.symbol
					};
				}
			}

			const updateEducational: EducationalOfferUpdateRequest = {
				...educationalOffer,
				logo: imagePath,
				currency_type: currencyData ?? null,
				start_date: startDate.toISOString(),
				end_date: endDate.toISOString(),
			};

			const hasChanged =
				updateEducational.title !== educationalOfferGetResponse.title ||
				updateEducational.institution !== educationalOfferGetResponse.institution ||
				updateEducational.logo !== educationalOfferGetResponse.logo ||
				updateEducational.start_date !== educationalOfferGetResponse.start_date ||
				updateEducational.end_date !== educationalOfferGetResponse.end_date ||
				updateEducational.cost !== educationalOfferGetResponse.cost ||
				updateEducational.description !== educationalOfferGetResponse.description ||
				updateEducational.link !== educationalOfferGetResponse.link ||
				updateEducational.type_education_id !== educationalOfferGetResponse.type_education.id ||
				JSON.stringify(updateEducational.currency_type) !== JSON.stringify(educationalOfferGetResponse.currency_type);

			const currentSet = new Set(subtopicIds.subtopic_ids);
            const originalSet = new Set(originalSubtopicIds);

            const added = subtopicIds.subtopic_ids.filter(id => !originalSet.has(id));
            const removed = originalSubtopicIds.filter(id => !currentSet.has(id));

			if (added.length > 0) {
				await CreateEducationalOfferSubtopic(educationalOfferGetResponse.id, { subtopic_ids: added });
			}

			if (removed.length > 0) {
				await DeleteEducationalOfferSubtopic(educationalOfferGetResponse.id, { subtopic_ids: removed });
			}

			const subtopicsChanged = added.length > 0 || removed.length > 0;
			
			if (hasChanged || subtopicsChanged) {
				await updateEducationalOffer(educationalOfferGetResponse.id, updateEducational);
				const refreshedEducationalOffer = await getEducationalOfferById(educationalOfferGetResponse.id);
				if (onUpdated) {
					onUpdated(refreshedEducationalOffer);
				}
			}

			setSuccessMessage("Oferta educativa actualizada con éxito");
		} catch (error) {
			setSuccessMessage("Error al actualizar oferta educativa: " + error);
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
		<div className="update-educational-offer">
			<ButtonClose onClick={onClose} />
			<h2 className="update-educational-offer__title">Actualizar Oferta Educativa</h2>
			{successMessage && (
				<div className="success-message">
					{successMessage}
				</div>
			)}
			{errorMessage && (
				<div className="update-educational-offer__error">
					{errorMessage}
				</div>
			)}

			<form className="update-educational-offer__form" onSubmit={handleUpdate}>
				<div className="form-group">
					<label>Título*</label>
					<input type="text" name="title" placeholder="Título" value={educationalOffer.title} onChange={(e) => setEducationalOffer({ ...educationalOffer, title: e.target.value })} required />
				</div>
				<div className="form-group">	
					<label>Institución*</label>
					<input type="text" name="institution" placeholder="Institución" value={educationalOffer.institution} onChange={(e) => setEducationalOffer({ ...educationalOffer, institution: e.target.value })} required />
				</div>
				<div className="form-group">	
					<label>Logo</label>	
					<ImageInputSelector 
						value={educationalOffer.logo || ""} 
						onChange={(img) => setEducationalOffer({ ...educationalOffer, logo: img })} 
						onFileSelected={setSelectedImageFile} 
						urlLabel="📎 URL de la imagen" 
						fileLabel="🖼️ Subir la imagen" 
						imageUploaderKey={imageUploaderKey}
						resetKey={resetKey}
					/>
				</div>
				<div className="form-group">
					<label className="create-educational-offer__label" htmlFor="start_date">Fecha de inicio*</label>
					<input 
						type="date" 
						name="start_date"  
						value={formatDateYYYYMMDD(educationalOffer.start_date || "")} 
						onChange={(e) => handleStartDateChange(e.target.value)} 
						required 
					/>
				</div>
				<div className="form-group">	
					<label className="create-educational-offer__label" htmlFor="start_date">Fecha de finalización*</label>
					<input 
						type="date" 
						min={getMinEndDate()} 
						name="end_date" 
						disabled={!educationalOffer.start_date} 
						value={formatDateYYYYMMDD(educationalOffer.end_date || "")} 
						onChange={(e) => setEducationalOffer({ ...educationalOffer, end_date: e.target.value })} 
						required 
					/>
				</div>
				<div className="form-group">	
					<label>Precio</label>
					<input 
						type="number" 
						name="cost" 
						placeholder="Costo" 
						min={0} 
						value={educationalOffer.cost} 
						onChange={(e) => setEducationalOffer({ ...educationalOffer, cost: Number(e.target.value) })} 
					/>
				</div>
				{educationalOffer.cost > 0 && (
					<div className="form-group">
						<label>Tipo de Moneda*</label>
						{loadingCurrencies ? (
							<p>Cargando monedas...</p>
						) : (
							<select 
								className="update-educational-offer__select" 
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
				<div className="form-group">
					<label>Descripción*</label>
					{descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
					<JoditEditor 
						value={educationalOffer.description} 
						onChange={(content) => setEducationalOffer({ ...educationalOffer, description: content })} 
						className="jodit-container" 
					/>
				</div>
				<div className="form-group">
					<label>Enlace*</label>
					<input 
						type="url" 
						name="link" 
						placeholder="Enlace" 
						value={educationalOffer.link} 
						onChange={(e) => setEducationalOffer({ ...educationalOffer, link: e.target.value })} 
						required
					/>
				</div>
				<div className="form-group">
					<label>Tipo de educación*</label>
					<select
						value={educationalOffer.type_education_id}
						onChange={(e) =>
							setEducationalOffer({ ...educationalOffer, type_education_id: Number(e.target.value) })
						}
						required
					>
						<option value="" disabled>Selecciona un tipo de educación</option>
						{typeEducation.map((type) => (
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

				<div className="update-educational-offer__buttons">
                    <button type="submit" disabled={uploading}>
                        {uploading ? "Actualizando..." : "Actualizar Oferta Educativa"}
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
			</form>
		</div>
	);
};