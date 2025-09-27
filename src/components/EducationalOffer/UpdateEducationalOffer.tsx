import React, { useState, useEffect } from "react";
import { EducationalOfferGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { EducationalOfferUpdateRequest } from "../../dtos/requests";
import { getAllTopics, getEducationalOfferById, updateEducationalOffer } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics } from "../../components";
import "./UpdateEducationalOffer.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateEducationalOfferSubtopic, DeleteEducationalOfferSubtopic } from "../../api/EducationalOfferSubtopicApi";
import { formatDateYYYYMMDD } from "../../utils/Date";

interface UpdateEducationalOfferProps {
	onClose: () => void;
	educationalOfferGetResponse: EducationalOfferGetResponse;
	onUpdated?: (updated: EducationalOfferGetResponse) => void;	
}

export const UpdpateEducationalOffer: React.FC<UpdateEducationalOfferProps> = ({ onClose, educationalOfferGetResponse, onUpdated }) => {
	const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [uploading] = useState(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);	

	const [educationalOffer, setEducationalOffer] = useState<EducationalOfferUpdateRequest>({
		title: educationalOfferGetResponse.title,
		institution: educationalOfferGetResponse.institution,
		start_date: educationalOfferGetResponse.start_date,
		end_date: educationalOfferGetResponse.end_date,
		cost: educationalOfferGetResponse.cost,
		description: educationalOfferGetResponse.description,
		link: educationalOfferGetResponse.link,
	});
	
	const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
		subtopic_ids: educationalOfferGetResponse.subtopics.map((s) => s.id),
	});

	const originalSubtopicIds = educationalOfferGetResponse.subtopics.map((s) => s.id);
	const allSubtopics = topics.flatMap((topic) => topic.subtopics);

	useEffect(() => {
		getAllTopics(setTopics);
	}, []);

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

    const handleReset = () => {
        setEducationalOffer({
			title: educationalOfferGetResponse.title,
			institution: educationalOfferGetResponse.institution,
			start_date: educationalOfferGetResponse.start_date ? new Date(educationalOfferGetResponse.start_date).toISOString().split("T")[0] : "",
			end_date: educationalOfferGetResponse.end_date ? new Date(educationalOfferGetResponse.end_date).toISOString().split("T")[0] : "",
			cost: educationalOfferGetResponse.cost,
			description: educationalOfferGetResponse.description,
			link: educationalOfferGetResponse.link,
		});
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedTopic(null);
    };

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);

		const today = new Date();
		
		if (!educationalOffer.start_date || !educationalOffer.end_date) {
			setErrorMessage("Ambas fechas deben estar definidas.");
			return;
		}

		const startDate = new Date(educationalOffer.start_date);
		const endDate = new Date(educationalOffer.end_date);

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
			const updateEducational: EducationalOfferUpdateRequest = {
				...educationalOffer,
				start_date: startDate.toISOString(),
				end_date: endDate.toISOString(),
			};

			const hasChanged =
				updateEducational.title !== educationalOfferGetResponse.title ||
				updateEducational.institution !== educationalOfferGetResponse.institution ||
				updateEducational.start_date !== educationalOfferGetResponse.start_date ||
				updateEducational.end_date !== educationalOfferGetResponse.end_date ||
				updateEducational.cost !== educationalOfferGetResponse.cost ||
				updateEducational.description !== educationalOfferGetResponse.description ||
				updateEducational.link !== educationalOfferGetResponse.link;

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
					educationalOfferGetResponse = refreshedEducationalOffer;
				}
			}

			setSuccessMessage("Oferta educativa actualizada con éxito");
		} catch (error) {
			setErrorMessage("Error al actualizar la oferta educativa: " + error);
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
			<h2 className="update-educational-offer__title">Crear Oferta Educativa</h2>
			{successMessage && (
				<div className="update-educational-offer__success">
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
					<label>Título</label>
					<input type="text" name="title" placeholder="Título" value={educationalOffer.title} onChange={(e) => setEducationalOffer({ ...educationalOffer, title: e.target.value })} required />
				</div>	
				<div className="form-group">	
					<label>Institución</label>
					<input type="text" name="institution" placeholder="Institución" value={educationalOffer.institution} onChange={(e) => setEducationalOffer({ ...educationalOffer, institution: e.target.value })} required />
				</div>	
				<div className="form-group">
					<label className="update-educational-offer__label" htmlFor="start_date">
						Fecha de inicio
					</label>
					<input type="date" name="start_date" min={getTodayDate()}value={formatDateYYYYMMDD(educationalOffer.start_date || "")} onChange={(e) => handleStartDateChange(e.target.value)} required />
				</div>	
				<div className="form-group">
					<label className="update-educational-offer__label" htmlFor="start_date">
						Fecha de finalización
					</label>
					<input type="date" name="end_date" min={getMinEndDate()} disabled={!educationalOffer.start_date} value={formatDateYYYYMMDD(educationalOffer.end_date || "")} onChange={(e) => setEducationalOffer({ ...educationalOffer, end_date: e.target.value })} required />
				</div>	
				<div className="form-group">	
					<label>Precio</label>
					<input type="number" name="cost" placeholder="Costo" min={0} value={educationalOffer.cost} onChange={(e) => setEducationalOffer({ ...educationalOffer, cost: Number(e.target.value) })} required />
				</div>
				<div className="form-group">
					<label>Descripción</label>
					<JoditEditor value={educationalOffer.description} onChange={(content) => setEducationalOffer({ ...educationalOffer, description: content })} className="jodit-container" />
				</div>
				<div className="form-group">
					<label>Enlace</label>
					<input type="url" name="link" placeholder="Enlace (opcional)" value={educationalOffer.link} onChange={(e) => setEducationalOffer({ ...educationalOffer, link: e.target.value })} />
				</div>
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" />
				<SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

				<div className="update-educational-offer__buttons">
                    <button type="submit">
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
