import { SolicitationClassificationTypeCode } from '../../types/general/generalEnums';
import {
  SolicitationClassificationStatusType, SolicitationClassificationTypesStatusType, SolicitationOffererStatusType,
  SolicitationStatusType,
} from '../../types/solicitations/solicitationEnums';

export interface solicitationStatesColor {
  light: string;
  dark: string;
  background?: string;
  text?: string;
}

export const SolicitationStatesColorMap: Record<
  SolicitationClassificationTypeCode,
  solicitationStatesColor
> = {
  [SolicitationClassificationTypeCode.Received]: {
    light: `rgba(39, 105, 186, 0.2)`,
    dark: '',
  },
  [SolicitationClassificationTypeCode.Active]: {
    light: `rgba(37, 156, 87, 0.2)`,
    dark: `rgb(37, 156, 87)`,
  },
  [SolicitationClassificationTypeCode.Denied]: {
    light: `rgba(227, 25, 25, 0.2)`,
    dark: `rgb(227, 25, 25)`,
  },
  [SolicitationClassificationTypeCode.Cancelled]: {
    light: `rgba(209, 105, 2, 0.2)`,
    dark: `rgb(209, 105, 2)`,
  },
  [SolicitationClassificationTypeCode.TimedOut]: {
    light: `rgba(227, 155, 48, 0.2)`,
    dark: `rgb(227, 155, 48)`,
  },
};

export const SolicitationStatusColorMap: Record<
  SolicitationStatusType,
  solicitationStatesColor
> = {
  [SolicitationStatusType.Prequalified]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [SolicitationStatusType.InstrumentationPyme]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [SolicitationStatusType.OrienteerDerivationConsultationInAnalysis]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationStatusType.AdmissionDerivation]: {
    light: 'rgba(114, 57, 234, 0.2)',
    dark: 'rgb(114, 57, 234)',
  },
    
    // Company
    [SolicitationStatusType.ReadyToSend]: {
        light: '#FEF9EC',
        dark: '#634700',
        background: '#FEF9EC',
        text: '#634700'
    },

    // Company - General
    [SolicitationStatusType.GeneralCompanySent]: {
        light: '#E8EEF9',
        dark: '#3677ED',
        background: '#E8EEF9',
        text: '#3677ED'
    },
    [SolicitationStatusType.GeneralCompanyUnderReview]: {
        light: '#3677ED',
        dark: '#FFFFFF',
        background: '#3677ED',
        text: '#FFFFFF'
    },
    [SolicitationStatusType.GeneralCompanyAdmissionDerivation]: {
        light: '#3677ED',
        dark: '#FFFFFF',
        background: '#3677ED',
        text: '#FFFFFF'
    },
    [SolicitationStatusType.GeneralCompanyProposed]: {
        light: '#E6FFF4',
        dark: '#26825A',
        background: '#E6FFF4',
        text: '#26825A'
    },
    [SolicitationStatusType.GeneralCompanyCancelled]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    [SolicitationStatusType.GeneralCompanyExpired]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    [SolicitationStatusType.GeneralCompanyNotAdmitted]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    
    // Company - AssistedSearch
    [SolicitationStatusType.AssistedSearchCompanyCompleted]: {
        light: '#E6FFF4',
        dark: '#26825A',
        background: '#E6FFF4',
        text: '#26825A'
    },
    [SolicitationStatusType.AssistedSearchCompanyNotAdmitted]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    [SolicitationStatusType.AssistedSearchCompanySent]: {
        light: '#E8EEF9',
        dark: '#3677ED',
        background: '#E8EEF9',
        text: '#3677ED'
    },
    [SolicitationStatusType.AssistedSearchCompanyInProgress]: {
        light: '#3677ED',
        dark: '#FFFFFF',
        background: '#3677ED',
        text: '#FFFFFF'
    },
    [SolicitationStatusType.AssistedSearchCompanyCancelled]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },

    // Company - Orienteer
    [SolicitationStatusType.OrienteerCompanyCompleted]: {
        light: '#E6FFF4',
        dark: '#26825A',
        background: '#E6FFF4',
        text: '#26825A'
    },
    [SolicitationStatusType.OrienteerCompanyNotAdmitted]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    [SolicitationStatusType.OrienteerCompanySent]: {
        light: '#E8EEF9',
        dark: '#3677ED',
        background: '#E8EEF9',
        text: '#3677ED'
    },
    [SolicitationStatusType.OrienteerCompanyInProgress]: {
        light: '#3677ED',
        dark: '#FFFFFF',
        background: '#3677ED',
        text: '#FFFFFF'
    },
    [SolicitationStatusType.OrienteerCompanyCancelled]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },

    // Offerer Side - General
    [SolicitationStatusType.GeneralOffererSolicitationIncoming]: {
        light: '#FEF9EC',
        dark: '#634700',
        background: '#FEF9EC',
        text: '#634700'
    },
    [SolicitationStatusType.GeneralOffererAdmission]: {
        light: '#FEF9EC',
        dark: '#634700',
        background: '#FEF9EC',
        text: '#634700'
    },
    [SolicitationStatusType.GeneralOffererAdmissionApproval]: {
        light: '#FEF9EC',
        dark: '#634700',
        background: '#FEF9EC',
        text: '#634700'
    },

    [SolicitationStatusType.GeneralOffererPrequalificationAnalyisis]: {
        light: '#3677ED',
        dark: '#FFFFFF',
        background: '#3677ED',
        text: '#FFFFFF'
    },
    [SolicitationStatusType.GeneralOffererPrequalificationApproval]: {
        light: '#3677ED',
        dark: '#FFFFFF',
        background: '#3677ED',
        text: '#FFFFFF'
    },
    [SolicitationStatusType.GeneralOffererPrequalifieds]: {
        light: '#E6FFF4',
        dark: '#26825A',
        background: '#E6FFF4',
        text: '#26825A'
    },
    [SolicitationStatusType.GeneralOffererDenied]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    [SolicitationStatusType.GeneralOffererCancelled]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    [SolicitationStatusType.GeneralOffererExpired]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    [SolicitationStatusType.GeneralOffererDismiss]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },

    // Offerer Side - AssistedSearch
    [SolicitationStatusType.AssistedSearchOffererDerivation]: {
        light: '#3677ED',
        dark: '#FFFFFF',
        background: '#3677ED',
        text: '#FFFFFF'
    },
    [SolicitationStatusType.AssistedSearchOffererCompleted]: {
        light: '#E6FFF4',
        dark: '#26825A',
        background: '#E6FFF4',
        text: '#26825A'
    },
    [SolicitationStatusType.AssistedSearchOffererCancelled]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    [SolicitationStatusType.AssistedSearchOffererUnableDerivation]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    
    // Offerer Side - BetweenOfferers
    [SolicitationStatusType.BetweenOfferersReception]: {
        light: '#FEF9EC',
        dark: '#634700',
        background: '#FEF9EC',
        text: '#634700'
    },
    [SolicitationStatusType.BetweenOfferersAcceptedDerivation]: {
        light: '#E6FFF4',
        dark: '#26825A',
        background: '#E6FFF4',
        text: '#26825A'
    },
    [SolicitationStatusType.BetweenOfferersRejectedDerivation]: {
        light: '#FDF6F6',
        dark: '#720800',
        background: '#FDF6F6',
        text: '#720800'
    },
    [SolicitationStatusType.BetweenOfferersAwaitingConfirmation]: {
        light: '#FEF9EC',
        dark: '#634700',
        background: '#FEF9EC',
        text: '#634700'
    },    
};


