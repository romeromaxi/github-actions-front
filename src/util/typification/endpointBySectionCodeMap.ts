import {
    HttpFilesCompany,
    HttpFilesCompanyDeclarationAssets,
    HttpFilesCompanyFinancialYear,
    HttpFilesCompanyRelationship, HttpFilesOfferer
} from "http/index";
import {FileBase} from "types/files/filesData";
import { Sections } from "types/general/generalEnums";
import {HttpFilesClientPortfolio} from "../../http/files/httpFilesClientPortfolio";

type FileUploadFunction = (
    id: number | string,
    fileBase: FileBase,
    file: File,
    relatedId?: number
) => Promise<number>;

export const getEndpointBySectionCodeMap : Record<Sections, FileUploadFunction> = {
    [Sections.CompanyLegal]: (companyId, fileCompany, file, relatedId) => HttpFilesCompany.insert(companyId, fileCompany, file),
    [Sections.Activity]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.DischargeBCRA]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.DischargeContributions]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.DischargeChecks]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.DischargeScore]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.FinancialYear]: (companyId, fileCompany, file, relatedId) => HttpFilesCompanyFinancialYear.insert(companyId, relatedId ?? 0, fileCompany, file),
    [Sections.PostClosingMovementsCompanyLegal]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.RelatedPerson]: (companyId, fileCompany, file, relatedId) => HttpFilesCompanyRelationship.insert(companyId, relatedId ?? 0, fileCompany, file),
    [Sections.CompanyPhysical]: (companyId, fileCompany, file, relatedId) => HttpFilesCompany.insert(companyId, fileCompany, file),
    [Sections.Certifications]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.Affidavit]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.DeclarationOfAssets]: (companyId, fileCompany, file, relatedId) => HttpFilesCompanyDeclarationAssets.insert(companyId, relatedId ?? 0, fileCompany, file),
    [Sections.Solicitations]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.PostClosingMovementsCompanyPhysical]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.PublicBases]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.Presentations]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.PresentationsTemplates]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.ProductLine]: (companyId, fileCompany, file, relatedId) => Promise.resolve(0),
    [Sections.Offerer]: (offererId, fileOfferer, file, relatedId) => HttpFilesOfferer.insert(offererId, fileOfferer, file),
    [Sections.ClientPortfolio]: (clientPortfolioGuid, fileOfferer, file, relatedId) => HttpFilesClientPortfolio.insert(clientPortfolioGuid, fileOfferer, file),
};