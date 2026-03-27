import React from "react";
import {Button, Tooltip} from "@mui/material";
import OffererSolicitationActionMainComponent from "./OffererSolicitationActionMainComponent";
import {
    analysisStatesIconMap,
    SolicitationAnalysisStates,
    titleAnalysisStatesMap
} from "../../../../solicitations/progressFlow/OffererSolicitationTabProgressCommonConfiguration";
import { Systems } from "types/workflow/workflowEnums";
import {SolicitationProposedApprovalFlowTypes} from "types/solicitations/solicitationEnums";
import { WrapperIcons } from "components/icons/Icons";
import {useAppNavigation} from "hooks/navigation";
import {OffererRoute} from "routes/offerer/routeAppOffererData";
import {CryptoJSHelper} from "util/helpers";

interface OffererSolicitationActionPendingProps {
    solicitationId: number,
    hasPermission?: boolean
}

function OffererSolicitationActionPending({ solicitationId, hasPermission }: OffererSolicitationActionPendingProps) {
    const { navigate } = useAppNavigation();

    const handleNavigateToProgress = (state: SolicitationAnalysisStates) => {
        navigate(
            OffererRoute.OffererSolicitationDetailProgress,
            { solicitationId: solicitationId as number },
            { aptitud: CryptoJSHelper.encryptRoute(state) },
            { replace: true }
        );
    }
    
    return (
        <OffererSolicitationActionMainComponent title={'Esta solicitud está Pendiente'}
                                                subtitle={'Recibiste esta solicitud y está pendiente. Si crees que cumple con los requisitos básicos podes iniciar la evaluación. Si no es el perfil adecuado podes descartarla.'}
                                                titleColor={'warning.secondaryContrastText'}
        >
            <Tooltip title={!hasPermission ? 'No tenés los permisos para realizar esta acción' : ''}>
                <Button color={'error'}
                        variant={'outlined'}
                        startIcon={<WrapperIcons Icon={analysisStatesIconMap[Systems.Solicitations][SolicitationProposedApprovalFlowTypes.AdmissionReception][SolicitationAnalysisStates.NotSuitable]}/>}
                        onClick={() => handleNavigateToProgress(SolicitationAnalysisStates.NotSuitable)}
                        disabled={!hasPermission}
            >
                    {titleAnalysisStatesMap[Systems.Solicitations][SolicitationProposedApprovalFlowTypes.AdmissionReception][SolicitationAnalysisStates.NotSuitable]}
                </Button>
            </Tooltip>

            <Tooltip title={!hasPermission ? 'No tenés los permisos para realizar esta acción' : ''}>
                <Button color={'primary'}
                        variant={'contained'}
                        startIcon={<WrapperIcons Icon={analysisStatesIconMap[Systems.Solicitations][SolicitationProposedApprovalFlowTypes.AdmissionReception][SolicitationAnalysisStates.Suitable]}/>}
                        onClick={() => handleNavigateToProgress(SolicitationAnalysisStates.Suitable)}
                        disabled={!hasPermission}
                >
                    {titleAnalysisStatesMap[Systems.Solicitations][SolicitationProposedApprovalFlowTypes.AdmissionReception][SolicitationAnalysisStates.Suitable]}
                </Button>
            </Tooltip>
        </OffererSolicitationActionMainComponent>
    )
}

export default OffererSolicitationActionPending;
