import { countBankOfResumesNotApproved, countCompaniesNotApproved, countDocumentationsNotApproved, countEducationalOffersNotApproved, countEventsNotApproved, countInvestigationsNotApproved, countJobsBoardNotApproved, countLegislationsNotApproved, countNewsNotApproved } from "../api";
import { GetAllBankOfResumesNotApproved } from "../components";
import { GetAllCompaniesNotApproved } from "../components/Company/GetAllCompanyNotApproved";
import { GetAllDocumentationsNotApproved } from "../components/Documentation/GetAllDocumentationsNotApproved";
import { GetAllEducationalOffersNotApproved } from "../components/EducationalOffer/GetAllEducationalOffersNotApproved";
import { GetAllEventsNotApproved } from "../components/Event/GetAllEventsNotApproved";
import { GetAllInvestigationsNotApproved } from "../components/Investigation/GetAllInvestigationsNotApproved";
import { GetAllJobsBoardNotApproved } from "../components/JobBoard/GetAllJobsBoardNotApproved";
import { GetAllLegislationsNotApproved } from "../components/Legislation/GetAllLegislationsNotApproved";
import { GetAllNewsNotApproved } from "../components/News/GetAllNewsNotApproved";

type ApprovalItem = {
    name: string;
    label: string;
    fetchFn: (...args: any[]) => Promise<any>;
    component: React.ElementType;
};

export const approvalItems: ApprovalItem[] = [
    {
        name: "news",
        label: "Noticias",
        fetchFn: countNewsNotApproved,
        component: GetAllNewsNotApproved,
    },
    {
        name: "events",
        label: "Eventos",
        fetchFn: countEventsNotApproved,
        component: GetAllEventsNotApproved,
    },
    {
        name: "investigations",
        label: "Investigaciones",
        fetchFn: countInvestigationsNotApproved,
        component: GetAllInvestigationsNotApproved,
    },
    {
        name: "jobsBoard",
        label: "Bola de empleos",
        fetchFn: countJobsBoardNotApproved,
        component: GetAllJobsBoardNotApproved,
    },
    {
        name: "bankOfResumes",
        label: "Hojas de vida",
        fetchFn: countBankOfResumesNotApproved,
        component: GetAllBankOfResumesNotApproved,
    },
    {
        name: "companies",
        label: "Empresas",
        fetchFn: countCompaniesNotApproved,
        component: GetAllCompaniesNotApproved, 
    },
    {
        name: "educationalOffers",
        label: "Ofertas educativas",
        fetchFn: countEducationalOffersNotApproved,
        component: GetAllEducationalOffersNotApproved, 
    },
    {
        name: "legislations",
        label: "Legislaciones",
        fetchFn: countLegislationsNotApproved,
        component: GetAllLegislationsNotApproved,
    },
    {
        name: "documentations",
        label: "Documentaciones",
        fetchFn: countDocumentationsNotApproved,
        component: GetAllDocumentationsNotApproved,
    },
];