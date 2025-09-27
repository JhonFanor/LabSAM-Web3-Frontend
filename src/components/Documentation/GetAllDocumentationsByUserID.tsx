import React, { useEffect, useState } from "react";
import { DocumentationGetAllByUserIDResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllDocumentationsByUserID } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllDocumentation.css";

export const GetAllDocumentationsByUserID: React.FC = () => {
    const [documentationList, setDocumentationList] = useState<DocumentationGetAllByUserIDResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("documentationsPage")) || 1;

    useEffect(() => {
        const getDocumentation = async () => {
            try {
                const data = await getAllDocumentationsByUserID(page, limit);
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
        searchParams.set("documentationsPage", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-documentation">
            <GetAllError message={error}/>
            <div className="get-all-documentation__list">
                {documentationList.map((documentation) => {
                    let statusLabel = null;
                    if (documentation.is_approved === false) {
                        statusLabel = <span className="status-label disapproved">Desaprobado</span>;
                    } else if (documentation.is_approved === null) {
                        statusLabel = <span className="status-label pending">En espera de aprobación</span>;
                    }
                    return(
                        <Link to={`/user/documentation/${documentation.id}`} key={documentation.id} className="get-all-documentation__list-item">
                            <p className="get-all-documentation__list-item-title">{documentation.title}</p>
                            <p className="get-all-documentation__list-item-user">
                                Subido por:{" "}{ documentation.user.regular_user?.name || documentation.user.university_user?.name || documentation.user.business_user?.name || "Anónimo" }
                            </p>
                            {statusLabel && (
                                <div className="get-all-bank-of-resume__status">{statusLabel}</div>
                            )}
                        </Link>
                    )
                })}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};