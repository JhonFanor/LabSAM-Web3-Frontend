import React, { useEffect, useState } from "react";


import { PublicationsResponse } from "../../dtos/responses/Publication";
import { getAllPublications } from "../../api/PublicationsApi";
import { NewsItem } from "./NewsItem";
import { EventItem } from "./EventItem";
import { BankOfResumeItem } from "./BankOfResumeItem";
import { CompanyItem } from "./CompanyItem";
import { DocumentationItem } from "./DocumentationItem";
import { EducationalOfferItem } from "./EducationalOfferItem";
import { InvestigationItem } from "./InvestigationItem";
import { JobBoardItem } from "./JobBoardItem";
import { LegislationItem } from "./LegislationItem";
import { BankOfResumeGetAllResponse, CompanyGetAllResponse, DocumentationGetAllResponse, EducationalOfferGetAllResponse, EventGetAllResponse, InvestigationGetAllResponse, JobBoardGetAllResponse, LegislationGetAllResponse, NewsGetAllResponse } from "../../dtos/responses";
import "./PublicationSection.css";

const PublicationsSection: React.FC = () => {
    const [publications, setPublications] = useState<PublicationsResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublications = async () => {
        try {
            const data = await getAllPublications();
            setPublications(data);
        } catch (err: any) {
            setError(err.message || "Error al obtener publicaciones");
        } finally {
            setLoading(false);
        }
        };

        fetchPublications();
    }, []);

    if (loading) return <p>Cargando publicaciones...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="publications__container">
            <h2>Publicaciones</h2>
            <div className="publications-section">
            {publications.map((pub, index) => {
                switch (pub.resource_type) {
                case "news":
                    return <NewsItem key={index} news={pub.data as NewsGetAllResponse} />;
                case "event":
                    return <EventItem key={index} event={pub.data as EventGetAllResponse} />;
                case "bank_of_resume":
                    return <BankOfResumeItem key={index} resume={pub.data as BankOfResumeGetAllResponse} />;
                case "company":
                    return <CompanyItem key={index} company={pub.data as CompanyGetAllResponse} />;
                case "documentation":
                    return <DocumentationItem key={index} documentation={pub.data as DocumentationGetAllResponse} />;
                case "educational_offer":
                    return <EducationalOfferItem key={index} educationalOffer={pub.data as EducationalOfferGetAllResponse} />;
                case "investigation":
                    return <InvestigationItem key={index} investigation={pub.data as InvestigationGetAllResponse} />;
                case "job_board":
                    return <JobBoardItem key={index} job={pub.data as JobBoardGetAllResponse} />;
                case "legislation":
                    return <LegislationItem key={index} legislation={pub.data as LegislationGetAllResponse} />;
                default:
                    return null;
                }
            })}
            </div>
        </div>
  );
};

export default PublicationsSection;
