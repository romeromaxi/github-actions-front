import {
  Button,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { SearchOutlined } from '@mui/icons-material';
import React from 'react';
import {
  SolicitationAnalysisHistoricViewDTO,
  SolicitationAnalysisHistoricViewDTOFields,
} from '../../../../../types/solicitations/solicitationAnalysisData';

interface OffererSolicitationAnalyisisHistoricDataDetailProps {
  analysis: SolicitationAnalysisHistoricViewDTO;
  handleOpen: (msg: string) => void;
}

const OffererSolicitationAnalysisHistoricDataDetail = ({
  analysis,
  handleOpen,
}: OffererSolicitationAnalyisisHistoricDataDetailProps) => {
  const onHandleOpen = () =>
    handleOpen(
      analysis[SolicitationAnalysisHistoricViewDTOFields.AptitudeMessage],
    );

  return (
    <Grid container justifyContent={'center'} spacing={2}>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <Typography fontSize={16} fontWeight={600}>
            Consideraciones
          </Typography>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={5}
            fullWidth
            defaultValue={
              analysis[SolicitationAnalysisHistoricViewDTOFields.Considerations]
            }
            disabled
          />
        </Stack>
      </Grid>
      <Grid item xs={6}>
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
                NO APTO
              </Typography>
              <CloseIcon fontSize={'small'} />
            </Stack>
          </ToggleButton>
          <ToggleButton value={'apto'} color={'success'}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Typography fontSize={16} fontWeight={600}>
                APTO
              </Typography>
              <CheckIcon fontSize={'small'} />
            </Stack>
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <Typography fontSize={16} fontWeight={600}>
            Consideraciones de uso interno
          </Typography>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={5}
            fullWidth
            defaultValue={
              analysis[SolicitationAnalysisHistoricViewDTOFields.Justification]
            }
            disabled
          />
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
      <Grid item xs={5} mt={1} ml={2}>
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
  );
};

export default OffererSolicitationAnalysisHistoricDataDetail;
