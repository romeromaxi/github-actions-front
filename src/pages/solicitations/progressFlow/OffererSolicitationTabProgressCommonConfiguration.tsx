import React from "react";
import {Systems} from "types/workflow/workflowEnums";
import {
    SolicitationApprovalResultType, SolicitationNoteRelatedDataTypes,
    SolicitationProposedApprovalFlowTypes
} from "types/solicitations/solicitationEnums";
import {MailIcon, PlayIcon, SendIcon, Undo2Icon, XIcon} from "lucide-react";
import {ActionsTypes} from "types/workflow/actionEnums";

export enum SolicitationAnalysisStates {
    Suitable = 'apto',
    NotSuitable = 'noapto',
}

export const titleAnalysisStatesMap : 
    Record<Systems, 
        Record<SolicitationProposedApprovalFlowTypes, Record<SolicitationAnalysisStates, string>>
    > = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            [SolicitationAnalysisStates.Suitable]: 'Iniciar la evaluación',
            [SolicitationAnalysisStates.NotSuitable]: 'Descartar solicitud'
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            [SolicitationAnalysisStates.Suitable]: 'Presentar propuesta',
            [SolicitationAnalysisStates.NotSuitable]: 'Rechazar solicitud'
        },
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            [SolicitationAnalysisStates.Suitable]: '',
            [SolicitationAnalysisStates.NotSuitable]: ''
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            [SolicitationAnalysisStates.Suitable]: '',
            [SolicitationAnalysisStates.NotSuitable]: ''
        },
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            [SolicitationAnalysisStates.Suitable]: 'Iniciar la evaluación',
            [SolicitationAnalysisStates.NotSuitable]: 'Descartar solicitud'
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            [SolicitationAnalysisStates.Suitable]: 'Presentar propuesta',
            [SolicitationAnalysisStates.NotSuitable]: 'Rechazar solicitud'
        },
    },
}

export const analysisStatesIconMap :
    Record<Systems,
        Record<SolicitationProposedApprovalFlowTypes, Record<SolicitationAnalysisStates, React.ElementType>>
    > = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            [SolicitationAnalysisStates.Suitable]: PlayIcon,
            [SolicitationAnalysisStates.NotSuitable]: XIcon
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            [SolicitationAnalysisStates.Suitable]: MailIcon,
            [SolicitationAnalysisStates.NotSuitable]: XIcon
        },
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            [SolicitationAnalysisStates.Suitable]: () => <React.Fragment />,
            [SolicitationAnalysisStates.NotSuitable]: () => <React.Fragment />
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            [SolicitationAnalysisStates.Suitable]: () => <React.Fragment />,
            [SolicitationAnalysisStates.NotSuitable]: () => <React.Fragment />
        },
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            [SolicitationAnalysisStates.Suitable]: PlayIcon,
            [SolicitationAnalysisStates.NotSuitable]: XIcon
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            [SolicitationAnalysisStates.Suitable]: MailIcon,
            [SolicitationAnalysisStates.NotSuitable]: XIcon
        },
    },
}

export interface ProgressStatesButtonProps {
    color: 'primary' | 'error',
    label: string,
    Icon?: React.ElementType
}

export const analysisStatesButtonProps :
    Record<Systems,
        Record<SolicitationProposedApprovalFlowTypes, 
            Record<SolicitationAnalysisStates | 'default', 
                Record<'true' | 'false', ProgressStatesButtonProps>
            >>
    > = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'default': {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.Suitable]: {
                'true': {
                    color: 'primary',
                    label: 'Iniciar la evaluación',
                    Icon: PlayIcon
                },
                'false': {
                    color: 'primary',
                    label: 'Enviar a revisión'
                }
            },
            [SolicitationAnalysisStates.NotSuitable]: {
                'true': {
                    color: 'error',
                    label: 'Descartar solicitud',
                    Icon: XIcon
                },
                'false': {
                    color: 'primary',
                    label: 'Enviar a revisión'
                }
            },
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'default': {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.Suitable]: {
                'true': {
                    color: 'primary',
                    label: 'Enviar propuesta a la PyME',
                    Icon: SendIcon
                },
                'false': {
                    color: 'primary',
                    label: 'Enviar a revisión'
                }
            },
            [SolicitationAnalysisStates.NotSuitable]: {
                'true': {
                    color: 'error',
                    label: 'Rechazar solicitud',
                    Icon: XIcon
                },
                'false': {
                    color: 'primary',
                    label: 'Enviar a revisión'
                }
            },
        },
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'default': {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.Suitable]: {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.NotSuitable]: {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'default': {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.Suitable]: {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.NotSuitable]: {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
        },
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'default': {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.Suitable]: {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.NotSuitable]: {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'default': {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.Suitable]: {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationAnalysisStates.NotSuitable]: {
                'true': {
                    color: 'primary',
                    label: 'Continuar'
                },
                'false': {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
        },
    },
}

export const approvalStatesIconMap :
    Record<Systems,
        Record<SolicitationProposedApprovalFlowTypes, Record<SolicitationApprovalResultType, React.ElementType>>
    > = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            [SolicitationApprovalResultType.Pendant]: PlayIcon,
            [SolicitationApprovalResultType.Approved]: PlayIcon,
            [SolicitationApprovalResultType.Rejected]: XIcon,
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            [SolicitationApprovalResultType.Pendant]: PlayIcon,
            [SolicitationApprovalResultType.Approved]: PlayIcon,
            [SolicitationApprovalResultType.Rejected]: XIcon,
        },
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            [SolicitationApprovalResultType.Pendant]: () => <React.Fragment />,
            [SolicitationApprovalResultType.Approved]: () => <React.Fragment />,
            [SolicitationApprovalResultType.Rejected]: () => <React.Fragment />,
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            [SolicitationApprovalResultType.Pendant]: () => <React.Fragment />,
            [SolicitationApprovalResultType.Approved]: () => <React.Fragment />,
            [SolicitationApprovalResultType.Rejected]: () => <React.Fragment />,
        },
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            [SolicitationApprovalResultType.Pendant]: PlayIcon,
            [SolicitationApprovalResultType.Approved]: PlayIcon,
            [SolicitationApprovalResultType.Rejected]: XIcon,
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            [SolicitationApprovalResultType.Pendant]: PlayIcon,
            [SolicitationApprovalResultType.Approved]: PlayIcon,
            [SolicitationApprovalResultType.Rejected]: XIcon,
        },
    },
}


