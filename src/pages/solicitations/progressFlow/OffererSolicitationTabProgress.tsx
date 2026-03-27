import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@mui/material";
import {
    SolicitationOffererTabs,
    SolicitationProposedApprovalFlowTypes,
    SolicitationStatusType
} from "types/solicitations/solicitationEnums";
import {HttpSolicitationAnalysis} from "http/solicitations/httpSolicitationAnalysis";
import {
    HttpSolicitationDocumentationAnalysis
} from "http/solicitations/httpSolicitationDocumentationAnalysis";
import {HttpSolicitationApproval} from "http/solicitations/httpSolicitationApproval";
import {
    HttpSolicitationDocumentationApproval
} from "http/solicitations/httpSolicitationDocumentationApproval";
import {HttpFilesSolicitationAnalysis, HttpFilesSolicitationDocumentationAnalysis} from "http/index";
import OffererSolicitationProgressAnalysis from "./OffererSolicitationProgressAnalysis";
import {SolicitationAnalysisViewDTO} from "types/solicitations/solicitationAnalysisData";
import {SolicitationApprovalViewDTO} from "types/solicitations/solicitationApprovalData";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {EntityWithIdFields} from "types/baseEntities";
import OffererSolicitationProgressApproval from "./OffererSolicitationProgressApproval";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {SolicitationHelper} from "util/helpers/solicitationHelper";
import SolicitationAssistanceOfferer from "../assistance/SolicitationAssistanceOfferer";
import SolicitationTrackingGeneralTab from "../tracking/SolicitationTrackingGeneralTab";
import SolicitationAssistanceClosingTabOfferer from "../assistance/SolicitationAssistanceClosingTabOfferer";
import {NavsTabHorizontal} from "../../../components/navs/NavsTab";
import {Systems} from "../../../types/workflow/workflowEnums";
import OffererSolicitationProgressHistory from "./OffererSolicitationProgressHistory";
import OffererSolicitationResultMinimal
    from "../../offerer/solicitation/components/results/OffererSolicitationResultMinimal";
import {PermissionType} from "../../../types/security";
import OffererSolicitationProgressApprovalWithoutPermission
    from "./components/OffererSolicitationProgressApprovalWithoutPermission";
import OffererSolicitationProgressAnalysisWithoutPermission
    from "./components/OffererSolicitationProgressAnalysisWithoutPermission";

export const OffererSolicitationTabProgressContext = React.createContext({
    type: SolicitationProposedApprovalFlowTypes.AdmissionReception as SolicitationProposedApprovalFlowTypes,
    HttpAnalysis: {} as any,
    HttpApproval: {} as any,
    HttpFiles: {} as any,

    currentAnalysis: undefined as SolicitationAnalysisViewDTO | undefined,
    currentApproval: undefined as SolicitationApprovalViewDTO | undefined,
})

const admissionReceptionStatus = [
    SolicitationStatusType.SolicitationReception, 
    SolicitationStatusType.GeneralOffererSolicitationIncoming,
    SolicitationStatusType.GeneralOffererAdmission, 
    SolicitationStatusType.GeneralOffererAdmissionApproval,
    
    SolicitationStatusType.AssistedSearchOffererSolicitationIncoming,
    SolicitationStatusType.AssistedSearchOffererReceptionApproval
]

function OffererSolicitationTabProgress() {
    const { solicitation, permissionWorkflowCode } = useSolicitation();
    const stateCode = solicitation?.[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode];
    const hasPermissionWorkflow = permissionWorkflowCode === PermissionType.Write;

    const [solicitationAnalysis, setSolicitationAnalysis] = useState<SolicitationAnalysisViewDTO>();
    const [solicitationApproval, setSolicitationApproval] = useState<SolicitationApprovalViewDTO>();

    useEffect(() => {
        if (solicitation) {
            HttpApproval.getActualBySolicitationId(solicitation[EntityWithIdFields.Id])
                .then(setSolicitationApproval);

            HttpAnalysis.getActualBySolicitationId(solicitation[EntityWithIdFields.Id])
                .then(setSolicitationAnalysis);
        }
    }, [solicitation]);
    
    if (!stateCode) return null;
    
    const type = admissionReceptionStatus.includes(stateCode) ?
            SolicitationProposedApprovalFlowTypes.AdmissionReception : SolicitationProposedApprovalFlowTypes.SendingResults;
    
    const HttpAnalysis = type === SolicitationProposedApprovalFlowTypes.AdmissionReception ?
        HttpSolicitationAnalysis : HttpSolicitationDocumentationAnalysis;
    const HttpApproval = type === SolicitationProposedApprovalFlowTypes.AdmissionReception ?
        HttpSolicitationApproval : HttpSolicitationDocumentationApproval;
    const HttpFiles = type === SolicitationProposedApprovalFlowTypes.AdmissionReception ?
        HttpFilesSolicitationAnalysis : HttpFilesSolicitationDocumentationAnalysis;
    
    return (
        <OffererSolicitationTabProgressContext.Provider
            value={{
                type: type,
                HttpAnalysis: HttpAnalysis,
                HttpApproval: HttpApproval,
                HttpFiles: HttpFiles,

                currentAnalysis: solicitationAnalysis,
                currentApproval: solicitationApproval
            }}
        >
            <OffererSolicitationResultMinimal />
            
            {
                (
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.ReceptionProposal) ||
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.AdmissionProposal) ||
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.PrequalificationProposal)
                ) && (
                    hasPermissionWorkflow ?
                        <Card>
                            <CardHeader title={'Progreso de la solicitud'} />

                            <CardContent>
                                <OffererSolicitationProgressAnalysis />
                            </CardContent>
                        </Card>
                        :
                        (
                            SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.PrequalificationProposal) ||
                            !solicitationApproval
                        ) ?
                            <OffererSolicitationProgressAnalysisWithoutPermission />
                            :
                            <React.Fragment />
                )
            }

            {
                (
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.ReceptionApproval) ||
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.AdmissionApproval) ||
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.PrequalificationApproval)
                ) && (
                    hasPermissionWorkflow ?
                        <Card>
                            <CardHeader title={'Progreso de la solicitud'} />

                            <CardContent>
                                <OffererSolicitationProgressApproval />
                            </CardContent>
                        </Card>
                        :
                        <OffererSolicitationProgressApprovalWithoutPermission />
                )
            }
            
            {
                (solicitation[SolicitationViewDTOFields.SystemCode] === Systems.SolicitationsReferrals) &&
                (
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.Assistance) ||
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.AssistanceClosing) ||
                    SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.TrackingInstrumentation)
                ) &&
                    <NavsTabHorizontal fullWidth lstTabs={
                        [
                            {
                                tabList: [
                                    {
                                        label: 'Asistencia',
                                        content: <SolicitationAssistanceOfferer solicitation={solicitation} />,
                                        default: SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.Assistance)
                                    },
                                    {
                                        label: 'Seguimiento',
                                        content: <SolicitationTrackingGeneralTab solicitation={solicitation} />,
                                        default: SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.TrackingInstrumentation),
                                        alwaysRender: true
                                    },
                                    {
                                        label: 'Cierre de la asistencia',
                                        content: <SolicitationAssistanceClosingTabOfferer solicitation={solicitation} />,
                                        default: SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.AssistanceClosing)
                                    }
                                ]
                            }
                        ]
                    } />
            }
            
            <OffererSolicitationProgressHistory />
            
        </OffererSolicitationTabProgressContext.Provider>
    )
}

export default OffererSolicitationTabProgress;
