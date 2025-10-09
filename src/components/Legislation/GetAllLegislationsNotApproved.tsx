import React, { useEffect, useState } from "react";
import { LegislationGetAllResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllLegislationsNotApproved } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllLegislation.css";

export const GetAllLegislationsNotApproved: React.FC = () => {
    const [legislationList, setLegislationList] = useState<LegislationGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("legislationsPage")) || 1;

    useEffect(() => {
        const getLegislation = async () => {
            try {
                const data = await getAllLegislationsNotApproved(page, limit);
                setLegislationList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay legislaciones disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las legislaciones");
            }
        }

        getLegislation();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        searchParams.set("legislationsPage", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-legislation">
            <GetAllError message={error}/>
            <div className="get-all-legislation__list">
                {legislationList.map((legislation) => (
                    <Link to={`/admin/legislation/${legislation.id}`} state={{ page: page }} key={legislation.id} className="get-all-legislation__list-item">
                        <img src={legislation.logo  || "/src/assets/img/Logo.jpeg"} alt={legislation.title} className="get-all-legislation__list-item-logo" />

                        <p className="get-all-legislation__list-item-title">{legislation.title}</p>

                        <p className="get-all-legislation__list-item-date">
                            {new Date(legislation.date).toLocaleDateString("es-CO", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        <p className="get-all-legislation__list-item-user">
                            Subido por:<img src={legislation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/> { legislation.user.regular_user?.name || legislation.user.university_user?.name || legislation.user.business_user?.name || "Anónimo" }
                        </p>
                    </Link>
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};