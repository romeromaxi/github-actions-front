import { SolicitationViewDTO } from '../../../../../types/solicitations/solicitationData';
import { Alert, Box, Button, Grid, Stack, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { getBaseColor } from '../../../../../util/typification/generalColors';
import { EnumColors } from '../../../../../types/general/generalEnums';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { SolicitationOffererStatusType } from '../../../../../types/solicitations/solicitationEnums';
import {
  SolicitationDocumentationAnalysisViewDTO,
  SolicitationDocumentationAnalysisViewDTOFields,
} from '../../../../../types/solicitations/solicitationDocumentationAnalysisData';
import { HttpSolicitationDocumentationAnalysis } from '../../../../../http/solicitations/httpSolicitationDocumentationAnalysis';
import { EntityWithIdFields } from '../../../../../types/baseEntities';
import {CancelRounded, SearchOutlined} from '@mui/icons-material';
import OffererSolicitationAnalysisFormDialog from './OffererSolicitationAnalysisFormDialog';

interface OffererSolicitationDocumentationResultProps {
  solicitation: SolicitationViewDTO;
  actualState: number;
}

const OffererSolicitationDocumentationResult = ({
  solicitation,
  actualState,
}: OffererSolicitationDocumentationResultProps) => {
  const navigate = useNavigate();
  const aprobada: boolean =
    actualState === SolicitationOffererStatusType.PrequalificationReceived;
  const denegada: boolean =
    actualState === SolicitationOffererStatusType.Denied;
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [solicitationAnalysis, setSolicitationAnalysis] =
    useState<SolicitationDocumentationAnalysisViewDTO>();

  useEffect(() => {
    HttpSolicitationDocumentationAnalysis.getActualBySolicitationId(
      solicitation[EntityWithIdFields.Id],
    ).then((res) => setSolicitationAnalysis(res));
  }, []);

  return (
    <Grid container spacing={1}>
      {aprobada || denegada ? (
        <>
          <Grid item xs={12}>
            <Typography fontSize={21} fontWeight={700} textAlign={'center'}>
              {aprobada
                ? `La solicitud fue aprobada`
                : 'La solicitud fue rechazada'}
            </Typography>
          </Grid>
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
            {aprobada ? (
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
                  color: '#4DAB2B'
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
          docAnalysis={solicitationAnalysis}
          justView
          prevMessage={
            solicitationAnalysis[
              SolicitationDocumentationAnalysisViewDTOFields.AptitudeMessage
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

export default OffererSolicitationDocumentationResult;
