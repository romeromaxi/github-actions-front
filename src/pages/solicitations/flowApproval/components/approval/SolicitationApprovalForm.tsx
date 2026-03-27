import {
    SolicitationApprovalResultViewDTO,
    SolicitationApprovalResultViewDTOFields,
    SolicitationApprovalViewDTOFields
} from "types/solicitations/solicitationApprovalData";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {HttpCacheSolicitation} from "http/index";
import {
    Button,
    Grid,
    Paper,
    Skeleton,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {SolicitationProposedApprovalFlowContext} from "../../SolicitationProposedApprovalFlow";
import {dateFormatter} from "util/formatters/dateFormatter";
import {SolicitationAnalysisViewDTOFields} from "types/solicitations/solicitationAnalysisData";
import {EntityWithIdAndDescriptionFields} from "types/baseEntities";
import CheckIcon from "@mui/icons-material/Check";
import ReplyIcon from "@mui/icons-material/Reply";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import useSecurityObject from "hooks/useSecurityObject";
import {SolicitationHelper} from "util/helpers/solicitationHelper";
import {Systems} from "types/workflow/workflowEnums";
import {SolicitationProposedApprovalFlowTypes} from "types/solicitations/solicitationEnums";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {SafetyComponent, SafetyGridComponent } from "components/security";

interface SolicitationApprovalFormProps {
    handleContinue: (justification: string, approval: string) => void,
    safetyComponentName: string,
    safetyObjectName: string,
}

const titleApprovalFormMap : Record<Systems, Record<SolicitationProposedApprovalFlowTypes, string>> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: "Aprobación de recepción de solicitud",
        [SolicitationProposedApprovalFlowTypes.SendingResults]: "Aprobación de recepción de solicitud"
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: "",
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ""
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: "Aprobación de recepción de solicitud",
        [SolicitationProposedApprovalFlowTypes.SendingResults]: "Aprobación de cierre de la asistencia"
    },
}

const subtitleApprovalFormMap : Record<Systems, Record<SolicitationProposedApprovalFlowTypes, string>> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: "Formulario de análisis",
        [SolicitationProposedApprovalFlowTypes.SendingResults]: "Formulario de análisis"
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: "",
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ""
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: "Comunicación de recepción",
        [SolicitationProposedApprovalFlowTypes.SendingResults]: "Formulario de análisis"
    },
}

