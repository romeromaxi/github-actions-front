export enum ProductTemplates {
    Financing = 1,
    GuaranteesNotLoans = 2,
    GuaranteesLoans = 3,
    Leasing = 4,
    OtherServices = 5,
    AccountPyme = 6,
}

export enum ProductLineRequisiteType {
    Province = 1,
    Amount = 2,
    ClassificationSepyme = 3,
    ActivitySector = 4,
    Seniority = 5,
    Gender = 6,
    TaxCondition = 7,
    SocialOrEnvironmentalImpact = 8,
    Scoring = 9,
    DebtSituation = 10
}

export enum ProductRateType {
    Fixed = 1,
    Variable = 2,
    Mixed = 3,
}

export enum ProductLineTemplateType {
    Financing = 1,
    NotLoanGuarantee = 2,
    LoanGuaranteeOld = 3,
    LeasingOld = 4,
    OtherServices = 5,
    PymeAccount = 6,

    DocumentDiscounting = 7,
    LoanGuarantee = 8,
    Loans = 9,
    OtherLines = 10,
    Leasing = 11,
}

export enum ProductLineStatesType {
    Created = 1,
    PublicationRequest = 2,
    ApprovedPublication = 3,
    Published = 4,
    UnsubscribePublication = 5,
    DisablePublishing = 6,
    PublishedInModification = 7,
}

export enum ProductLineInstrumentTypes {
    DiscountCheck = 8,
    DiscountOtherInstruments = 9,
    TermLoans = 10,
    DebtIssuance = 11,
    Cards = 12,
    AccountOpenings = 13,
    SuretyInsurance = 14,
    Leasing = 15,
}

export enum ProductLineFieldSelectIds {
    Currency = 1,
    AmortizationTypes = 12,
    CheckIssuer = 19,
    CheckTypes = 20,
    CurrencyMultiple = 21,
    AmortizationTypesMultiple = 22,
    RatesTypesMultiple = 23,
    AssetsTypesMultiple = 24,
}

export enum ProductLineFieldTypes {
    Text = 1,
    Currency = 2,
    Date = 3,
    Percentage = 4,
    RateType = 5,
    Select = 6,
    SelectMultiple = 7,
}

export enum ProductLineFieldFormats {
    Input = 1,
    Select = 2,
    SelectMultiple = 3,
    Range = 4,
    GracePeriod = 5,
    RateMultiple = 6,
}

export enum ProductLineFieldDataTypes {
    Text = 1,
    Number = 2,
    Currency = 3,
    Percentage = 4,
    Date = 5,
}

export enum ProductLineApprovalResultType {
    Pendant = 1,
    Approved = 2,
    Rejected = 3,
}


export enum ProductLineMaskType {
    Value = 1,
    ValueMin = 2,
    ValueMax = 3,
    Range = 4,
    DescriptionListed = 5
}