export const approvalStatesButtonProps :
    Record<Systems,
        Record<SolicitationProposedApprovalFlowTypes, 
            Record<SolicitationApprovalResultType | 'default',
                Record<SolicitationAnalysisStates, ProgressStatesButtonProps>>
        >
    > = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'default': {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Pendant]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Approved]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Iniciar la evaluación',
                    Icon: PlayIcon
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Rechazar solicitud',
                    Icon: XIcon
                }
            },
            [SolicitationApprovalResultType.Rejected]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'error',
                    label: 'Devolver al analista',
                    Icon: Undo2Icon
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Devolver al analista',
                    Icon: Undo2Icon
                }
            },
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'default': {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Pendant]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Approved]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Enviar propuesta a la PyME',
                    Icon: SendIcon
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Rechazar solicitud',
                    Icon: XIcon
                }
            },
            [SolicitationApprovalResultType.Rejected]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'error',
                    label: 'Devolver al analista',
                    Icon: Undo2Icon
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Devolver al analista',
                    Icon: Undo2Icon
                }
            },
        },
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'default': {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Pendant]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Approved]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Rejected]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'default': {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Pendant]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Approved]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Enviar propuesta a la PyME'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Rechazar'
                }
            },
            [SolicitationApprovalResultType.Rejected]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'error',
                    label: 'Devolver al analista'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Devolver al analista'
                }
            },
        },
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'default': {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Pendant]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Approved]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Enviar propuesta a la PyME'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Rechazar'
                }
            },
            [SolicitationApprovalResultType.Rejected]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'error',
                    label: 'Devolver al analista'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Devolver al analista'
                }
            },
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'default': {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Pendant]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Continuar'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'primary',
                    label: 'Continuar'
                }
            },
            [SolicitationApprovalResultType.Approved]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'primary',
                    label: 'Enviar propuesta a la PyME'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Rechazar'
                }
            },
            [SolicitationApprovalResultType.Rejected]: {
                [SolicitationAnalysisStates.Suitable]: {
                    color: 'error',
                    label: 'Devolver al analista'
                },
                [SolicitationAnalysisStates.NotSuitable]: {
                    color: 'error',
                    label: 'Devolver al analista'
                }
            },
        },
    },
}

export const actionWorkflowApproveMap : Record<Systems, Record<SolicitationProposedApprovalFlowTypes, ActionsTypes>> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.ApproveDataAnalysis,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.ApprovePrequalificationAnalysis
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: 0,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: 0
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.SolicitationApproveReception,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.ApproveAssistanceAnalysis
    },
}

export const actionWorkflowRejectMap : Record<Systems, Record<SolicitationProposedApprovalFlowTypes, ActionsTypes>> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.ReturnToDataAnalysis,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.ReturnToPrequalificationAnalysis
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: 0,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: 0
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.SolicitationRejectReception,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.ReturnToAssistanceAnalysis
    },
}

export const analysisNoteRelatedDataTypeMap : Record<SolicitationProposedApprovalFlowTypes, SolicitationNoteRelatedDataTypes> = {
    [SolicitationProposedApprovalFlowTypes.AdmissionReception]: SolicitationNoteRelatedDataTypes.AdmissionProposal,
    [SolicitationProposedApprovalFlowTypes.SendingResults]: SolicitationNoteRelatedDataTypes.PrequalificationProposal
}

export const approvalNoteRelatedDataTypeMap : Record<SolicitationProposedApprovalFlowTypes, SolicitationNoteRelatedDataTypes>  = {
    [SolicitationProposedApprovalFlowTypes.AdmissionReception]: SolicitationNoteRelatedDataTypes.AdmissionApproval,
    [SolicitationProposedApprovalFlowTypes.SendingResults]: SolicitationNoteRelatedDataTypes.PrequalificationApproval
}
