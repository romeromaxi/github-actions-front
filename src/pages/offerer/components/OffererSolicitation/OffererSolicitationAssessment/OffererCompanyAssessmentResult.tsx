import { Alert, Box, Button, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {CancelRounded, SearchOutlined} from '@mui/icons-material';
import OffererSolicitationAnalysisFormDialog from './OffererSolicitationAnalysisFormDialog';
import { getBaseColor } from '../../../../../util/typification/generalColors';
import { HttpSolicitationAnalysis } from '../../../../../http/solicitations/httpSolicitationAnalysis';
import { EnumColors } from '../../../../../types/general/generalEnums';
import { SolicitationOffererStatusType } from '../../../../../types/solicitations/solicitationEnums';
import {
  SolicitationAnalysisViewDTO,
  SolicitationAnalysisViewDTOFields,
} from '../../../../../types/solicitations/solicitationAnalysisData';
import { SolicitationViewDTO } from '../../../../../types/solicitations/solicitationData';
import { EntityWithIdFields } from '../../../../../types/baseEntities';
import { dateFormatter } from '../../../../../util/formatters/dateFormatter';
import {
  SolicitationApprovalViewDTO,
  SolicitationApprovalViewDTOFields,
} from '../../../../../types/solicitations/solicitationApprovalData';
import { HttpSolicitationApproval } from '../../../../../http/solicitations/httpSolicitationApproval';

interface OffererCompanyAssessmentResultProps {
  solicitation: SolicitationViewDTO;
  actualState: number;
}

const OffererCompanyAssessmentResult = ({
  solicitation,
  actualState,
}: OffererCompanyAssessmentResultProps) => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [solicitationAnalysis, setSolicitationAnalysis] =
    useState<SolicitationAnalysisViewDTO>();
  const [solicitationApproval, setSolicitationApproval] =
    useState<SolicitationApprovalViewDTO>();
  const approved: boolean =
    actualState === SolicitationOffererStatusType.PrequalificationAnalyisis ||
    actualState === SolicitationOffererStatusType.PrequalificationApproval ||
    actualState === SolicitationOffererStatusType.PrequalificationReceived ||
    actualState === SolicitationOffererStatusType.Derivation ||
    actualState === SolicitationOffererStatusType.SolicitationSGRResponse ||
    actualState === SolicitationOffererStatusType.SolicitionPymeResponse ||
    actualState === SolicitationOffererStatusType.SolicitationResponseMatcher
  const denied: boolean = actualState === SolicitationOffererStatusType.Denied ||
      actualState === SolicitationOffererStatusType.SolicitationUnableDerivation;

  useEffect(() => {
    HttpSolicitationAnalysis.getActualBySolicitationId(
      solicitation[EntityWithIdFields.Id],
    ).then((res) => setSolicitationAnalysis(res));
    HttpSolicitationApproval.getActualBySolicitationId(
      solicitation[EntityWithIdFields.Id],
    ).then((res) => setSolicitationApproval(res));
  }, []);

  return (
    <Grid container spacing={1}>
      {approved || denied ? (
        <>
          {solicitationApproval && (
            <Grid item xs={12}>
              <Stack direction={'row'} alignItems={'center'} spacing={1} justifyContent={'center'}>
                <Typography fontSize={20} fontWeight={700} textAlign={'center'}>
                  {approved
                    ? `La confirmación de recepción fue enviada `
                    : 'La solicitud no fue admitida'}
                </Typography>
                <Typography
                  fontSize={15}
                  fontWeight={600}
                  color={'#A1A5B7 !important'}
                >
                  {approved &&
                    `(${dateFormatter.toLongDate(solicitationApproval[SolicitationApprovalViewDTOFields.ApprovalResultDate])})`}
                </Typography>
              </Stack>
            </Grid>
          )}
          <Grid item xs={12} mb={3}>
            <Typography
              fontSize={14}
              fontWeight={500}
              color={'#A1A5B7 !important'}
              textAlign={'center'}
            >
              El resultado ha sido enviado a la pyme
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Box sx={{ maxWidth: '500px' }} />
            {approved ? (
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
            ) : (
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
            )}
          </Grid>
          <Grid item xs={12}>
            <Stack direction={'row'} spacing={5} justifyContent={'center'}>
              <Button
                variant={'contained'}
                color={'inherit'}
                onClick={() => {
                  navigate('/offerer/solicitations');
                }}
              >
                Ir a solicitudes
              </Button>
              <Button
                variant={'outlined'}
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
        </>
      ) : (
        <Grid item xs={12}>
          <Box sx={{ width: '100%' }}>
            <Alert severity="info">La solicitud aún no pudo ser evaluada</Alert>
          </Box>
        </Grid>
      )}
      {solicitationAnalysis && (
        <OffererSolicitationAnalysisFormDialog
          open={formOpen}
          solicitation={solicitation}
          dataAnalysis={solicitationAnalysis}
          justView
          prevMessage={
            solicitationAnalysis[
              SolicitationAnalysisViewDTOFields.AptitudeMessage
            ]
          }
          onClose={() => {
            setFormOpen(false);
          }}
        />
      )}
    </Grid>
  );
};

export default OffererCompanyAssessmentResult;
