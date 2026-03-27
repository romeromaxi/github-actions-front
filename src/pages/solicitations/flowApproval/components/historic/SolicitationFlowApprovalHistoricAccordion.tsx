import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Box, Button,
    Grid,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import {ExpandMore, SearchOutlined} from "@mui/icons-material";
import {TypographyBase} from "components/misc/TypographyBase";
import {dateFormatter} from "util/formatters/dateFormatter";
import {
    SolicitationAnalysisHistoricViewDTO,
    SolicitationAnalysisHistoricViewDTOFields
} from "types/solicitations/solicitationAnalysisData";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import {proposedStatusMap} from "../../../../../types/solicitations/solicitationFlowApprovalData";
import {Systems} from "../../../../../types/workflow/workflowEnums";
import {SolicitationProposedApprovalFlowTypes} from "../../../../../types/solicitations/solicitationEnums";

interface SolicitationFlowApprovalHistoricAccordionProps {
    analysis: SolicitationAnalysisHistoricViewDTO,
    handleOpen: (analysis: SolicitationAnalysisHistoricViewDTO) => void,
    systemCode: Systems,
    flowType: SolicitationProposedApprovalFlowTypes
}

function SolicitationFlowApprovalHistoricAccordion({ analysis, handleOpen, systemCode, flowType }: SolicitationFlowApprovalHistoricAccordionProps) {
    
    const onHandleOpen = () => handleOpen(analysis);
    
    return (
        <Box sx={{ border: '1px solid #EDF2F7', borderRadius: '32px' }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <TypographyBase variant={'label'} fontWeight={500}>
                        {`Análisis del ${dateFormatter.toLongDate(analysis[SolicitationAnalysisHistoricViewDTOFields.ApprovalResultDate])}`}
                    </TypographyBase>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container justifyContent={'center'} spacing={2}>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <TypographyBase variant={'label'} fontWeight={500}>
                                    Consideraciones de uso interno
                                </TypographyBase>
    
                                <TypographyBase variant={'caption'} color={'text.lighter'} whiteSpace={'pre-line'}>
                                    {analysis[SolicitationAnalysisHistoricViewDTOFields.Considerations] || "Sin consideraciones."}
                                </TypographyBase>
                            </Stack>
                        </Grid>
                        <Grid item xs={8}>
                            <ToggleButtonGroup
                                color={'primary'}
                                value={
                                    analysis[SolicitationAnalysisHistoricViewDTOFields.IsSuitable] ===
                                    true
                                        ? 'apto'
                                        : 'noapto'
                                }
                                exclusive
                                aria-label={'Aptitud'}
                                size={'large'}
                                fullWidth
                                disabled
                            >
                                <ToggleButton value={'noapto'} color={'error'}>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        <Typography fontSize={16} fontWeight={600}>
                                            {proposedStatusMap[systemCode][flowType]['false']}
                                        </Typography>
                                        <CloseIcon fontSize={'small'} />
                                    </Stack>
                                </ToggleButton>
                                <ToggleButton value={'apto'} color={'success'}>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        <Typography fontSize={16} fontWeight={600}>
                                            {proposedStatusMap[systemCode][flowType]['true']}
                                        </Typography>
                                        <CheckIcon fontSize={'small'} />
                                    </Stack>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <TypographyBase variant={'label'} fontWeight={500}>
                                    Consideraciones de uso interno
                                </TypographyBase>
    
                                <TypographyBase variant={'caption'} color={'text.lighter'} whiteSpace={'pre-line'}>
                                    {analysis[SolicitationAnalysisHistoricViewDTOFields.Justification] || "Sin justificaciones."}
                                </TypographyBase>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <ToggleButtonGroup
                                color={'primary'}
                                value={
                                    analysis[
                                        SolicitationAnalysisHistoricViewDTOFields
                                            .SolicitationApprovalResultCode
                                        ] === 2
                                        ? 'aprobado'
                                        : 'rechazado'
                                }
                                exclusive
                                aria-label={'Aprobación'}
                                size={'large'}
                                fullWidth
                                disabled
                            >
                                <ToggleButton value={'rechazado'} color={'error'}>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        <Typography fontSize={16} fontWeight={600}>
                                            RECHAZADO
                                        </Typography>
                                        <CloseIcon fontSize={'small'} />
                                    </Stack>
                                </ToggleButton>
                                <ToggleButton value={'aprobado'} color={'success'}>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        <Typography fontSize={16} fontWeight={600}>
                                            APROBADO
                                        </Typography>
                                        <CheckIcon fontSize={'small'} />
                                    </Stack>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                        <Grid item xs={5} ml={2} justifyItems={'end'}>
                            <Button
                                variant={'outlined'}
                                color={'primary'}
                                size={'small'}
                                startIcon={<SearchOutlined />}
                                onClick={onHandleOpen}
                            >
                                Ver comunicación
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

export default SolicitationFlowApprovalHistoricAccordion;