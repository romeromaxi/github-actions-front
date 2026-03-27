import {SolicitationViewDTO} from "../../../types/solicitations/solicitationData";
import React, {useEffect, useState} from "react";
import {
    SolicitationAnalysisHistoricViewDTOFields,
    SolicitationAnalysisResultViewDTO, SolicitationAnalysisViewDTOFields
} from "../../../types/solicitations/solicitationAnalysisData";
import {Card, CardContent, CardHeader, Chip, Grid, Stack, Typography} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {HttpSolicitationAnalysis} from "../../../http/solicitations/httpSolicitationAnalysis";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {HttpSolicitationDocumentationAnalysis} from "../../../http/solicitations/httpSolicitationDocumentationAnalysis";
import SolicitationEvaluationResults from "./resultEvaluation/SolicitationEvaluationResults";


interface CompanySolicitationAssessmentCenterPanelThirdProps {
    solicitation: SolicitationViewDTO
}


const CompanySolicitationAssessmentCenterPanelThird = ({solicitation} : CompanySolicitationAssessmentCenterPanelThirdProps) => {
    const [admissionResult, setAdmissionResult] =
        useState<SolicitationAnalysisResultViewDTO>();
    const [prequalificationResult, setPrequalificationResult] =
        useState<SolicitationAnalysisResultViewDTO>();

    const hasDefinedAptitudeAdmission: boolean =
        !!admissionResult &&
        admissionResult[
            SolicitationAnalysisHistoricViewDTOFields.HasDefinedAptitude
            ];
    const hasDefinedAptitudePrequalification: boolean =
        !!prequalificationResult &&
        prequalificationResult[
            SolicitationAnalysisHistoricViewDTOFields.HasDefinedAptitude
            ];

    const stateResult = (
        <Stack mt={'0.5rem'}>
            {hasDefinedAptitudePrequalification ? (
                prequalificationResult?.[
                    SolicitationAnalysisViewDTOFields.IsSuitable
                    ] ? (
                    <Chip
                        color={'success'}
                        label={
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography fontWeight={600}>Aprobado</Typography>
                                <CheckIcon />
                            </Stack>
                        }
                    />
                ) : (
                    <Chip
                        color={'error'}
                        label={
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography fontWeight={600}>No Apto</Typography>
                                <CloseIcon />
                            </Stack>
                        }
                    />
                )
            ) : hasDefinedAptitudeAdmission ? (
                admissionResult?.[SolicitationAnalysisViewDTOFields.IsSuitable] ? (
                    <Chip
                        color={'success'}
                        label={
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography fontWeight={600}>Admitida</Typography>
                                <CheckIcon />
                            </Stack>
                        }
                    />
                ) : (
                    <Chip
                        color={'error'}
                        label={
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Typography fontWeight={600}>No Admitida</Typography>
                                <CloseIcon />
                            </Stack>
                        }
                    />
                )
            ) : (
                <></>
            )}
        </Stack>
    );

    const alertAdmission =
        'El oferente no ha notificado aún la admisión de tu solicitud para el análisis de precalificación.';

    const alertTitlePrequalification =
        'Tu solicitud se encuentra en análisis de precalificación.';
    const alertPrequalification =
        'De considerarlo necesario, el oferente se comunicará a través del chat y requerirá o enviará ' +
        'documentación complementaria a través de las solapas correspondientes. \n' +
        'Ante cualquier consulta podés enviarle un mensaje por el chat.“';

    useEffect(() => {
        Promise.all([
            HttpSolicitationAnalysis.getResultBySolicitationId(
                solicitation[EntityWithIdFields.Id],
            ),
            HttpSolicitationDocumentationAnalysis.getResultBySolicitationId(
                solicitation[EntityWithIdFields.Id],
            ),
        ]).then(([admResponse, preqResponse]) => {
            setAdmissionResult(admResponse);
            setPrequalificationResult(preqResponse);
        });
    }, [solicitation]);

    return (
        <Card>
            <CardHeader title={'Evaluación de la Solicitud'} action={stateResult} />

            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <SolicitationEvaluationResults
                            title={'Recepción'}
                            result={admissionResult}
                            alertNotDefinedAptitude={{ description: alertAdmission }}
                            defaultExpanded={!hasDefinedAptitudePrequalification}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <SolicitationEvaluationResults
                            title={'Derivación'}
                            result={prequalificationResult}
                            alertNotDefinedAptitude={
                                hasDefinedAptitudeAdmission
                                    ? {
                                        title: alertTitlePrequalification,
                                        description: alertPrequalification,
                                    }
                                    : undefined
                            }
                            defaultExpanded
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}


export default CompanySolicitationAssessmentCenterPanelThird