function SolicitationApprovalForm({
    handleContinue, safetyComponentName, safetyObjectName
}: SolicitationApprovalFormProps) {
    const { 
        analysisSituation, approvalSituation, solicitation, flowTabs, flowType 
    } = useContext(SolicitationProposedApprovalFlowContext);
    const { isStageResponsible } = useSolicitation();
    const { hasWritePermission } = useSecurityObject();
    const writePermission =
        (!safetyComponentName || !safetyObjectName || hasWritePermission(safetyComponentName, safetyObjectName)) &&
        isStageResponsible;
    
    const isTabActive = SolicitationHelper.isTabActive(solicitation, flowTabs.approval);
    const alreadyPassedTab = SolicitationHelper.alreadyPassedTab(solicitation, flowTabs.approval);
    
    const [approvalResults, setApprovalResults] = useState<SolicitationApprovalResultViewDTO[]>([]);
    const [approval, setApproval] = useState<string>('');
    const [justification, setJustification] = useState<string>('');

    const handleChange = (event: React.MouseEvent<HTMLElement>, approvalState: string) =>
        setApproval(approvalState);
    
    const onChangeTextField = (e: ChangeEvent<HTMLInputElement>) =>
        setJustification(e.target.value);

    const getDefaultTextField = () =>
        alreadyPassedTab && approvalSituation ? approvalSituation[SolicitationApprovalViewDTOFields.Justification] : '';
    
    useEffect(() => {
        HttpCacheSolicitation.getApprovalResults()
            .then(response => setApprovalResults(response.reverse()));
    }, []);
    
    return (
        <Grid item xs={12} container spacing={1}>
            <Grid item xs={12}>
                <Typography variant={'h5'} fontWeight={500}>
                    {titleApprovalFormMap[solicitation[SolicitationViewDTOFields.SystemCode] as Systems][flowType]}
                </Typography>
            </Grid>
            
            <Grid item xs={12}>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Typography variant={'subtitle1'} fontWeight={500}>
                        {subtitleApprovalFormMap[solicitation[SolicitationViewDTOFields.SystemCode] as Systems][flowType]}
                    </Typography>

                    {
                        analysisSituation &&
                            <TypographyBase variant={'caption'} color={'text.lighter'}>
                                {`(${dateFormatter.toLongDate(analysisSituation[SolicitationAnalysisViewDTOFields.AptitudeDate])})`}
                            </TypographyBase>
                    }
                </Stack>
            </Grid>
            
            <Grid item xs={12} container spacing={3}>
                {
                    analysisSituation ?
                        <Grid xs={12} p={3}>
                            <Paper elevation={2} sx={{ p: 1 }}>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: analysisSituation[SolicitationAnalysisViewDTOFields.AptitudeMessage],
                                    }}
                                />
                            </Paper>
                        </Grid>
                        :
                        <Stack spacing={2} sx={{ width: '90%' }} mt={2} ml={2}>
                            <Skeleton sx={{ width: ' 100%' }} />
                            <Skeleton sx={{ width: ' 100%' }} />
                            <Skeleton sx={{ width: ' 100%' }} />
                            <Skeleton sx={{ width: ' 100%' }} />
                        </Stack>
                }
            </Grid>

            <SafetyGridComponent
                componentName={safetyComponentName}
                objectName={safetyObjectName}
                disabled={alreadyPassedTab || !writePermission}
                item
                xs={12}
                mb={2}
            >
                <ToggleButtonGroup
                    color={'primary'}
                    value={
                        isTabActive
                            ? approval
                            : approvalSituation?.[SolicitationApprovalViewDTOFields.SolicitationApprovalResultCode] ?? 0
                    }
                    exclusive
                    onChange={handleChange}
                    aria-label={'Aprobacion'}
                    size={'large'}
                    fullWidth
                    disabled={!writePermission}
                >
                    {approvalResults.length !== 0 &&
                        approvalResults.map((state) => (
                            <ToggleButton
                                value={state[EntityWithIdAndDescriptionFields.Id]}
                                color={
                                    state[EntityWithIdAndDescriptionFields.Id] === 2
                                        ? 'success'
                                        : 'error'
                                }
                                disabled={alreadyPassedTab || !writePermission}
                            >
                                <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                                    <Stack spacing={0.5}>
                                        <Typography fontSize={17} fontWeight={700}>
                                            {state[EntityWithIdAndDescriptionFields.Description]}
                                        </Typography>
                                        <Typography
                                            fontSize={10}
                                            fontWeight={600}
                                            color={'#A1A5B7 !important'}
                                        >
                                            {state[SolicitationApprovalResultViewDTOFields.Detail]}
                                        </Typography>
                                    </Stack>
                                    {state[EntityWithIdAndDescriptionFields.Id] === 2 ? (
                                        <CheckIcon fontSize={'small'} />
                                    ) : (
                                        <ReplyIcon fontSize={'small'} />
                                    )}
                                </Stack>
                            </ToggleButton>
                        ))}
                </ToggleButtonGroup>
            </SafetyGridComponent>
        
            <Grid item xs={12}>
                <Typography variant={'body2'} fontWeight={500}>
                    Consideraciones de uso interno
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {
                    (!!approvalSituation) ?
                        (writePermission && isTabActive) ?
                            <TextField
                                id="outlined-multiline-static"
                                multiline
                                rows={5}
                                fullWidth
                                onChange={onChangeTextField}
                                defaultValue={getDefaultTextField()}
                                disabled={alreadyPassedTab || !writePermission}
                            />
                            :
                            <TypographyBase variant={'caption'} color={'text.lighter'} whiteSpace={'pre-line'}>
                                {getDefaultTextField() || "Sin consideraciones."}
                            </TypographyBase>
                        :
                        <Skeleton />
                }
            </Grid>

            <Grid item xs={12}>
                <Stack direction={'row'} justifyContent={'flex-end'}>                    
                    {
                        (isTabActive && writePermission) &&
                            <SafetyComponent
                                componentName={safetyComponentName}
                                objectName={safetyObjectName}
                                disabled={!approval}
                            >
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    onClick={() => handleContinue(justification, approval)}
                                    disabled={!approval}
                                >
                                    Continuar
                                </Button>
                            </SafetyComponent>
                    }
                </Stack>
            </Grid>
        </Grid>
    )
}

export default SolicitationApprovalForm;