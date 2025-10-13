import React, { useEffect, useState } from "react";
import { CompanyGetAllResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllCompaniesNotApproved } from "../../api";
import { Pagination, GetAllError } from "..";
import imagePage from "../../assets/img/Logo.jpeg"

import "./GetAllCompany.css";

export const GetAllCompaniesNotApproved: React.FC = () => {
    const [companyList, setCompanyList] = useState<CompanyGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("companiesPage")) || 1;

    useEffect(() => {
        const getCompany = async () => {
            try {
                const data = await getAllCompaniesNotApproved(page, limit);
                setCompanyList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay empresas disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las comapñias"+err);
            }
        }

        getCompany();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        searchParams.set("companiesPage", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-company">
            <GetAllError message={error}/>
            <div className="get-all-company__list">
                {companyList.map((company) => (
                    <Link to={`/admin/company/${company.id}`} state={{ page: page }} key={company.id} className="get-all-company__list-item">
                        <p className="get-all-company__list-item-name">{company.name}</p>
                         <img src={company.logo? company.logo:imagePage} alt={company.name} className="get-all-company__list-item-photo"/>
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