export const SolicitationOffererStatusColorMap: Record<
    SolicitationOffererStatusType,
    solicitationStatesColor
> = {
  [SolicitationOffererStatusType.Received]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.InAnalysis]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.SolicitationReception]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.SolicitationReceptionOrienteer]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.SolicitationReceivedOrienteer]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.SolicitationReceivedMatcher]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.PrequalificationAnalyisis]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.SolicitationReceptionOrienteer]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.SolicitationReceivedOrienteer]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.PrequalificationReceived]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [SolicitationOffererStatusType.TimedOut]: {
    light: 'rgba(255, 199, 0, 0.2)',
    dark: 'rgb(255, 199, 0)',
  },
  [SolicitationOffererStatusType.PrequalificationAble]: {
    light: 'rgba(124, 211, 217, 0.2)',
    dark: 'rgb(124, 211, 217)',
  },
  [SolicitationOffererStatusType.SolicitationResponseMatcher]: {
    light: 'rgba(124, 211, 217, 0.2)',
    dark: 'rgb(124, 211, 217)',
  },
  [SolicitationOffererStatusType.SolicitationSGRResponse]: {
    light: 'rgba(124, 211, 217, 0.2)',
    dark: 'rgb(124, 211, 217)',
  },
  [SolicitationOffererStatusType.SolicitionPymeResponse]: {
    light: 'rgba(124, 211, 217, 0.2)',
    dark: 'rgb(124, 211, 217)',
  },
  [SolicitationOffererStatusType.SolicitationReceptionApprovalOrienteer]: {
    light: 'rgba(124, 211, 217, 0.2)',
    dark: 'rgb(124, 211, 217)',
  },
  [SolicitationOffererStatusType.SolicitationResponseOrienteer]: {
    light: 'rgba(124, 211, 217, 0.2)',
    dark: 'rgb(124, 211, 217)',
  },
  [SolicitationOffererStatusType.PrequalificationApproval]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [SolicitationOffererStatusType.SolicitationReceptionApproval]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [SolicitationOffererStatusType.SolicitationAssistanceApproval]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [SolicitationOffererStatusType.AnalysisApproval]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [SolicitationOffererStatusType.SolicitationAssistanceApprovalOrienteer]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [SolicitationOffererStatusType.Derivation]: {
    light: 'rgba(114, 57, 234, 0.2)',
    dark: 'rgb(114, 57, 234)',
  },
  [SolicitationOffererStatusType.SolicitationInstrumentation]: {
    light: 'rgba(114, 57, 234, 0.2)',
    dark: 'rgb(114, 57, 234)',
  },
  [SolicitationOffererStatusType.DerivationOrienteer]: {
    light: 'rgba(114, 57, 234, 0.2)',
    dark: 'rgb(114, 57, 234)',
  },
  [SolicitationOffererStatusType.Denied]: {
    light: 'rgba(241, 65, 108, 0.2)',
    dark: 'rgb(241, 65, 108)',
  },
  [SolicitationOffererStatusType.Cancelled]: {
    light: 'rgba(241, 65, 108, 0.2)',
    dark: 'rgb(241, 65, 108)',
  },
  [SolicitationOffererStatusType.SolicitationUnableDerivation]: {
    light: 'rgba(241, 65, 108, 0.2)',
    dark: 'rgb(241, 65, 108)',
  },
  [SolicitationOffererStatusType.SolicitationCancelledAssistedSearch]: {
    light: 'rgba(241, 65, 108, 0.2)',
    dark: 'rgb(241, 65, 108)',
  },
  [SolicitationOffererStatusType.SolicitationUnableOrienteer]: {
    light: 'rgba(241, 65, 108, 0.2)',
    dark: 'rgb(241, 65, 108)',
  },
  [SolicitationOffererStatusType.SolicitationCancelledOrienteer]: {
    light: 'rgba(241, 65, 108, 0.2)',
    dark: 'rgb(241, 65, 108)',
  },
  
  [SolicitationOffererStatusType.SolicitationBetweenOfferersReception]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  },
  [SolicitationOffererStatusType.SolicitationBetweenOfferersAcceptedDerivation]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: 'rgb(169, 209, 142)',
  },
  [SolicitationOffererStatusType.SolicitationBetweenOfferersRejectedDerivation]: {
    light: 'rgba(241, 65, 108, 0.2)',
    dark: 'rgb(241, 65, 108)',
  },
  [SolicitationOffererStatusType.AwaitingConfirmationDerivation]: {
    light: 'rgba(0, 158, 247, 0.2)',
    dark: 'rgb(0, 158, 247)',
  }
};

