import React, { useEffect, useState } from "react";
import { EventGetAllByUserIDResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllEventsByUserID } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllEvent.css";

export const GetAllEventsByUserID: React.FC = () => {
	const [eventList, setEventList] = useState<EventGetAllByUserIDResponse[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [error, setError] = useState<string | null>(null);

	const limit = 5;
	const [searchParams, setSearchParams] = useSearchParams();
	const page = Number(searchParams.get("eventsPage")) || 1;

	useEffect(() => {
		const getEvent = async () => {
			try {
				const data = await getAllEventsByUserID(page, limit);
				setEventList(data.data);
				setTotalPages(data.total_page);
				setError(data.data.length ? null : "No hay Eventos disponibles.");
			} catch (err) {
				setError("No se pudieron cargar los Eventos");
				console.error(err);
			}
		};
        getEvent();
	}, [page]);

	const handlePageChange = (newPage: number) => {
		searchParams.set("eventsPage", newPage.toString());
		setSearchParams(searchParams);
	};

	return (
		<section className="get-all-event">
			<GetAllError message={error} />
			<div className="get-all-event__list">
				{eventList.map((event) => {
					let statusLabel = null;
					if (event.is_approved === false) {
						statusLabel = <span className="status-label disapproved">Desaprobado</span>;
					} else if (event.is_approved === null) {
						statusLabel = <span className="status-label pending">En espera de aprobación</span>;
					}

					return (
						<Link to={`/user/event/${event.id}`} state={{ page: page }} key={event.id} className="get-all-event__list-item" >
							<div className="get-all-event__image-container">
								<img src={event.image? event.image: event.poster? event.poster: "/src/assets/img/Logo.jpeg"} alt={event.title} className="get-all-event__list-item-image" />
							</div>

							<div className="get-all-event__content">
								<h3 className="get-all-event__list-item-title">{event.title}</h3>
								<p className="get-all-event__list-item-date">
									📅 {new Date(event.date).toLocaleDateString()}
								</p>

								<div className="get-all-event__list-item-description" dangerouslySetInnerHTML={{__html:event.description.length > 250 ? event.description.substring(0, 250) + "..." : event.description,}} />

								<p className="get-all-event__list-item-user">
								    Subido por:{" "} <img src={event.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
									{event.user.regular_user?.name ||
										event.user.university_user?.name ||
										event.user.business_user?.name ||
										"Anónimo"}
								</p>

								{statusLabel && <div className="get-all-event__status">{statusLabel}</div>}
							</div>
						</Link>
					);
				})}
			</div>
			<Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
		</section>
	);
};
