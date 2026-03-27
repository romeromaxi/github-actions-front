import React, {useEffect, useState} from "react";
import {Box, Grid} from "@mui/material";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import {SolicitationOffererTabs, SolicitationProposedApprovalFlowTypes} from "types/solicitations/solicitationEnums";
import {NavsTabHorizontal} from "components/navs/NavsTab";
import {SolicitationHelper} from "util/helpers/solicitationHelper";
import {HttpSolicitationAnalysis} from "http/solicitations/httpSolicitationAnalysis";
import SolicitationProposedTab from "./SolicitationProposedTab";
import SolicitationApprovalTab from "./SolicitationApprovalTab";
import {HttpSolicitationDocumentationAnalysis} from "http/solicitations/httpSolicitationDocumentationAnalysis";
import SolicitationResultTab from "./SolicitationResultTab";
import {HttpSolicitationApproval} from "http/solicitations/httpSolicitationApproval";
import {HttpSolicitationDocumentationApproval} from "http/solicitations/httpSolicitationDocumentationApproval";
import {HttpFilesSolicitationAnalysis, HttpFilesSolicitationDocumentationAnalysis} from "http/index";
import SolicitationFlowApprovalHistoricList from "./components/historic/SolicitationFlowApprovalHistoricList";
import {SolicitationAnalysisViewDTO} from "../../../types/solicitations/solicitationAnalysisData";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {SolicitationApprovalViewDTO} from "../../../types/solicitations/solicitationApprovalData";

interface SolicitationProposedApprovalFlowTabs {
    proposal: SolicitationOffererTabs,
    approval: SolicitationOffererTabs,
    outcome: SolicitationOffererTabs
}

interface SolicitationProposedApprovalFlowProps {
    solicitation: SolicitationViewDTO,
    type: SolicitationProposedApprovalFlowTypes,
    tabs: SolicitationProposedApprovalFlowTabs
}

export const SolicitationProposedApprovalFlowContext = React.createContext({
    solicitation: {} as SolicitationViewDTO,
    flowType: {} as SolicitationProposedApprovalFlowTypes,
    flowTabs: {} as SolicitationProposedApprovalFlowTabs,
    HttpAnalysis: {} as any,
    HttpApproval: {} as any,
    HttpFiles: {} as any,

    analysisSituation: undefined as SolicitationAnalysisViewDTO | undefined,
    approvalSituation: undefined as SolicitationApprovalViewDTO | undefined,
})

function SolicitationProposedApprovalFlow({ solicitation, type, tabs }: SolicitationProposedApprovalFlowProps) {
    const HttpAnalysis = type === SolicitationProposedApprovalFlowTypes.AdmissionReception ?
        HttpSolicitationAnalysis : HttpSolicitationDocumentationAnalysis;
    const HttpApproval = type === SolicitationProposedApprovalFlowTypes.AdmissionReception ?
        HttpSolicitationApproval : HttpSolicitationDocumentationApproval;
    const HttpFiles = type === SolicitationProposedApprovalFlowTypes.AdmissionReception ?
        HttpFilesSolicitationAnalysis : HttpFilesSolicitationDocumentationAnalysis;
    
    const noActiveTab =
        !SolicitationHelper.isTabActive(solicitation, tabs.proposal) &&
        !SolicitationHelper.isTabActive(solicitation, tabs.approval) &&
        !SolicitationHelper.isTabActive(solicitation, tabs.outcome);

    const allAlreadyPassedTab =
        SolicitationHelper.alreadyPassedTab(solicitation, tabs.proposal) &&
        SolicitationHelper.alreadyPassedTab(solicitation, tabs.approval) &&
        SolicitationHelper.alreadyPassedTab(solicitation, tabs.outcome);

    const [analysisSituation, setAnalysisSituation] = useState<SolicitationAnalysisViewDTO>();
    const [approvalSituation, setApprovalSituation] = useState<SolicitationApprovalViewDTO>();
    
    useEffect(() => {
        HttpAnalysis.getActualBySolicitationId(solicitation[EntityWithIdFields.Id])
            .then(setAnalysisSituation)

        HttpApproval.getActualBySolicitationId(solicitation[EntityWithIdFields.Id])
            .then(setApprovalSituation)
    }, []);
    
    return (
        <SolicitationProposedApprovalFlowContext.Provider
            value={{
                solicitation: solicitation,
                flowType: type,
                flowTabs: tabs,
                HttpAnalysis: HttpAnalysis,
                HttpApproval: HttpApproval,
                HttpFiles: HttpFiles,

                analysisSituation: analysisSituation,
                approvalSituation: approvalSituation
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ marginTop: 1, width: '100%' }}>
                        <NavsTabHorizontal
                            lstTabs={[
                                {
                                    tabList: [
                                        {
                                            label: 'Elaboración',
                                            content: (
                                                <SolicitationProposedTab type={type}
                                                                         tab={tabs.proposal}
                                                />
                                            ),
                                            default: SolicitationHelper.isTabActive(solicitation, tabs.proposal) || (noActiveTab && !allAlreadyPassedTab)
                                        },
                                        {
                                            label: 'Aprobación',
                                            content: (
                                                <SolicitationApprovalTab solicitation={solicitation}
                                                                         type={type}
                                                                         tab={tabs.approval}
                                                />
                                            ),
                                            default: SolicitationHelper.isTabActive(solicitation, tabs.approval)
                                        },
                                        {
                                            label: 'Enviada',
                                            content: (
                                                <SolicitationResultTab /> 
                                            ),
                                            default: SolicitationHelper.isTabActive(solicitation, tabs.outcome) || allAlreadyPassedTab
                                        },
                                    ],
                                },
                            ]}
                        />
                    </Box>
                </Grid>          
                
                <Grid item xs={12}>
                    <SolicitationFlowApprovalHistoricList />
                </Grid>
            </Grid>
        </SolicitationProposedApprovalFlowContext.Provider>
    )
}

export default SolicitationProposedApprovalFlow;