import {
    SolicitationOffererStatusType,
    SolicitationOffererTabs,
    SolicitationTypes
} from "types/solicitations/solicitationEnums";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";

const activeStateByTabMap : Record<SolicitationOffererTabs, SolicitationOffererStatusType[]> = {
    [SolicitationOffererTabs.AdmissionProposal]: [SolicitationOffererStatusType.InAnalysis],
    [SolicitationOffererTabs.AdmissionApproval]: [SolicitationOffererStatusType.AnalysisApproval],
    [SolicitationOffererTabs.AdmissionOutcome]: [SolicitationOffererStatusType.PrequalificationAnalyisis],
    [SolicitationOffererTabs.Admission]: [],
    
    [SolicitationOffererTabs.PrequalificationProposal]: [SolicitationOffererStatusType.PrequalificationAnalyisis],
    [SolicitationOffererTabs.PrequalificationApproval]: [SolicitationOffererStatusType.PrequalificationApproval],
    [SolicitationOffererTabs.PrequalificationOutcome]: [],
    [SolicitationOffererTabs.Prequalification]: [SolicitationOffererStatusType.PrequalificationReceived],
    
    [SolicitationOffererTabs.Instrumentation]: [],
    
    [SolicitationOffererTabs.ReceptionProposal]: [
        SolicitationOffererStatusType.Received,
        SolicitationOffererStatusType.SolicitationReception,
        SolicitationOffererStatusType.SolicitationReceivedMatcher,
        SolicitationOffererStatusType.SolicitationReceptionOrienteer
    ],
    [SolicitationOffererTabs.ReceptionApproval]: [
        SolicitationOffererStatusType.SolicitationReceptionApproval,
        SolicitationOffererStatusType.SolicitationReceptionApprovalOrienteer
    ],
    [SolicitationOffererTabs.ReceptionOutcome]: [
        SolicitationOffererStatusType.Derivation, 
        SolicitationOffererStatusType.DerivationOrienteer, 
        //SolicitationOffererStatusType.SolicitationAssistanceApproval,
        //SolicitationOffererStatusType.SolicitationResponseMatcher,
        //SolicitationOffererStatusType.SolicitationUnableDerivation
    ],
    [SolicitationOffererTabs.Reception]: [
        SolicitationOffererStatusType.SolicitationReceivedMatcher,
        SolicitationOffererStatusType.SolicitationReception,
        SolicitationOffererStatusType.SolicitationReceptionApproval,

        SolicitationOffererStatusType.SolicitationReceivedOrienteer,
        SolicitationOffererStatusType.SolicitationReceptionOrienteer,
        SolicitationOffererStatusType.SolicitationReceptionApprovalOrienteer,
    ],
    
    [SolicitationOffererTabs.AssistanceClosingProposal]: [
        SolicitationOffererStatusType.Derivation,
        SolicitationOffererStatusType.DerivationOrienteer
    ],
    [SolicitationOffererTabs.AssistanceClosingApproval]: [
        SolicitationOffererStatusType.SolicitationAssistanceApproval,
        SolicitationOffererStatusType.SolicitationAssistanceApprovalOrienteer
    ],
    [SolicitationOffererTabs.AssistanceClosingOutcome]: [
        SolicitationOffererStatusType.SolicitationResponseMatcher,
        SolicitationOffererStatusType.SolicitationResponseOrienteer
    ],
    [SolicitationOffererTabs.Assistance]: [
        SolicitationOffererStatusType.Derivation,
        SolicitationOffererStatusType.DerivationOrienteer
    ],
    [SolicitationOffererTabs.AssistanceClosing]: [
        SolicitationOffererStatusType.SolicitationAssistanceApproval,
        SolicitationOffererStatusType.SolicitationAssistanceApprovalOrienteer
    ],
    [SolicitationOffererTabs.TrackingInstrumentation]: [
        SolicitationOffererStatusType.SolicitationResponseMatcher,
        SolicitationOffererStatusType.SolicitationResponseOrienteer
    ]
}

