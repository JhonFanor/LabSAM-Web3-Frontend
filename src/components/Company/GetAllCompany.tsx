import React, { useEffect, useState } from "react";
import { CompanyGetAllResponse } from "../../dtos/responses";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAllCompany } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllCompany.css";

export const GetAllCompany: React.FC = () => {
    const [companyList, setCompanyList] = useState<CompanyGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const getCompany = async () => {
            try {
                const data = await getAllCompany(page, limit);
                setCompanyList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay compañias disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las comapñias");
                console.error(err);
            }
        }

        getCompany();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
        navigate(`/company?page=${newPage}`);
    };

    return (
        <section className="get-all-company">
            <GetAllError message={error}/>
            <div className="get-all-company__list">
                {companyList.map((company) => (
                    <Link to={`/company/${company.id}`} key={company.id} className="get-all-company__list-item">
                        <p className="get-all-company__list-item-name">{company.name}</p>
                        <p className="get-all-company__list-item-user">
                            Subido por:{" "}{ company.user.regular_user?.name || company.user.university_user?.name || company.user.business_user?.name || "Anónimo" }
                        </p>
                    </Link>
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};