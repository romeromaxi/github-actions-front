import {Box, Button, Grid, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography} from "@mui/material";
import {
    SolicitationAnalysisViewDTO,
    SolicitationAnalysisViewDTOFields
} from "types/solicitations/solicitationAnalysisData";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import {SearchOutlined} from "@mui/icons-material";
import React, {useContext, useState} from "react";
import {SolicitationHelper} from "util/helpers/solicitationHelper";
import {SolicitationProposedApprovalFlowContext} from "../SolicitationProposedApprovalFlow";
import SolicitationProposedCommunicationDialog from "./SolicitationProposedCommunicationDialog";
import {OffererSolicitationAnalysisFormDataRequest} from "types/offerer/offererSolicitationData";
import {SafetyComponent} from "components/security";
import {Systems} from "types/workflow/workflowEnums";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {proposedStatusMap} from "types/solicitations/solicitationFlowApprovalData";
import {useSolicitation} from "../../../../hooks/contexts/SolicitationsContext";

interface SolicitationProposedCommunicationProps {
    dataAnalysis?: SolicitationAnalysisViewDTO;
    safetyComponentName?: string;
    safetyObjectName?: string;
    handleSaveCommunication: (aptitude: string, msgs?: OffererSolicitationAnalysisFormDataRequest[]) => void;
    hasPermissions: boolean;
}

function SolicitationProposedCommunication({ dataAnalysis, safetyComponentName, safetyObjectName, handleSaveCommunication, hasPermissions }: SolicitationProposedCommunicationProps) {
    const { permissionWorkflowCode } = useSolicitation();
    const { solicitation, flowTabs: { proposal }, flowType } = useContext(SolicitationProposedApprovalFlowContext);
    const alreadyPassedTab = SolicitationHelper.alreadyPassedTab(solicitation, proposal);
    const systemCode = solicitation[SolicitationViewDTOFields.SystemCode] as Systems;

    const [aptitude, setAptitude] = useState<string>('');
    const [openCommunicationDialog, setOpenCommunicationDialog] = useState<boolean>(false);
    
    const showCommunicationDialog = () => setOpenCommunicationDialog(true);
    
    const closeCommunicationDialog = () => setOpenCommunicationDialog(false); 
    
    const handleChange = (event: React.MouseEvent<HTMLElement>, newAptitude: string) => setAptitude(newAptitude);

    const onSaveCommunication = (msgs?: OffererSolicitationAnalysisFormDataRequest[]) => {
        handleSaveCommunication(aptitude, msgs);
        closeCommunicationDialog();
    };

    const getSuitableSituation = () => {
        if (alreadyPassedTab) {
            return !!(dataAnalysis?.[SolicitationAnalysisViewDTOFields.IsSuitable]);
        } else {
            return aptitude === 'apto';
        }
    };
    
    const ToggleButtonGroupComponent =
        <ToggleButtonGroup
            color={'primary'}
            value={
                (!alreadyPassedTab || !dataAnalysis)
                    ? aptitude
                    : dataAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable]
                        ? 'apto'
                        : 'noapto'
            }
            exclusive
            onChange={handleChange}
            aria-label={'Aptitud'}
            size={'large'}
            fullWidth
            disabled={alreadyPassedTab || !hasPermissions}
        >
            <ToggleButton value={'noapto'} color={'error'} disabled={alreadyPassedTab}>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Typography fontSize={16} fontWeight={600}>
                        {proposedStatusMap[systemCode][flowType]['false']}
                    </Typography>
                    <CloseIcon fontSize={'small'} />
                </Stack>
            </ToggleButton>
            <ToggleButton value={'apto'} color={'success'} disabled={alreadyPassedTab}>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Typography fontSize={16} fontWeight={600}>
                        {proposedStatusMap[systemCode][flowType]['true']}
                    </Typography>
                    <CheckIcon fontSize={'small'} />
                </Stack>
            </ToggleButton>
        </ToggleButtonGroup>;
    
    return (
        <Grid container alignItems={'center'}>
            <Grid item xs={6}>
                {
                    hasPermissions ?
                        <SafetyComponent
                            componentName={safetyComponentName ?? ""}
                            objectName={safetyObjectName ?? ""}
                            permissionWorkflowCode={permissionWorkflowCode}
                            disabled={alreadyPassedTab}
                        >
                            {ToggleButtonGroupComponent}
                        </SafetyComponent>
                        :
                        ToggleButtonGroupComponent
                }
            </Grid>

            <Grid item xs={6} justifyItems={'end'}>
                <SafetyComponent
                    componentName={safetyComponentName ?? ""}
                    objectName={safetyObjectName ?? ""}
                    permissionWorkflowCode={permissionWorkflowCode}
                >
                    <Stack direction={'row'} justifyContent={'flex-end'}>
                        {
                            (!alreadyPassedTab && hasPermissions) && (
                                <Tooltip title={!aptitude ? 'Primero tenés que seleccionar un estado para poder avanzar' : undefined}>
                                    <Box>
                                        <Button
                                            variant={'contained'}
                                            color={'primary'}
                                            size={'small'}
                                            startIcon={<PlagiarismIcon />}
                                            onClick={showCommunicationDialog}
                                            disabled={!aptitude}
                                        >
                                            Ver y preparar comunicación
                                        </Button>
                                    </Box>
                                </Tooltip>
                            )
                        }
                    </Stack>
                </SafetyComponent>

                {
                    alreadyPassedTab && (
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            size={'small'}
                            startIcon={<SearchOutlined />}
                            onClick={showCommunicationDialog}
                        >
                            Ver comunicación
                        </Button>
                    )
                }
            </Grid>
            
            <SolicitationProposedCommunicationDialog open={openCommunicationDialog} 
                                                     suitable={getSuitableSituation()}
                                                     justView={alreadyPassedTab}
                                                     dataAnalysis={dataAnalysis}
                                                     onSave={onSaveCommunication}
                                                     onClose={closeCommunicationDialog}
            />
        </Grid>
    )
}

export default SolicitationProposedCommunication;