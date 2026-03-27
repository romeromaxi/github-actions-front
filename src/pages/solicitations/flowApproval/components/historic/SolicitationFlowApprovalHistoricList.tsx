import {Grid, Stack} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {
    SolicitationAnalysisHistoricViewDTO,
    SolicitationAnalysisHistoricViewDTOFields,
} from "types/solicitations/solicitationAnalysisData";
import {TypographyBase} from "components/misc/TypographyBase";
import {EntityWithIdFields} from "types/baseEntities";
import {SolicitationHelper} from "util/helpers/solicitationHelper";
import {SolicitationApprovalResultType} from "types/solicitations/solicitationEnums";
import {SolicitationProposedApprovalFlowContext} from "../../SolicitationProposedApprovalFlow";
import SolicitationFlowApprovalHistoricAccordion from "./SolicitationFlowApprovalHistoricAccordion";
import SolicitationProposedCommunicationDialog from "../SolicitationProposedCommunicationDialog";
import {SolicitationViewDTOFields} from "../../../../../types/solicitations/solicitationData";
import {Systems} from "../../../../../types/workflow/workflowEnums";

function SolicitationFlowApprovalHistoricList() {
    const { solicitation, HttpAnalysis, flowTabs, flowType} = useContext(SolicitationProposedApprovalFlowContext);
    const lastValidation = SolicitationHelper.isTabActive(solicitation, flowTabs.outcome);
    const systemCode = solicitation[SolicitationViewDTOFields.SystemCode] as Systems;
    
    const [historicDataList, setHistoricDataList] = useState<SolicitationAnalysisHistoricViewDTO[]>([]);
    const [historicAnalysisDetail, setHistoricAnalysisDetail] = useState<SolicitationAnalysisHistoricViewDTO>();

    const closeCommunication = () => setHistoricAnalysisDetail(undefined);
    
    const onHandleOpenCommunication = (historicAnalysis: SolicitationAnalysisHistoricViewDTO) =>
        setHistoricAnalysisDetail(historicAnalysis);
    
    const validHistoricAnalysis = (
        analysis: SolicitationAnalysisHistoricViewDTO, firstItem: boolean,
    ) => {
        if (analysis[SolicitationAnalysisHistoricViewDTOFields.SolicitationApprovalResultCode] === SolicitationApprovalResultType.Pendant ||
            (firstItem && lastValidation))
            return false;

        return true;
    };

    useEffect(() => {
        if (solicitation[EntityWithIdFields.Id])
            HttpAnalysis.getHistoricListBySolicitationId(solicitation[EntityWithIdFields.Id])
                .then(setHistoricDataList)
    }, [solicitation]);
    
    return (
        <Grid container>
            {
                (historicDataList && !!historicDataList.length) && 
                    validHistoricAnalysis(historicDataList[0], historicDataList?.length === 1) && (
                        <TypographyBase variant={'subtitle1'} fontWeight={500}>
                            Historial de Aprobaciones
                        </TypographyBase>
                    )
            }

            <Stack spacing={1} mt={1}>
                {
                    historicDataList && historicDataList.map(
                        (prevAnalysis, idx) =>
                            validHistoricAnalysis(prevAnalysis, idx === 0) && (
                                <SolicitationFlowApprovalHistoricAccordion analysis={prevAnalysis}
                                                                           handleOpen={onHandleOpenCommunication}
                                                                           systemCode={systemCode}
                                                                           flowType={flowType}
                                />
                            ),
                    )
                }
            </Stack>

            {
                historicAnalysisDetail && 
                    <SolicitationProposedCommunicationDialog open={!!historicAnalysisDetail} 
                                                             dataAnalysis={historicAnalysisDetail}
                                                             onClose={closeCommunication}
                                                             justView
                    />
            }
        </Grid>
    )
}

export default SolicitationFlowApprovalHistoricList;