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

interface OffererSolicitationActionInProgressProps {
    solicitationId: number,
    hasPermission?: boolean
}

function OffererSolicitationActionInProgress({ solicitationId, hasPermission }: OffererSolicitationActionInProgressProps) {
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
        <OffererSolicitationActionMainComponent title={'Esta solicitud está en progreso'}
                                                subtitle={'En esta instancia podés conversar con la PyME y solicitar la documentación necesaria.'}
                                                titleColor={'#3677ED'}
        >
            <Tooltip title={!hasPermission ? 'No tenés los permisos para realizar esta acción' : ''}>
                <Button color={'error'}
                        variant={'outlined'}
                        startIcon={<WrapperIcons Icon={analysisStatesIconMap[Systems.Solicitations][SolicitationProposedApprovalFlowTypes.SendingResults][SolicitationAnalysisStates.NotSuitable]}/>}
                        onClick={() => handleNavigateToProgress(SolicitationAnalysisStates.NotSuitable)}
                        disabled={!hasPermission}
                >
                    {titleAnalysisStatesMap[Systems.Solicitations][SolicitationProposedApprovalFlowTypes.SendingResults][SolicitationAnalysisStates.NotSuitable]}
                </Button>
            </Tooltip>

            <Tooltip title={!hasPermission ? 'No tenés los permisos para realizar esta acción' : ''}>
                <Button color={'primary'}
                        variant={'contained'}
                        startIcon={<WrapperIcons Icon={analysisStatesIconMap[Systems.Solicitations][SolicitationProposedApprovalFlowTypes.SendingResults][SolicitationAnalysisStates.Suitable]}/>}
                        onClick={() => handleNavigateToProgress(SolicitationAnalysisStates.Suitable)}
                        disabled={!hasPermission}
                >
                    {titleAnalysisStatesMap[Systems.Solicitations][SolicitationProposedApprovalFlowTypes.SendingResults][SolicitationAnalysisStates.Suitable]}
                </Button>
            </Tooltip>
        </OffererSolicitationActionMainComponent>
    )
}

export default OffererSolicitationActionInProgress;