export const SolicitationClassificationStatusColorMap: Record<
  SolicitationClassificationStatusType,
  solicitationStatesColor
> = {
    [SolicitationClassificationStatusType.UnderReview]: {
        light: '#FEF9EC',
        dark: '#634700',
    },
    [SolicitationClassificationStatusType.ReceivedAssistedSearch]: {
        light: '#FEF9EC',
        dark: '#634700',
    },
    [SolicitationClassificationStatusType.AssistanceAssistedSearch]: {
        light: '#3677ED',
        dark: '#FFFFFF',
    },
    [SolicitationClassificationStatusType.TrackingAssistedSearch]: {
        light: '#E6FFF4',
        dark: '#26825A',
    },

    [SolicitationClassificationStatusType.Cancelled]: {
        light: '#FDF6F6',
        dark: '#720800',
    },
    [SolicitationClassificationStatusType.NotAccepted]: {
        light: '#FDF6F6',
        dark: '#720800',
    },
    [SolicitationClassificationStatusType.Dismiss]: {
        light: '#FDF6F6',
        dark: '#720800',
    },
    [SolicitationClassificationStatusType.Received]: {
        light: '#FEF9EC',
        dark: '#634700',
    },
    [SolicitationClassificationStatusType.Pending]: {
        light: '#FEF9EC',
        dark: '#634700',
    },
    [SolicitationClassificationStatusType.InProgress]: {
        light: '#3677ED',
        dark: '#FFFFFF',
    },
    [SolicitationClassificationStatusType.Proposal]: {
        light: '#E6FFF4',
        dark: '#26825A',
    },
};

export const SolicitationClassificationTypesStatusColorMap: Record<
    SolicitationClassificationTypesStatusType,
    solicitationStatesColor
> = {
  [SolicitationClassificationTypesStatusType.InCart]: {
    light: 'rgba(51, 146, 255, 0.2)',
    dark: '#E98400',
  },
  [SolicitationClassificationTypesStatusType.Active]: {
    light: 'rgba(51, 146, 255, 0.2)',
    dark: '#3392FF',
  },
  [SolicitationClassificationTypesStatusType.Prequalified]: {
    light: 'rgba(169, 209, 142, 0.2)',
    dark: '#A9D18E',
  },
  [SolicitationClassificationTypesStatusType.Denied]: {
    light: 'rgba(241, 65, 108, 0.2)',
    dark: '#F1416C',
  },
  [SolicitationClassificationTypesStatusType.Cancelled]: {
    light: 'rgba(209, 105, 2, 0.2)',
    dark: '#D16902',
  },
};
