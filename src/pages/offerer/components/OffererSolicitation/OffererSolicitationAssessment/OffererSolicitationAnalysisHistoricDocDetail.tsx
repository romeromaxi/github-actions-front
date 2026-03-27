import {
  Button,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  SolicitationDocumentationAnalysisHistoricViewDTO,
  SolicitationDocumentationAnalysisHistoricViewDTOFields,
} from '../../../../../types/solicitations/solicitationDocumentationAnalysisData';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { SearchOutlined } from '@mui/icons-material';
import React from 'react';

interface OffererSolicitationAnalysisHistoricDocDetailProps {
  analysis: SolicitationDocumentationAnalysisHistoricViewDTO;
  handleOpen: (message: string) => void;
}

const OffererSolicitationAnalysisHistoricDocDetail = ({
  analysis,
  handleOpen,
}: OffererSolicitationAnalysisHistoricDocDetailProps) => {
  const onHandleOpen = () =>
    handleOpen(
      analysis[
        SolicitationDocumentationAnalysisHistoricViewDTOFields.AptitudeMessage
      ],
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
              analysis[
                SolicitationDocumentationAnalysisHistoricViewDTOFields
                  .Considerations
              ]
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
              SolicitationDocumentationAnalysisHistoricViewDTOFields.IsSuitable
            ] === true
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
              analysis[
                SolicitationDocumentationAnalysisHistoricViewDTOFields
                  .Justification
              ]
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
              SolicitationDocumentationAnalysisHistoricViewDTOFields
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

export default OffererSolicitationAnalysisHistoricDocDetail;
