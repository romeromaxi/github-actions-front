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
  Alert,
  AlertTitle,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Skeleton } from '@mui/lab';
import FilterProductBaseAccordionStyles from 'pages/markets/lines/filter/FilterProductBaseAccordion.styles';

interface SolicitationEvaluationResultsProps {
  title: string;
  result?: SolicitationAnalysisResultViewDTO;
  alertNotDefinedAptitude?: { title?: string; description: string };
  defaultExpanded?: boolean;
}

function SolicitationEvaluationResults({
  title,
  result,
  alertNotDefinedAptitude,
  defaultExpanded,
}: SolicitationEvaluationResultsProps) {
  const classes = FilterProductBaseAccordionStyles();
  const [expanded, setExpanded] = useState<boolean>(!!defaultExpanded);
  const loading = !result;

  const hasDefinedAptitude: boolean =
    !!result &&
    result[SolicitationAnalysisHistoricViewDTOFields.HasDefinedAptitude];

  const toggleExpanded = () => setExpanded(!expanded);

  useEffect(() => {
    setExpanded(!!defaultExpanded);
  }, [defaultExpanded]);

  return loading ? (
    <Skeleton />
  ) : hasDefinedAptitude ? (
    <Accordion
      className={classes.accordionRoot}
      sx={{ width: 1, mb: 1 }}
      expanded={expanded}
      onClick={toggleExpanded}
    >
      <AccordionSummary
        className={classes.accordionSummary}
        expandIcon={<ExpandMore />}
      >
        <Typography fontWeight={500} color={'primary.light'}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetail}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 1 }}>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  result?.[SolicitationAnalysisViewDTOFields.AptitudeMessage] ??
                  '',
              }}
            />
          </Paper>
        </Grid>
      </AccordionDetails>
    </Accordion>
  ) : alertNotDefinedAptitude ? (
    <Alert severity="info">
      {alertNotDefinedAptitude.title && (
        <AlertTitle>{alertNotDefinedAptitude.title}</AlertTitle>
      )}

      {alertNotDefinedAptitude.description}
    </Alert>
  ) : (
    <></>
  );
}

export default SolicitationEvaluationResults;