const orderTabsBySolicitationTypes : Record<SolicitationTypes, SolicitationOffererTabs[]> = {
    [SolicitationTypes.None]: [],
    [SolicitationTypes.General]: [
        SolicitationOffererTabs.Admission,
        SolicitationOffererTabs.AdmissionProposal, 
        SolicitationOffererTabs.AdmissionApproval, 
        SolicitationOffererTabs.AdmissionOutcome,
        
        SolicitationOffererTabs.PrequalificationProposal, 
        SolicitationOffererTabs.PrequalificationApproval, 
        SolicitationOffererTabs.PrequalificationOutcome,
        SolicitationOffererTabs.Prequalification, 
        SolicitationOffererTabs.Instrumentation
    ],
    [SolicitationTypes.Matcher]: [
        SolicitationOffererTabs.Reception,
        SolicitationOffererTabs.ReceptionProposal, 
        SolicitationOffererTabs.ReceptionApproval, 
        SolicitationOffererTabs.ReceptionOutcome,

        SolicitationOffererTabs.Assistance,
        SolicitationOffererTabs.AssistanceClosingProposal,
        SolicitationOffererTabs.AssistanceClosingApproval,
        SolicitationOffererTabs.AssistanceClosingOutcome,
        SolicitationOffererTabs.AssistanceClosing,
        SolicitationOffererTabs.TrackingInstrumentation
    ],
    [SolicitationTypes.Orienteer]: [
        SolicitationOffererTabs.Reception,
        SolicitationOffererTabs.ReceptionProposal,
        SolicitationOffererTabs.ReceptionApproval,
        SolicitationOffererTabs.ReceptionOutcome,

        SolicitationOffererTabs.Assistance,
        SolicitationOffererTabs.AssistanceClosingProposal,
        SolicitationOffererTabs.AssistanceClosingApproval,
        SolicitationOffererTabs.AssistanceClosingOutcome,
        SolicitationOffererTabs.AssistanceClosing,
        SolicitationOffererTabs.TrackingInstrumentation
    ],
    [SolicitationTypes.BetweenOfferers]: [
        SolicitationOffererTabs.Admission,
        SolicitationOffererTabs.AdmissionProposal,
        SolicitationOffererTabs.AdmissionApproval,
        SolicitationOffererTabs.AdmissionOutcome,

        SolicitationOffererTabs.PrequalificationProposal,
        SolicitationOffererTabs.PrequalificationApproval,
        SolicitationOffererTabs.PrequalificationOutcome,
        SolicitationOffererTabs.Prequalification,
        SolicitationOffererTabs.Instrumentation
    ]
}

export const SolicitationHelper = {
    isTabActive: (solicitation: SolicitationViewDTO, tab: SolicitationOffererTabs) : boolean =>
        activeStateByTabMap[tab].includes(solicitation[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode] as SolicitationOffererStatusType),

    getTabActive: (solicitation: SolicitationViewDTO) : SolicitationOffererTabs | undefined => {
        for (const _tab of Object.keys(activeStateByTabMap)) {
            const tab = parseInt(_tab) as SolicitationOffererTabs;
            if (SolicitationHelper.isTabActive(solicitation, tab))
                return tab;
        }
        
        return undefined;
    },
    
    alreadyPassedTab: (solicitation: SolicitationViewDTO, tab: SolicitationOffererTabs) => {
        const currentTab = SolicitationHelper.getTabActive(solicitation);
        
        if (!currentTab) return false;
        
        const tabsOrder = orderTabsBySolicitationTypes[solicitation[SolicitationViewDTOFields.SolicitationTypeCode] || SolicitationTypes.Matcher];
        const currentTabIndex = tabsOrder.indexOf(currentTab);
        const tabIndex = tabsOrder.indexOf(tab);

        return (tabIndex >= 0) && (tabIndex < currentTabIndex);
    },
}