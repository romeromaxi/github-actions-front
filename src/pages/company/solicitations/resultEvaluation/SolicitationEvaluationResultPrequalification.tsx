import React, { useEffect, useState } from 'react';
import {
  SolicitationAnalysisHistoricViewDTOFields,
  SolicitationAnalysisResultViewDTO,
  SolicitationAnalysisViewDTOFields,
} from 'types/solicitations/solicitationAnalysisData';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Skeleton } from '@mui/lab';
import FilterProductBaseAccordionStyles from '../../../markets/lines/filter/FilterProductBaseAccordion.styles';
import { HttpSolicitationDocumentationAnalysis } from 'http/solicitations/httpSolicitationDocumentationAnalysis';

interface SolicitationEvaluationResultPrequalificationProps {
  solicitationId: number;
}

function SolicitationEvaluationResultPrequalification({
  solicitationId,
}: SolicitationEvaluationResultPrequalificationProps) {
  const classes = FilterProductBaseAccordionStyles();

  const [loading, setLoading] = useState<boolean>(false);
  const [prequalificationResult, setPrequalificationResult] =
    useState<SolicitationAnalysisResultViewDTO>();

  const hasDefinedAptitude: boolean =
    !!prequalificationResult &&
    prequalificationResult[
      SolicitationAnalysisHistoricViewDTOFields.HasDefinedAptitude
    ];

  useEffect(() => {
    setLoading(true);
    HttpSolicitationDocumentationAnalysis.getResultBySolicitationId(
      solicitationId,
    )
      .then(setPrequalificationResult)
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
          Precalificación
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetail}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  prequalificationResult?.[
                    SolicitationAnalysisViewDTOFields.AptitudeMessage
                  ] ?? '',
              }}
            />
          </Paper>
        </Grid>
      </AccordionDetails>
    </Accordion>
  ) : (
    <></>
  );
}

export default SolicitationEvaluationResultPrequalification;
