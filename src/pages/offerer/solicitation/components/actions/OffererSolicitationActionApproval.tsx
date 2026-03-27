import React, {useEffect, useMemo, useState} from "react";
import {Button} from "@mui/material";
import OffererSolicitationActionMainComponent from "./OffererSolicitationActionMainComponent";
import {
    SolicitationAnalysisViewDTO,
    SolicitationAnalysisViewDTOFields
} from "types/solicitations/solicitationAnalysisData";
import {SolicitationProposedApprovalFlowTypes} from "types/solicitations/solicitationEnums";
import {useUser} from "hooks/contexts/UserContext";
import {useAppNavigation} from "hooks/navigation";
import {OffererRoute} from "routes/offerer/routeAppOffererData";

interface OffererSolicitationActionApprovalProps {
    solicitationId: number,
    HttpAnalysis: any,
    approvalType: SolicitationProposedApprovalFlowTypes,
    hasPermission?: boolean
}

function OffererSolicitationActionApproval({ solicitationId, HttpAnalysis, approvalType, hasPermission }: OffererSolicitationActionApprovalProps) {
    const { user } = useUser();
    const { navigate } = useAppNavigation();
    const [solicitationAnalysis, setSolicitationAnalysis] = useState<SolicitationAnalysisViewDTO>();

    const handleNavigateToProgress = () => {
        navigate(
            OffererRoute.OffererSolicitationDetailProgress,
            { solicitationId: solicitationId as number },
            undefined,
            { replace: true }
        );
    }
    
    const configurarions = useMemo(() => {
        const userId = user?.userId;
        
        if (!solicitationAnalysis || !userId) return undefined;
        
        let title: string,
            subtitle: string,
            titleColor: string,
            buttonColor: 'primary' | 'secondary',
            buttonVariant: 'contained' | 'outlined',
            buttonLabel: string;

        titleColor = solicitationAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable] ? '#3677ED' : '#720800';
        
        if (hasPermission) {
            if (approvalType === SolicitationProposedApprovalFlowTypes.AdmissionReception) {
                title = solicitationAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable] ?
                    'El analista ha iniciado la evaluación y necesita aprobación' :
                    'El analista descartó la solicitud y necesita aprobación';
            } else {
                title = solicitationAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable] ?
                    'El analista ha elaborado una propuesta y necesita aprobación' :
                    'El analista rechazó la solicitud y necesita aprobación';
            }
            
            subtitle = 'Podés aprobar la decisión del analista o devolverla para que haga realice modificaciones.';

            buttonLabel = 'Revisar';
            buttonColor = 'primary';
            buttonVariant = 'contained';
        } else if (userId === solicitationAnalysis[SolicitationAnalysisViewDTOFields.AptitudeUserId]) {
            if (approvalType === SolicitationProposedApprovalFlowTypes.AdmissionReception) {
                title = solicitationAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable] ?
                    'La recomendación de iniciar la evaluación que elaboraste será revisada por un aprobador' :
                    'Recomendaste el descarte de la solicitud y necesita aprobación';
            } else {
                title = solicitationAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable] ?
                    'La propuesta que elaboraste será revisada por un aprobador' :
                    'Recomendaste el rechazo de la solicitud y necesita aprobación';
            }
            
            subtitle = 'Tu recomendación podrá ser aprobada, modificada o devuelta a vos para realizar cambios.';
            
            buttonLabel = 'Ver';
            buttonColor = 'primary';
            buttonVariant = 'contained';
        } else {
            if (approvalType === SolicitationProposedApprovalFlowTypes.AdmissionReception) {
                title = solicitationAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable] ?
                    'El analista ha iniciado la evaluación y necesita aprobación' :
                    'El analista recomendó el descarte de la solicitud y necesita aprobación';
            } else {
                title = solicitationAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable] ?
                    'El analista ha elaborado una propuesta y necesita aprobación' :
                    'El analista recomendó el rechazo de la solicitud y necesita aprobación';
            }
            
            subtitle = 'La recomendación podrá ser aprobada, modificada o devuelta al analista para realizar cambios.'
            
            buttonLabel = 'Ver';
            buttonColor = 'secondary';
            buttonVariant = 'outlined';
        }
        
        return {
            title: title,
            subtitle: subtitle,
            titleColor: titleColor,
            buttonColor: buttonColor,
            buttonVariant: buttonVariant,
            buttonLabel: buttonLabel
        }
    }, [solicitationAnalysis, user]);

    useEffect(() => {
        if (!!solicitationId && !!HttpAnalysis)
            HttpAnalysis.getActualBySolicitationId(solicitationId)
                .then(setSolicitationAnalysis);
    }, [solicitationId, HttpAnalysis]);
    
    if (!configurarions) return null;
    
    return (
        <OffererSolicitationActionMainComponent title={configurarions.title}
                                                subtitle={configurarions.subtitle}
                                                titleColor={configurarions.titleColor}
        >
            <Button color={configurarions.buttonColor}
                    variant={configurarions.buttonVariant}
                    onClick={handleNavigateToProgress}
            >
                {configurarions.buttonLabel}
            </Button>
        </OffererSolicitationActionMainComponent>
    )
}

export default OffererSolicitationActionApproval;
