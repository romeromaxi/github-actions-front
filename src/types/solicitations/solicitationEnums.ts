export enum SolicitationGroupBy {
    Line,
    Pyme,
    State,
}

export enum SolicitationTypes {
    None = 0,
    General = 1, // Flujo General
    Matcher = 2, // Busquedas Asistidas
    Orienteer = 3, // Orientador
    BetweenOfferers = 4
}

export enum SolicitationOffererStatusType {
    Received = 3,
    InAnalysis = 5,
    AnalysisApproval = 6,
    PrequalificationAble = 11,
    PrequalificationAnalyisis = 12,
    PrequalificationApproval = 13,
    PrequalificationReceived = 14,
    Denied = 15,
    Cancelled = 16,
    TimedOut = 17,
    PrequalificationAbleAux = 7,
    PrequalificationAbleAux2 = 8,

    SolicitationReception = 24,
    SolicitationReceivedMatcher = 35,
    SolicitationReceptionApproval = 30,
    Derivation = 25,
    SolicitationAssistanceApproval = 36,
    SolicitationResponseMatcher = 28,
    SolicitationUnableDerivation = 29,
    SolicitationInstrumentation = 32,

    SolicitationSGRResponse = 26, // Inactive
    SolicitionPymeResponse = 27, // Inactive
    SolicitationCancelledAssistedSearch = 48,

    // Orientador
    SolicitationReceptionOrienteer = 39,
    SolicitationReceivedOrienteer = 46,
    SolicitationReceptionApprovalOrienteer = 43,
    DerivationOrienteer = 40,
    SolicitationAssistanceApprovalOrienteer = 47,
    SolicitationResponseOrienteer = 41,
    SolicitationUnableOrienteer = 42,
    SolicitationCancelledOrienteer = 50,

    // Consulta de Derivacion
    SolicitationBetweenOfferersReception = 53,
    SolicitationBetweenOfferersAcceptedDerivation = 54,
    SolicitationBetweenOfferersRejectedDerivation = 55,
    AwaitingConfirmationDerivation = 57

}

export enum SolicitationStatusType {
    ReadyToSend = 1,
    CanceledInCart = 2,
    AptPrequalification = 8, //Unused
    Prequalified = 10,
    PrequalificationAble = 11,//Unused

    // Company Side - General 
    GeneralCompanySent = 7,
    GeneralCompanyUnderReview = 9,
    GeneralCompanyProposed = 10,
    GeneralCompanyCancelled = 18,
    GeneralCompanyExpired = 19,
    GeneralCompanyNotAdmitted = 20,
    GeneralCompanyAdmissionDerivation = 56,

    // Company Side - AssistedSearch 
    AssistedSearchCompanyCompleted = 22,
    AssistedSearchCompanyNotAdmitted = 23,
    AssistedSearchCompanySent = 33,
    AssistedSearchCompanyInProgress = 34,
    AssistedSearchCompanyCancelled = 49,

    // Company Side - Orienteer 
    OrienteerCompanySent = 44,
    OrienteerCompanyInProgress = 45,
    OrienteerCompanyCompleted = 37,
    OrienteerCompanyNotAdmitted = 38,
    OrienteerCompanyCancelled = 51,

    SolicitationReception = 24,
    InstrumentationPyme = 31,
    OrienteerDerivationConsultationInAnalysis = 52,
    AdmissionDerivation = 56,

    // Offerer Side - General
    GeneralOffererSolicitationIncoming = 3,
    GeneralOffererAdmission = 5,
    GeneralOffererAdmissionApproval = 6,

    GeneralOffererPrequalificationAnalyisis = 12,
    GeneralOffererPrequalificationApproval = 13,
    GeneralOffererPrequalifieds = 14,

    GeneralOffererDenied = 15,
    GeneralOffererCancelled = 16,
    GeneralOffererExpired = 17,
    GeneralOffererDismiss = 59,
    
    // Offerer Side - AssistedSearch
    AssistedSearchOffererSolicitationIncoming = 35,
    AssistedSearchOffererReceptionApproval = 30,
    AssistedSearchOffererDerivation = 25,
    AssistedSearchOffererCompleted = 28,
    AssistedSearchOffererUnableDerivation = 29,
    AssistedSearchOffererCancelled = 48,

    // Offerer Side - BetweenOfferers
    BetweenOfferersReception = 53,
    BetweenOfferersAcceptedDerivation = 54,
    BetweenOfferersRejectedDerivation = 55,
    BetweenOfferersAwaitingConfirmation = 57,
    SolicitationReceptionOrienteer = 39,
}

export enum SolicitationClassificationStatusTypes {
    Sent = 2,
    UnderReview = 3
}

export enum SolicitationClassificationStatusType {
    //InCart = 1,

    UnderReview = 3,
    
    ReceivedAssistedSearch = 9,
    AssistanceAssistedSearch = 10,
    TrackingAssistedSearch = 12,

    Cancelled = 14,
    NotAccepted = 15,
    Received = 16,
    Pending = 17,
    InProgress = 18,
    Proposal = 19,
    Dismiss = 20
}

export enum SolicitationClassificationTypesStatusType {
    InCart = 1,
    Active = 2,
    Prequalified = 3,
    Denied = 4,
    Cancelled = 5
}

export enum SolicitationAlertType {
    WithoutAlert = 0,
    NewMessage = 1,
    NewDocument = 2,
    NewMessageAndNewDocument = 3,
}

export enum SolicitationApprovalResultType {
    Pendant = 1,
    Approved = 2,
    Rejected = 3,
}

export enum SolicitationAccessStateTypeCodes {
    Received = 1,
    Open = 2,
    Interested = 3,
    NotInterested = 4
}

export enum SolicitationOffererTabs {
    AdmissionProposal,
    AdmissionApproval,
    AdmissionOutcome,
    Admission,
    PrequalificationProposal,
    PrequalificationApproval,
    PrequalificationOutcome,
    Prequalification,
    Instrumentation,
    ReceptionProposal,
    ReceptionApproval,
    ReceptionOutcome,
    Reception,
    AssistanceClosingProposal,
    AssistanceClosingApproval,
    AssistanceClosingOutcome,
    Assistance,
    AssistanceClosing,
    TrackingInstrumentation
}

export enum SolicitationProposedApprovalFlowTypes {
    AdmissionReception,
    SendingResults
}

export enum SolicitationNoteRelatedDataTypes {
    AdmissionProposal = 1,
    AdmissionApproval = 2,
    PrequalificationProposal = 3,
    PrequalificationApproval = 4,
}