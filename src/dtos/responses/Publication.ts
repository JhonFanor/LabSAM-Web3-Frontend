import { NewsGetAllResponse } from "./News";
import { EventGetAllResponse } from "./Event";
import { InvestigationGetAllResponse } from "./Investigation";
import { JobBoardGetAllResponse } from "./JobBoard";
import { BankOfResumeGetAllResponse } from "./BankOfResume";
import { CompanyGetAllResponse } from "./Company";
import { EducationalOfferGetAllResponse } from "./EducationalOffer";
import { LegislationGetAllResponse } from "./Legislation";
import { DocumentationGetAllResponse } from "./Documentation";

export type PublicationType =
  | "news"
  | "event"
  | "investigation"
  | "job_board"
  | "bank_of_resume"
  | "company"
  | "educational_offer"
  | "legislation"
  | "documentation";

export interface PublicationsResponse {
  resource_type: PublicationType;
  data:
    | NewsGetAllResponse
    | EventGetAllResponse
    | InvestigationGetAllResponse
    | JobBoardGetAllResponse
    | BankOfResumeGetAllResponse
    | CompanyGetAllResponse
    | EducationalOfferGetAllResponse
    | LegislationGetAllResponse
    | DocumentationGetAllResponse;
}
