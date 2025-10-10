import React, { useEffect, useState } from "react";
import { InvestigationGetAllResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllInvestigationsNotApproved } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllInvestigation.css";

export const GetAllInvestigationsNotApproved: React.FC = () => {
    const [investigationList, setInvestigationList] = useState<InvestigationGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("investigationsPage")) || 1;

    useEffect(() => {
        const getInvesitgation = async () => {
            try {
                const data = await getAllInvestigationsNotApproved(page, limit);
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
        searchParams.set("investigationsPage", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-investigation">
            <GetAllError message={error}/>
            <div className="get-all-investigation__list">
                {investigationList.map((investigation) => (
                    <Link to={`/admin/investigation/${investigation.id}`} state={{ page: page }} key={investigation.id} className="get-all-investigation__list-item">
                        <div className="get-all-investigation__image-container">
                            <img src={investigation.logo? investigation.logo: "/src/assets/img/Logo.jpeg"} alt={investigation.title} className="get-all-investigation__list-item-image" />
                        </div>
                        <div className="get-all-investigation__content">
                            <h3 className="get-all-investigation__list-item-title">{investigation.title}</h3>
                            <p className="get-all-investigation__list-item-author">
                                Autor: {investigation.author || "No especificado"}
                            </p>
                            <p className="get-all-investigation__list-item-date">
                                📅 {new Date(investigation.date).toLocaleDateString()}
                            </p>

                            <div className="get-all-investigation__list-item-description" dangerouslySetInnerHTML={{__html:investigation.description.length > 250 ? investigation.description.substring(0, 250) + "..." : investigation.description,}} />

                            <p className="get-all-investigation__list-item-user">
                                Subido por:<img src={investigation.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
                                {investigation.user.regular_user?.name ||
                                    investigation.user.university_user?.name ||
                                    investigation.user.business_user?.name ||
                                    "Anónimo"}
                            </p>
						</div>   
                    </Link>
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};