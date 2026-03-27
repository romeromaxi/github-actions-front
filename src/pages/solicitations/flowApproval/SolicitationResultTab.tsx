import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {
    SolicitationOffererStatusType, SolicitationProposedApprovalFlowTypes
} from "types/solicitations/solicitationEnums";
import {Alert, Box, Button, Grid, Stack} from "@mui/material";
import React, {useContext, useState} from "react";
import {SolicitationHelper} from "util/helpers/solicitationHelper";
import {useNavigate} from "react-router-dom";
import {
    SolicitationApprovalViewDTOFields
} from "types/solicitations/solicitationApprovalData";
import {CancelRounded, SearchOutlined} from "@mui/icons-material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {getBaseColor} from "util/typification/generalColors";
import {EnumColors} from "types/general/generalEnums";
import {dateFormatter} from "util/formatters/dateFormatter";
import {SolicitationProposedApprovalFlowContext} from "./SolicitationProposedApprovalFlow";
import { TypographyBase } from "components/misc/TypographyBase";
import SolicitationProposedCommunicationDialog from "./components/SolicitationProposedCommunicationDialog";
import { Systems } from "types/workflow/workflowEnums";

const titleResultMap : Record<Systems, 
    Record<SolicitationProposedApprovalFlowTypes, Record<'true' | 'false', string>>> 
= {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'true': 'La confirmación de admisión fue enviada',
            'false': 'La solicitud no fue admitida'
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'true': 'La solicitud fue aprobada',
            'false': 'La solicitud fue rechazada'
        }
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'true': '',
            'false': ''
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'true': '',
            'false': ''
        }
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            'true': 'La confirmación de recepción fue enviada',
            'false': 'La solicitud no fue admitida'
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            'true': 'Se le comunicó a la MiPyME la finalización de la asistencia. Queda abierto el chat para que puedas seguir comunicándote con la empresa',
            'false': 'Se le comunicó a la MiPyME la finalización de la asistencia. Queda abierto el chat para que puedas seguir comunicándote con la empresa'
        }
    },
}

function SolicitationResultTab() {
    const { 
        solicitation, flowTabs: { outcome }, flowType, analysisSituation, approvalSituation 
    } = useContext(SolicitationProposedApprovalFlowContext);
    
    const navigate = useNavigate();
    const tabActive = SolicitationHelper.isTabActive(solicitation, outcome);
    const alreadyPassedTab = SolicitationHelper.alreadyPassedTab(solicitation, outcome);
    
    const systemCode = solicitation[SolicitationViewDTOFields.SystemCode] as Systems;
    const actualState = solicitation[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode];
    const denied: boolean = 
        actualState === SolicitationOffererStatusType.Denied ||
        actualState === SolicitationOffererStatusType.SolicitationUnableDerivation;

    const [formOpen, setFormOpen] = useState<boolean>(false);
    
    return (
        <Grid container spacing={1}>
            {
                (tabActive || alreadyPassedTab) ?
                    <React.Fragment>

                        {
                            approvalSituation && (
                            <Grid item xs={12} textAlign={'center'}>
                                <TypographyBase variant={'h5'} fontWeight={600}>
                                    {titleResultMap[systemCode][flowType][denied ? 'false' : 'true']}
                                    {` `}
                                    <TypographyBase variant={'caption'}
                                                    fontWeight={400}
                                                    color={'text.lighter'}
                                                    mt={'2px !important'}
                                                    sx={{ columnFill: 'balance' }}
                                    >
                                        {`  (${dateFormatter.toLongDate(approvalSituation[SolicitationApprovalViewDTOFields.ApprovalResultDate])})`}
                                    </TypographyBase>
                                </TypographyBase>
                            </Grid>
                        )}
                        
                        <Grid item xs={12} textAlign="center">
                            <Box sx={{ maxWidth: '500px' }} />
                            {denied ? (
                                <CancelRounded
                                    sx={{
                                        userSelect: 'none',
                                        width: '1em',
                                        height: '1em',
                                        display: 'inline-block',
                                        flexShrink: 0,
                                        transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                        fontSize: '100px',
                                        marginBottom: '16px',
                                        color: getBaseColor(EnumColors.RED),
                                    }}
                                />
                            ) : (
                                <CheckCircleRoundedIcon
                                    sx={{
                                        userSelect: 'none',
                                        width: '1em',
                                        height: '1em',
                                        display: 'inline-block',
                                        flexShrink: 0,
                                        transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                        fontSize: '100px',
                                        marginBottom: '16px',
                                        color: '#4DAB2B',
                                    }}
                                />
                            )}
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Stack direction={'row'} spacing={5} justifyContent={'center'}>
                                <Button variant={'contained'} 
                                        color={'inherit'} 
                                        onClick={() => {
                                            navigate('/offerer/solicitations');
                                        }}
                                >
                                    Ir a solicitudes
                                </Button>
                                <Button variant={'outlined'} 
                                        color={'primary'}
                                        startIcon={<SearchOutlined />} 
                                        onClick={() => {
                                            setFormOpen(true);
                                        }}
                                >
                                    Ver comunicación
                                </Button>
                            </Stack>
                        </Grid>
                    </React.Fragment>
                    :
                    <Grid item xs={12}>
                        <Box sx={{ width: '100%' }}>
                            <Alert severity="info">La solicitud aún no pudo ser evaluada</Alert>
                        </Box>
                    </Grid>
            }

            {
                analysisSituation && 
                    <SolicitationProposedCommunicationDialog open={formOpen} 
                                                             dataAnalysis={analysisSituation}
                                                             justView
                                                             onClose={() => setFormOpen(false)}
                    />
            }
        </Grid>
    )
}

export default SolicitationResultTab;