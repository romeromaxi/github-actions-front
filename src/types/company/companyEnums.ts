export enum CompanyTypes {
  SA = 1,
  SRL = 2,
}

export enum CompanyUserRoleTypes {
  ResponsibleAFIP = 1,
  Administrator = 2,
  Operator = 3,
  Reading = 4,
}

export enum PersonRelationshipTypeClassification {
  Society = 1,
  Administrators = 2,
  Representatives = 3,
  Responsibles = 4,
  Authorities = 5,
  Employees = 6,
  Others = 7,
  Spouses = 8,
}

export enum CompanyFileType {
  None = 0,
  Short = 1,
  Long = 2,
  MatcherCasfog = 3
}

export enum CompanyFileSourceType {
  Company = 'company',
  CompanyFile = 'companyFile',
}

export enum CompanyUserValidationTypes {
  Active = 1,
  PendingBond = 2,
  PendingApproval = 3,
  Blocked = 4,
  CAPDocInRevission = 5,
}

export enum CompanyUserState {
  Active = 1,
  PendingProveResponsability = 2,
  PendingVerificationByAFIPResponsible = 3,
  Blocked = 4,
  PendingVerificationByCAP = 5,
  WaitAssignmentDefinitiveRole = 6,
}

export enum CompanyUserStateClassification {
  TemporaryAccessMarket = 1,
  Verified = 2,
}

export enum CompanyUserRelationshipTypes {
  AfipResponsible = 1,
  Admin = 2,
  Operator = 3,
  Visualizer = 4,
  MarketOperator = 5,
  TemporalRelationship = 6,
}


export enum CompanyUserBondTypes {
  Responsible = 1,
  Accountant = 2,
  Employee = 3,
  Another = 4,
  FinancialAdvisor = 5
}