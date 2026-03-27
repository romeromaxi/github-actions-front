import {Systems} from "../workflow/workflowEnums";
import {SolicitationProposedApprovalFlowTypes} from "./solicitationEnums";

export const proposedStatusMap : Record<Systems, Record<SolicitationProposedApprovalFlowTypes, Record<'true' | 'false', string>>> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'true': 'AVANZAR',
            'false': 'NO APTO'
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'true': 'AVANZAR',
            'false': 'NO APTO'
        }
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'true': '',
            'false': ''
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'true': '',
            'false': ''
        }
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'true': 'DERIVAR',
            'false': 'NO DERIVAR'
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'true': 'CON SEGUIMIENTO',
            'false': 'SIN SEGUIMIENTO'
        }
    },
}