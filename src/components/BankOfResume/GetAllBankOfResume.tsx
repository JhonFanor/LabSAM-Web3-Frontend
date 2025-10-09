import React, { useEffect, useState } from "react";
import { BankOfResumeGetAllResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllBankOfResume } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllBankOfResume.css";

export const GetAllBankOfResume: React.FC = () => {
    const [bankOfResumeList, setBankOfResumeList] = useState<BankOfResumeGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const getBankOfResume = async () => {
            try {
                const data = await getAllBankOfResume(page, limit);
                setBankOfResumeList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay hojas de vida disponibles.");
            } catch (err) {
                setError("No se pudieron cargar los currículos");
            }
        }

        getBankOfResume();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        searchParams.set("page", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-bank-of-resume">
            <GetAllError message={error}/>
            <div className="get-all-bank-of-resume__list">
                {bankOfResumeList.map((BankOfResume) => (
                    <Link to={`/bank-of-resume/${BankOfResume.id}`} state={{ page: page }} key={BankOfResume.id} className="get-all-bank-of-resume__list-item">
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