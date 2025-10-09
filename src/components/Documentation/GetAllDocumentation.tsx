import React, { useEffect, useState } from "react";
import { DocumentationGetAllResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllDocumentation } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllDocumentation.css";

export const GetAllDocumentation: React.FC = () => {
    const [documentationList, setDocumentationList] = useState<DocumentationGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const getDocumentation = async () => {
            try {
                const data = await getAllDocumentation(page, limit);
                setDocumentationList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay Documentacón disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las documentaciones.");
            }
        }

        getDocumentation();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        searchParams.set("page", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-documentation">
            <GetAllError message={error}/>
            <div className="get-all-documentation__list">
                {documentationList.map((documentation) => (
                    <Link to={`/documentation/${documentation.id}`} state={{ page: page }} key={documentation.id} className="get-all-documentation__list-item">
                        <p className="get-all-documentation__list-item-title">{documentation.title}</p>
                        <p className="get-all-documentation__list-item-user">
                            Subido por:{" "}{ documentation.user.regular_user?.name || documentation.user.university_user?.name || documentation.user.business_user?.name || "Anónimo" }
                        </p>
                    </Link>
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};