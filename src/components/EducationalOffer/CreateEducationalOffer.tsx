import React, { useState, useEffect } from "react";
import { TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { EducationalOfferCreateRequest } from "../../dtos/requests";
import { createEducationalOffer, getAllTopics } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics } from "../../components";
import "./CreateEducationalOffer.css";

interface CreateEducationalOfferProps {
	onClose: () => void;
}

export const CreateEducationalOffer: React.FC<CreateEducationalOfferProps> = ({ onClose }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [descriptionError, setDescriptionError] = useState<boolean>(false);
	const [subtopicError, setSubtopicError] = useState<boolean>(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);	

	const [educationalOffer, setEducationalOffer] = useState<EducationalOfferCreateRequest>({
		title: "",
		institution: "",
		start_date: "",
		end_date: "",
		cost: 0,
		description: "",
		link: "",
		subtopic_ids: [],
	});

	useEffect(() => {
		getAllTopics(setTopics);
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
            return;
        }
        
        if (educationalOffer.subtopic_ids.length === 0) {
            setSubtopicError(true);
            return;
        }

		if (startDate.getTime() < today.getTime()) {
			setErrorMessage("La fecha de inicio no puede ser anterior al día de hoy.");
			return;
		}

		if (endDate.getTime() < today.getTime()) {
			setErrorMessage("La fecha final no puede ser anterior al día de hoy.");
			return;
		}

		if (endDate.getTime() < startDate.getTime()) {
			setErrorMessage("La fecha final no puede ser anterior a la fecha de inicio.");
			return;
		}

		try {
			const educationalOfferToSend: EducationalOfferCreateRequest = {
				...educationalOffer,
				start_date: startDate.toISOString(),
				end_date: endDate.toISOString(),
			};

			await createEducationalOffer(educationalOfferToSend);

			setSelectedTopic(null);
			setEducationalOffer({
				title: "",
				institution: "",
				start_date: "",
				end_date: "",
				cost: 0,
				description: "",
				link: "",
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
					<label className="create-educational-offer__label" htmlFor="start_date">Fecha de inicio*</label>
					<input type="date" name="start_date" min={getTodayDate()} value={educationalOffer.start_date} onChange={(e) => handleStartDateChange(e.target.value)} required />
				</div>
				<div className="form-group">	
					<label className="create-educational-offer__label" htmlFor="start_date">Fecha de finalización*</label>
					<input type="date" name="end_date" min={getMinEndDate()} disabled={!educationalOffer.start_date} value={educationalOffer.end_date} onChange={(e) => setEducationalOffer({ ...educationalOffer, end_date: e.target.value })} required />
				</div>
				<div className="form-group">	
					<label>Precio</label>
					<input type="number" name="cost" placeholder="Costo" min={0} value={educationalOffer.cost} onChange={(e) => setEducationalOffer({ ...educationalOffer, cost: Number(e.target.value) })} required />
				</div>
				<div className="form-group">
					<label>Descripción*</label>
					{descriptionError && (
                        <span className="form-error">La descripción es obligatoria.</span>
                    )}
					<JoditEditor value={educationalOffer.description} onChange={(content) => setEducationalOffer({ ...educationalOffer, description: content })} className="jodit-container" />
				</div>
				<div className="form-group">
					<label>Enlace*</label>
					<input type="url" name="link" placeholder="Enlace (opcional)" value={educationalOffer.link} onChange={(e) => setEducationalOffer({ ...educationalOffer, link: e.target.value })} required/>
				</div>
				{ subtopicError && (
                    <span className="form-error">Debes seleccionar al menos un subtema.</span>
                )}
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={educationalOffer} setData={setEducationalOffer} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={educationalOffer} setData={setEducationalOffer} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

				<button className="create-educational-offer__submit" type="submit">
					Guardar Oferta Educativa
				</button>
			</form>
		</div>
	);
};
