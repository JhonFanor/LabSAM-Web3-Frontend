import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { EducationalOfferCreateRequest } from "../../dtos/requests";
import { createEducationalOffer, getAllTopics, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, ImageInputSelector } from "../../components";
import "./CreateEducationalOffer.css";
import { TypeEducationResponse } from "../../dtos/responses/TypeEducation";
import { getAllTypeEducation } from "../../api/TypeEducation";
import { CurrencyTypeRequest } from "../../dtos/requests/CurrencyType";

interface CreateEducationalOfferProps {
	onClose: () => void;
}

export const CreateEducationalOffer: React.FC<CreateEducationalOfferProps> = ({ onClose }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [uploading, setUploading] = useState<boolean>(false);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);
	const [typeEducation, setTypeEducation] = useState<TypeEducationResponse[]>([]);
	const [currencies, setCurrencies] = useState<CurrencyTypeRequest[]>([]);
	const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);
	const [currencyType, setCurrencyType] = useState("");

	const [successMessage, setSuccessMessage] = useState<string | null>(null);	

	const [educationalOffer, setEducationalOffer] = useState<EducationalOfferCreateRequest>({
		title: "",
		institution: "",
		logo: "",
		start_date: "",
		end_date: "",
		cost: 0,
		description: "",
		link: "",
		type_education_id: 0,
		currency_type: null,
		subtopic_ids: [],
	});

	useEffect(() => {
		getAllTopics(setTopics);
		fetchCurrencies();
	}, []);

	const allSubtopics = topics.flatMap(topic => topic.subtopics);

	const getTodayDate = (): string => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	const getMinEndDate = (): string => {
		if (educationalOffer.start_date) {
			return educationalOffer.start_date;
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


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		setDescriptionError(false);
        setSubtopicError(false);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const startDate = new Date(educationalOffer.start_date);
		const endDate = new Date(educationalOffer.end_date);

		if (!educationalOffer.description || educationalOffer.description.trim() === "" || educationalOffer.description  === "<p></p>") {
            setDescriptionError(true);
			setUploading(false);
            return;
        }
        
        if (educationalOffer.subtopic_ids.length === 0) {
            setSubtopicError(true);
			setUploading(false);
            return;
        }

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
					setSuccessMessage("Error al subir imagen:"+uploadError);
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

			const educationalOfferToSend: EducationalOfferCreateRequest = {
				...educationalOffer,
				logo: imagePath,
				currency_type:  currencyData ?? null,
				start_date: startDate.toISOString(),
				end_date: endDate.toISOString(),
			};

			await createEducationalOffer(educationalOfferToSend);

			setCurrencyType("");
            setUploading(false);
            setSelectedImageFile(null);
            setImageUploaderKey(Date.now());
			setSelectedTopic(null);
			setEducationalOffer({
				title: "",
				institution: "",
				logo: "",
				start_date: "",
				end_date: "",
				cost: 0,
				description: "",
				link: "",
				type_education_id: 0,
				currency_type: null,
				subtopic_ids: [],
			});

			setSuccessMessage("Oferta educativa creada exitosamente.");
			return ;
		} catch (error) {
			setSuccessMessage("Error al crear oferta educativa:" + error);
		}
	};

	useEffect(() => {
		if (successMessage) {
			const timeout = setTimeout(() => setSuccessMessage(null), 10000); 
			return () => clearTimeout(timeout);
		}
	}, [successMessage]);

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

	useEffect(() => {
		const fetchTypes = async () => {
			try {
				const data = await getAllTypeEducation();
				setTypeEducation(data);
			} catch (error) {
				console.error("Error al obtener los tipos de educación:", error);
			}
		};
		fetchTypes();
	}, []);

	return (
		<div className="create-educational-offer">
			<ButtonClose onClick={onClose} />
			<h2 className="create-educational-offer__title">Crear Oferta Educativa</h2>
			{successMessage && (
				<div className="success-message">
					{successMessage}
				</div>
			)}
			{errorMessage && (
				<div className="create-educational-offer__error">
					{errorMessage}
				</div>
			)}

			<form className="create-educational-offer__form" onSubmit={handleSubmit}>
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
					<ImageInputSelector value={educationalOffer.logo || ""} onChange={(img) => setEducationalOffer({ ...educationalOffer, logo: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" imageUploaderKey={imageUploaderKey} />
				</div>
				<div className="form-group">
					<label className="create-educational-offer__label" htmlFor="start_date">Fecha de inicio*</label>
					<input type="date" name="start_date"  value={educationalOffer.start_date} onChange={(e) => handleStartDateChange(e.target.value)} required />
				</div>
				<div className="form-group">	
					<label className="create-educational-offer__label" htmlFor="start_date">Fecha de finalización*</label>
					<input type="date" min={getMinEndDate()} name="end_date" disabled={!educationalOffer.start_date} value={educationalOffer.end_date} onChange={(e) => setEducationalOffer({ ...educationalOffer, end_date: e.target.value })} required />
				</div>
				<div className="form-group">	
					<label>Precio</label>
					<input type="number" name="cost" placeholder="Costo" min={0} value={educationalOffer.cost} onChange={(e) => setEducationalOffer({ ...educationalOffer, cost: Number(e.target.value) })} required />
				</div>
				{educationalOffer.cost > 0 && (
					<div className="form-group">
						<label>Tipo de Moneda*</label>
						{loadingCurrencies ? (
							<p>Cargando monedas...</p>
						) : (
							<select className="create-educational-offer__select" value={currencyType} onChange={(e) => setCurrencyType(e.target.value)} required>
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
					<JoditEditor value={educationalOffer.description} onChange={(content) => setEducationalOffer({ ...educationalOffer, description: content })} className="jodit-container" />
				</div>
				<div className="form-group">
					<label>Enlace*</label>
					<input type="url" name="link" placeholder="Enlace" value={educationalOffer.link} onChange={(e) => setEducationalOffer({ ...educationalOffer, link: e.target.value })} required/>
				</div>
				<div className="form-group">
					<label>Tipo de educación*</label>
					<select
						value={educationalOffer.type_education_id === 0 ? "" : educationalOffer.type_education_id}
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
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={educationalOffer} setData={setEducationalOffer} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={educationalOffer} setData={setEducationalOffer} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

				<button className="create-educational-offer__submit" type="submit">
					{uploading ? "Guardando..." : "Guardar Oferta Educativa"}
				</button>
			</form>
		</div>
	);
};
