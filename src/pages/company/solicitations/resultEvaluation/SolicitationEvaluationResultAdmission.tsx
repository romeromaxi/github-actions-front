import React, { useEffect, useState } from 'react';
import { HttpSolicitationAnalysis } from 'http/solicitations/httpSolicitationAnalysis';
import {
  SolicitationAnalysisHistoricViewDTOFields,
  SolicitationAnalysisResultViewDTO,
  SolicitationAnalysisViewDTOFields,
} from 'types/solicitations/solicitationAnalysisData';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Skeleton } from '@mui/lab';
import FilterProductBaseAccordionStyles from '../../../markets/lines/filter/FilterProductBaseAccordion.styles';

interface SolicitationEvaluationResultAdmissionProps {
  solicitationId: number;
}

function SolicitationEvaluationResultAdmission({
  solicitationId,
}: SolicitationEvaluationResultAdmissionProps) {
  const classes = FilterProductBaseAccordionStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const [admissionResult, setAdmissionResult] =
    useState<SolicitationAnalysisResultViewDTO>();

  const hasDefinedAptitude: boolean =
    !!admissionResult &&
    admissionResult[
      SolicitationAnalysisHistoricViewDTOFields.HasDefinedAptitude
    ];

  useEffect(() => {
    setLoading(true);
    HttpSolicitationAnalysis.getResultBySolicitationId(solicitationId)
      .then(setAdmissionResult)
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Skeleton />
  ) : hasDefinedAptitude ? (
    <Accordion sx={{ width: 1, mb: 1 }} className={classes.accordionRoot}>
      <AccordionSummary
        className={classes.accordionSummary}
        expandIcon={<ExpandMore />}
      >
        <Typography fontWeight={500} color={'primary.light'}>
          Admisión
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetail}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  admissionResult?.[
                    SolicitationAnalysisViewDTOFields.AptitudeMessage
                  ] ?? '',
              }}
            />
          </Paper>
        </Grid>
      </AccordionDetails>
    </Accordion>
  ) : (
    <Alert severity={'info'}>La solicitud no ha sido evaluada.</Alert>
  );
}

export default SolicitationEvaluationResultAdmission;
