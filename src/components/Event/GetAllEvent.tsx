import React, { useEffect, useState } from "react";
import { EventGetAllResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllEvent } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllEvent.css";

export const GetAllEvent: React.FC = () => {
    const [eventList, setEventList] = useState<EventGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const getEvent = async () => {
            try {
                const data = await getAllEvent(page, limit);
                setEventList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay Eventos disponibles.");
            } catch (err) {
                setError("No se pudieron cargar los Eventos");
            }
        }

        getEvent();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        searchParams.set("page", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-event">
            <GetAllError message={error}/>
            <div className="get-all-event__list">
                {eventList.map((event) => (
                    <Link to={`/event/${event.id}`} key={event.id} className="get-all-event__list-item">
                        <p className="get-all-event__list-item-title">{event.title}</p>
                        <img src={event.image? event.image: event.poster? event.poster: "/src/assets/img/Logo.jpeg"} alt={event.title} className="get-all-event__list-item-image"/>
                        <p className="get-all-news__list-item-date">{new Date(event.date).toLocaleDateString()}</p>
                        <p className="get-all-event__list-item-user">
                            Subido por:{" "}{ event.user.regular_user?.name || event.user.university_user?.name || event.user.business_user?.name || "Anónimo" }
                        </p>
                    </Link>
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};