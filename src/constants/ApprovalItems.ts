import { countBankOfResumesNotApproved, countCompaniesNotApproved, countDocumentationsNotApproved, countEducationalOffersNotApproved } from "../api";
import { GetAllBankOfResumesNotApproved } from "../components";
import { GetAllCompaniesNotApproved } from "../components/Company/GetAllNewsNotApproved";
import { GetAllDocumentationsNotApproved } from "../components/Documentation/GetAllDocumentationsNotApproved";
import { GetAllEducationalOffersNotApproved } from "../components/EducationalOffer/GetAllEducationalOffersNotApproved";

type ApprovalItem = {
  name: string;
  label: string;
  fetchFn: (...args: any[]) => Promise<any>;
  component: React.ElementType;
};

export const approvalItems: ApprovalItem[] = [
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
    name: "documentations",
    label: "Documentaciones",
    fetchFn: countDocumentationsNotApproved,
    component: GetAllDocumentationsNotApproved,
  },
];