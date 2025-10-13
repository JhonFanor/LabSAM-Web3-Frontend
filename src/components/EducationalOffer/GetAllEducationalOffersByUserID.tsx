import React, { useEffect, useState } from "react";
import { EducationalOfferGetAllByUserIDResponse } from "../../dtos/responses";
import { Link, useSearchParams } from "react-router-dom";
import { getAllEducationalOffersByUserID } from "../../api";
import { Pagination, GetAllError } from "../../components";
import "./GetAllEducationalOffer.css";
import imagePage from "../../assets/img/Logo.jpeg"

export const GetAllEducationalOffersByUserID: React.FC = () => {
    const [educationalOfferList, setEducationalOfferList] = useState<EducationalOfferGetAllByUserIDResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("educationalOffersPage")) || 1;

    useEffect(() => {
        const getEducationaOffer = async () => {
            try {
                const data = await getAllEducationalOffersByUserID(page, limit);
                setEducationalOfferList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay Ofertas Educativas disponibles.");
            } catch (err) {
                setError("No se pudieron cargar las Ofertas Educativas");
            }
        }

        getEducationaOffer();
    }, [page]); 

    const handlePageChange = (newPage: number) => {
        searchParams.set("educationalOffersPage", newPage.toString());
        setSearchParams(searchParams);
    };

    return (
        <section className="get-all-educational-offer">
            <GetAllError message={error}/>
            <div className="get-all-educational-offer__list">
                {educationalOfferList.map((educationalOffer) => {
                    let statusLabel = null;
                    if (educationalOffer.is_approved === false) {
                        statusLabel = <span className="status-label disapproved">Desaprobado</span>;
                    } else if (educationalOffer.is_approved === null) {
                        statusLabel = <span className="status-label pending">En espera de aprobación</span>;
                    }
                    return(
                        <Link to={`/user/educational-offer/${educationalOffer.id}`} state={{ page: page }} key={educationalOffer.id} className="get-all-educational-offer__list-item">
                            <div className="get-all-educational-offer__image-container">
                                <img src={educationalOffer.logo? educationalOffer.logo: imagePage} alt={educationalOffer.title} className="get-all-educational-offer__list-item-image" />
                            </div>
                            <div className="get-all-educational-offer__content">
                                <p className="get-all-educational-offer__list-item-title">{educationalOffer.title}</p>
                                <p className="get-all-educational-offer__list-item-dates">
                                    Duración: {new Date(educationalOffer.start_date).toLocaleDateString()} - {new Date(educationalOffer.end_date).toLocaleDateString()}
                                </p>
                                <p className="get-all-educational-offer__list-item-cost">
                                    Costo: {educationalOffer.currency_type.symbol}{educationalOffer.cost} {educationalOffer.currency_type.code}
                                </p>
                                <p className="get-all-educational-offer__list-item-dates">
                                    Tipo de educación: {educationalOffer.type_education.name}
                                </p>

                                <div className="get-all-educational-offer__list-item-description" dangerouslySetInnerHTML={{__html:educationalOffer.description.length > 250 ? educationalOffer.description.substring(0, 250) + "..." : educationalOffer.description,}} />

                                <p className="get-all-educational-offer__list-item-user">
                                    Subido por:<img src={educationalOffer.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
                                    {educationalOffer.user.regular_user?.name ||
                                        educationalOffer.user.university_user?.name ||
                                        educationalOffer.user.business_user?.name ||
                                        "Anónimo"}
                                </p>
                            </div>
                            {statusLabel && (
                                <div className="get-all-educational-offer__status">{statusLabel}</div>
                            )}
                        </Link>
                    )
                })}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};