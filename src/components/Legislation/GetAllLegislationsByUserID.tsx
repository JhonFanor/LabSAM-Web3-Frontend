import React, { useEffect, useState } from "react";
import { LegislationGetAllByUserIDResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllLegislationsByUserID } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllLegislation.css";

export const GetAllLegislationsByUserID: React.FC = () => {
    const [legislationList, setLegislationList] = useState<LegislationGetAllByUserIDResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("legislationsPage")) || 1;

    useEffect(() => {
        const getLegislation = async () => {
            try {
                const data = await getAllLegislationsByUserID(page, limit);
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
                {legislationList.map((legislation) => {
                    let statusLabel = null;
                    if (legislation.is_approved === false) {
                        statusLabel = <span className="status-label disapproved">Desaprobado</span>;
                    } else if (legislation.is_approved === null) {
                        statusLabel = <span className="status-label pending">En espera de aprobación</span>;
                    }
                    return(
                        <Link to={`/user/legislation/${legislation.id}`} key={legislation.id} className="get-all-legislation__list-item">
                            <p className="get-all-legislation__list-item-title">{legislation.title}</p>
                            <p className="get-all-legislation__list-item-user">
                                Subido por:{" "}{ legislation.user.regular_user?.name || legislation.user.university_user?.name || legislation.user.business_user?.name || "Anónimo" }
                            </p>
                            {statusLabel && (
                                <div className="get-all-legislation__status">{statusLabel}</div>
                            )}
                        </Link>
                    )
                })}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};