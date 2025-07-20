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
                console.error(err);
            }
        }

        getJobBoard();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        searchParams.set("jobsBoardPage", newPage.toString());
        setSearchParams({ page: newPage.toString() });
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
                        <Link to={`/user/job-board/${jobBoard.id}`} key={jobBoard.id} className="get-all-job-board__list-item">
                            <p className="get-all-job-board__list-item-title">{jobBoard.title}</p>
                            <p className="get-all-job-board__list-item-company">Empresa: {jobBoard.company}</p>
                            <p className="get-all-job-board__list-item-user">
                                Subido por:{" "}{ jobBoard.user.regular_user?.name || jobBoard.user.university_user?.name || jobBoard.user.business_user?.name || "Anónimo" }
                            </p>
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