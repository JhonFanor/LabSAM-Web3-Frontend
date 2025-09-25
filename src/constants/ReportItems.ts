import { countBankOfResumeBySubtopic, countCompanyBySubtopic, countDocumentationBySubtopic, countEducationalOfferBySubtopic, countEventBySubtopic, countInvestigationBySubtopic, countJobBoardBySubtopic, countLegislationBySubtopic, countNewsBySubtopic } from "../api";
import { SubtopicCountResponse } from "../dtos/responses/SubtopicCount";

type ApiFunction = () => Promise<SubtopicCountResponse[]>;

type ReportItem = {
    name: string;
    label: string;
    api: ApiFunction;
};

export const reportItems: ReportItem[] = [
    {
        name: "news",
        label: "Noticias",
        api: countNewsBySubtopic,
    },
    {
        name: "events",
        label: "Eventos",
        api: countEventBySubtopic,
    },
    {
        name: "investigations",
        label: "Investigaciones",
        api: countInvestigationBySubtopic,
    },
    {
        name: "jobsBoard",
        label: "Bolsa de empleo",
        api: countJobBoardBySubtopic,
    },
    {
        name: "bankOfResumes",
        label: "Hojas de vida",
        api: countBankOfResumeBySubtopic,
    },
    {
        name: "companies",
        label: "Empresas",
        api: countCompanyBySubtopic, 
    },
    {
        name: "educationalOffers",
        label: "Ofertas educativas",
        api: countEducationalOfferBySubtopic, 
    },
    {
        name: "legislations",
        label: "Legislaciones",
        api: countLegislationBySubtopic,
    },
    {
        name: "documentations",
        label: "Documentaciones",
        api: countDocumentationBySubtopic,
    },
];