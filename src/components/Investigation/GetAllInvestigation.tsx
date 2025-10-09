import React, { useEffect, useState } from "react";
import { InvestigationGetAllResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllInvestigation } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllInvestigation.css";

export const GetAllInvestigation: React.FC = () => {
    const [investigationList, setInvestigationList] = useState<InvestigationGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const getInvesitgation = async () => {
            try {
                const data = await getAllInvestigation(page, limit);
                setInvestigationList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay investigaciones disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las investigaciones");
            }
        }

        getInvesitgation();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        searchParams.set("page", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-investigation">
            <GetAllError message={error}/>
            <div className="get-all-investigation__list">
                {investigationList.map((investigation) => (
                    <Link to={`/investigation/${investigation.id}`} state={{ page: page }} key={investigation.id} className="get-all-investigation__list-item">
                        <p className="get-all-investigation__list-item-title">{investigation.title}</p>
                        <p className="get-all-investigation__list-item-user">
                            Subido por:{" "}{ investigation.user.regular_user?.name || investigation.user.university_user?.name || investigation.user.business_user?.name || "Anónimo" }
                        </p>
                    </Link>
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};