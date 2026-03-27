export const ROOT_FOLDER_NAME = "Carpetas Personalizadas"

export enum AddressTypes {
  Fiscal = 1,
  Legal = 2,
  Real = 3,
  Activity = 4,
  ActivityMain = 5,
}

export enum PhoneType {
  CellPhone = 1,
  Landline = 2,
}

export enum MailTypes {
  Main = 1,
  Documentation = 2,
  Notifications = 3,
}

export enum EnumColors {
  BLUE,
  GREEN,
  LIGHTBLUE,
  RED,
  GREY,
  WHITE,
  BLACK,
  LUC_GRADIENT = 7,
  YELLOW = 8,
  LIGHT_GREY = 10,
  GREY_GRADIENT = 11,
  MARKET_BLUE = 12,
}

export enum Sections {
  CompanyLegal = 1,
  Activity = 2,
  DischargeBCRA = 3,
  DischargeContributions = 4,
  DischargeChecks = 5,
  DischargeScore = 6,
  FinancialYear = 7,
  PostClosingMovementsCompanyLegal = 8,
  RelatedPerson = 9,
  CompanyPhysical = 10,
  Certifications = 11,
  Affidavit = 12,
  DeclarationOfAssets = 13,
  Solicitations = 14,
  PostClosingMovementsCompanyPhysical = 15,
  PublicBases = 16,
  Presentations = 17,
  PresentationsTemplates = 18,
  ProductLine = 19,
  Offerer = 20,
  ClientPortfolio = 21
}

export enum SituationTypeCodes {
  Unknown = 0,
  Normal = 1,
  Following = 2,
  WithIssues = 3,
  WithRisk = 4,
  Unrecoverable = 5,
  TechnicallyUnrecoverable = 6,
}

export enum SolicitationClassificationTypeCode {
  Received = 1,
  Active = 2,
  Denied = 3,
  Cancelled = 4,
  TimedOut = 5,
}

export enum ContributionStatus {
  Paid = 'Pago',
  Partial = 'PagoParcial',
  Unpaid = 'Impago',
}

export enum CivilStateTypeCode {
  Single = 1,
  Married = 2,
  Divorced = 3,
  Separate = 4,
  Widower = 5
}

export enum FinancialYearStatus {
    Created = 1,
    Processing = 2,
    ProcessedSuccessfully = 3,
    ProcessedFailed = 4
}

export enum ModuleCodes {
    Security = 1,
    RelatedEntities = 2,
    FinancialStatements = 3,
    Documentation = 4,
    Solicitation = 5,
    BaseCUITs = 6,
    UserRegistration = 7,
    OCR = 8,
    CompanyRegistration = 9,
    AutomaticJobs = 10,
    OffererRegistration = 11
}