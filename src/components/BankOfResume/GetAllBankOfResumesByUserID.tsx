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
    const page = Number(searchParams.get("page")) || 1;

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
                {bankOfResumeList.map((BankOfResume) => (
                    <Link to={`/bank-of-resume/${BankOfResume.id}`} key={BankOfResume.id} className="get-all-bank-of-resume__list-item">
                        <img src={BankOfResume.photo} alt={BankOfResume.user.regular_user?.name} className="get-all-bank-of-resume__list-item-photo"/>
                        <p className="get-all-bank-of-resume__list-item-title">{BankOfResume.title}</p>
                        <p className="get-all-bank-of-resume__list-item-user">{BankOfResume.user.regular_user?.name || "Anónimo"}</p>
                    </Link>
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};