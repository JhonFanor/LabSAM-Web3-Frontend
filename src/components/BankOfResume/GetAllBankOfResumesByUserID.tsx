import React, { useEffect, useState } from "react";
import { BankOfResumeGetAllByUserIDResponse } from "../../dtos/responses";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAllBankOfResumesByUserID } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllBankOfResume.css";

export const GetAllBankOfResumesByUserID: React.FC = () => {
    const [bankOfResumeList, setBankOfResumeList] = useState<BankOfResumeGetAllByUserIDResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = Number(searchParams.get("bankOfResumesPage")) || 1;

    useEffect(() => {
        const getBankOfResume = async () => {
            try {
                const data = await getAllBankOfResumesByUserID(page, limit);
                setBankOfResumeList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay hojas de vida disponibles.");
            } catch (err) {
                setError("No se pudieron cargar los currículos");
                console.error(err);
            }
        }

        getBankOfResume();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
        navigate(`/bank-of-resume/user/me?page=${newPage}`);
    };

    return (
        <section className="get-all-bank-of-resume">
            <GetAllError message={error}/>
            <div className="get-all-bank-of-resume__list">
                {bankOfResumeList.map((bankOfResume) => {
                    let statusLabel = null;
                    if (bankOfResume.is_approved === false) {
                        statusLabel = <span className="status-label disapproved">Desaprobado</span>;
                    } else if (bankOfResume.is_approved === null) {
                        statusLabel = <span className="status-label pending">En espera de aprobación</span>;
                    }
                    return (
                        <Link to={`/user/bank-of-resume/${bankOfResume.id}`} key={bankOfResume.id} className="get-all-bank-of-resume__list-item">
                            <img src={bankOfResume.photo} alt={bankOfResume.user.regular_user?.name} className="get-all-bank-of-resume__list-item-photo"/>
                            <p className="get-all-bank-of-resume__list-item-title">{bankOfResume.title}</p>
                            <p className="get-all-bank-of-resume__list-item-user">{bankOfResume.user.regular_user?.name || "Anónimo"}</p>
                            {statusLabel && (
                                <div className="get-all-bank-of-resume__status">{statusLabel}</div>
                            )}
                        </Link>
                    );
                })}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};