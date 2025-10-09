import React, { useEffect, useState } from "react";
import { JobBoardGetAllByUserIDResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllJobsBoardByUserID } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllJobBoard.css";

export const GetAllJobsBoardByUserID: React.FC = () => {
    const [jobBoardList, setJobBoardList] = useState<JobBoardGetAllByUserIDResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("jobsBoardPage")) || 1;

    useEffect(() => {
        const getJobBoard = async () => {
            try {
                const data = await getAllJobsBoardByUserID(page, limit);
                setJobBoardList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay ofertas de trabajo disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las ofertas de trabajo");
            }
        }

        getJobBoard();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        searchParams.set("jobsBoardPage", newPage.toString());
        setSearchParams(searchParams);
    };
    return (
        <section className="get-all-job-board">
            <GetAllError message={error}/>
            <div className="get-all-job-board__list">
                {jobBoardList.map((jobBoard) => {
                    let statusLabel = null;
                    if (jobBoard.is_approved === false) {
                        statusLabel = <span className="status-label disapproved">Desaprobado</span>;
                    } else if (jobBoard.is_approved === null) {
                        statusLabel = <span className="status-label pending">En espera de aprobación</span>;
                    }
                    return(
                        <Link to={`/user/job-board/${jobBoard.id}`} state={{ page: page }} key={jobBoard.id} className="get-all-job-board__list-item">
                            <div className="get-all-job-board__image-container">
                                <img src={jobBoard.logo? jobBoard.logo: "/src/assets/img/Logo.jpeg"} alt={jobBoard.title} className="get-all-job-board__list-item-image" />
                            </div>
                            <div className="get-all-job-board__content">
                                <h3 className="get-all-job-board__list-item-title">{jobBoard.title}</h3>
                                <p className="get-all-job-board__list-item-company">
                                    Empresa: {jobBoard.company}
                                </p>

                                <div className="get-all-job-board__list-item-description" dangerouslySetInnerHTML={{__html:jobBoard.description.length > 250 ? jobBoard.description.substring(0, 250) + "..." : jobBoard.description,}} />

                                <p className="get-all-job-board__list-item-user">
                                    Subido por:<img src={jobBoard.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
                                    {jobBoard.user.regular_user?.name ||
                                        jobBoard.user.university_user?.name ||
                                        jobBoard.user.business_user?.name ||
                                        "Anónimo"}
                                </p>
                            </div>
                            {statusLabel && (
                                <div className="get-all-job-board__status">{statusLabel}</div>
                            )}
                        </Link>
                    );
                })}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};