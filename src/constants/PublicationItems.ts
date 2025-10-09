import { GetAllBankOfResumesByUserID } from "../components";
import { GetAllCompaniesByUserID } from "../components/Company/GetAllCompanyByUserID";
import { GetAllDocumentationsByUserID } from "../components/Documentation/GetAllDocumentationsByUserID";
import { GetAllEducationalOffersByUserID } from "../components/EducationalOffer/GetAllEducationalOffersByUserID";
import { GetAllEventsByUserID } from "../components/Event/GetAllEventsByUserID";
import { GetAllInvestigationsByUserID } from "../components/Investigation/GetAllInvestigationsByUserID";
import { GetAllJobsBoardByUserID } from "../components/JobBoard/GetAllJobsBoardByUserID";
import { GetAllLegislationsByUserID } from "../components/Legislation/GetAllLegislationsByUserID";
import { GetAllNewsByUserID } from "../components/News/GetAllNewsByUserID";

type PublicationItem = {
    name: string;
    label: string;
    component: React.ElementType;
};

export const publicationItems: PublicationItem[] = [
    {
        name: "news",
        label: "Noticias",
        component: GetAllNewsByUserID,
    },
    {
        name: "events",
        label: "Eventos",
        component: GetAllEventsByUserID,
    },
    {
        name: "investigations",
        label: "Investigaciones",
        component: GetAllInvestigationsByUserID,
    },
    {
        name: "jobsBoard",
        label: "Bolsa de empleos",
        component: GetAllJobsBoardByUserID,
    },
    {
        name: "bankOfResumes",
        label: "Hojas de vida",
        component: GetAllBankOfResumesByUserID,
    },
    {
        name: "companies",
        label: "Empresas",
        component: GetAllCompaniesByUserID, 
    },
    {
        name: "educationalOffers",
        label: "Ofertas educativas",
        component: GetAllEducationalOffersByUserID, 
    },
    {
        name: "legislations",
        label: "Legislaciones",
        component: GetAllLegislationsByUserID,
    },
    {
        name: "documentations",
        label: "Documentaciones",
        component: GetAllDocumentationsByUserID,
    },
];