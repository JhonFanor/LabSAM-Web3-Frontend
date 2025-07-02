import React, { useEffect, useState } from "react";
import { EducationalOfferGetAllResponse } from "../../dtos/responses/EducationalOffer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAllEducationalOffer } from "../../api/EducationalOfferApi";
import { Pagination } from "../Pagination/Pagination";
import "./GetAllEducationalOffer.css";
import { GetAllError } from "../Error/GetAll";

export const GetAllEducationalOffer: React.FC = () => {
    const [educationalOfferList, setEducationalOfferList] = useState<EducationalOfferGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const getEducationaOffer = async () => {
            try {
                const data = await getAllEducationalOffer(page, limit);
                setEducationalOfferList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay Ofertas Educativas disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las Ofertas Educativas");
                console.error(err);
            }
        }

        getEducationaOffer();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
        navigate(`/educational-offer?page=${newPage}`);
    };

    return (
        <section className="get-all-educational-offer">
            <GetAllError message={error}/>
            <div className="get-all-educational-offer__list">
                {educationalOfferList.map((educationalOffer) => (
                    <Link to={`/educational-offer/${educationalOffer.id}`} key={educationalOffer.id} className="get-all-educational-offer__list-item">
                        <p className="get-all-educational-offer__list-item-title">{educationalOffer.title}</p>
                        <p className="get-all-educational-offer__list-item-dates">
                            Duración: {new Date(educationalOffer.start_date).toLocaleDateString()} - {new Date(educationalOffer.end_date).toLocaleDateString()}
                        </p>
                        <p className="get-all-educational-offer__list-item-cost">
                            Costo: {educationalOffer.cost}
                        </p>
                        <p className="get-all-educational-offer__list-item-user">
                            Subido por:{" "}{ educationalOffer.user.regular_user?.name || educationalOffer.user.university_user?.name || educationalOffer.user.business_user?.name || "Anónimo" }
                        </p>
                    </Link>
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};