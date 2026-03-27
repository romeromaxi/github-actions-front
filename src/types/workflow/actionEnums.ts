export enum ApprovalActionTypes {
  NoRequirements = 1,
  RequiresComments = 2,
}

export enum ActionsTypes {
  ElaborateDataAnalysis = 22,
  SendDataAnalysisToApproval = 23,
  ApproveDataAnalysis = 24,
  ReturnToDataAnalysis = 25,
  ElaboratePrequalificationAnalysis = 26,
  SendPrequalificationAnalysisToApproval = 27,
  ApprovePrequalificationAnalysis = 28,
  ReturnToPrequalificationAnalysis = 29,

  ProductLinePublish = 30,
  ProductLineReturnToAdmin = 31,
  ProductLineApprove = 32,
  ProductLineReject = 33,
  ProductLineModify = 34,

  SolicitationsReferralsReceive = 38,
  
  SolicitationApproveReception = 43,
  SolicitationRejectReception =  44,
  
  SendAssistanceAnalysisToApproval = 39,
  ApproveAssistanceAnalysis = 49,
  ReturnToAssistanceAnalysis = 50,
}
