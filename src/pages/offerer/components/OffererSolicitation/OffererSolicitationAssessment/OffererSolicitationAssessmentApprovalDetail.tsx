import {
  Button,
  Grid,
  Link,
  Paper,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  SolicitationAnalysisViewDTO,
  SolicitationAnalysisViewDTOFields,
} from '../../../../../types/solicitations/solicitationAnalysisData';
import {
  SolicitationApprovalResultViewDTO,
  SolicitationApprovalResultViewDTOFields,
  SolicitationApprovalViewDTO,
  SolicitationApprovalViewDTOFields,
} from '../../../../../types/solicitations/solicitationApprovalData';
import { EntityWithIdAndDescriptionFields } from '../../../../../types/baseEntities';
import CheckIcon from '@mui/icons-material/Check';
import ReplyIcon from '@mui/icons-material/Reply';
import React, { ChangeEvent, useContext, useState } from 'react';
import {
  SolicitationDocumentationAnalysisViewDTO,
  SolicitationDocumentationAnalysisViewDTOFields,
} from '../../../../../types/solicitations/solicitationDocumentationAnalysisData';
import {
  SolicitationDocumentationApprovalViewDTO,
  SolicitationDocumentationApprovalViewDTOFields,
} from '../../../../../types/solicitations/solicitationDocumentationApprovalData';
import { dateFormatter } from '../../../../../util/formatters/dateFormatter';
import {
  OffererSolicitationApprovalSecObjects,
  OffererSolicitationDocumentationValidationSecObjects,
  SecurityComponents,
} from '../../../../../types/security';
import {
  SafetyComponent,
  SafetyGridComponent,
} from '../../../../../components/security';
import { SolicitationNavHeaderContext } from '../OffererSolicitationNavHeader';
import useSecurityObject from '../../../../../hooks/useSecurityObject';
import {useSolicitation} from "../../../../../hooks/contexts/SolicitationsContext";

interface OffererSolicitationAssessmentApprovalDetailProps {
  viewState: boolean;
  data: boolean;
  approvalResults: SolicitationApprovalResultViewDTO[];
  dataApproval?: SolicitationApprovalViewDTO;
  dataAnalysis?: SolicitationAnalysisViewDTO;
  docApproval?: SolicitationDocumentationApprovalViewDTO;
  docAnalysis?: SolicitationDocumentationAnalysisViewDTO;
  handleContinue: (justification: string, approval: string) => void;
  safetyComponentName: SecurityComponents;
  safetyObjectName:
    | OffererSolicitationApprovalSecObjects
    | OffererSolicitationDocumentationValidationSecObjects;
}

const OffererSolicitationAssessmentApprovalDetail = ({
  safetyComponentName,
  safetyObjectName,
  ...props
}: OffererSolicitationAssessmentApprovalDetailProps) => {
  const { isStageResponsible } = useSolicitation();
  const { hasWritePermission } = useSecurityObject();
  const writePermission =
    hasWritePermission(safetyComponentName, safetyObjectName) &&
    isStageResponsible;

  const [approval, setApproval] = useState<string>('');
  const [justification, setJustification] = useState<string>('');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    approvalState: string,
  ) => {
    setApproval(approvalState);
  };

  const onChangeTextField = (e: ChangeEvent<HTMLInputElement>) =>
    setJustification(e.target.value);

  const getDefaultTextField = () => {
    if (props.viewState) {
      return props.dataApproval
        ? props.dataApproval[SolicitationApprovalViewDTOFields.Justification]
        : props.docApproval &&
            props.docApproval[
              SolicitationDocumentationApprovalViewDTOFields.Justification
            ];
    }

    return '';
  };

  return (
    <Grid item xs={12} container spacing={1}>
      <Grid item xs={12}>
        <Typography fontSize={21} fontWeight={600}>
          Aprobación de recepción de solicitud
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <Typography fontSize={21} fontWeight={600}>
            Formulario de análisis
          </Typography>
          <Typography
            fontSize={15}
            fontWeight={600}
            color={'#A1A5B7 !important'}
          >
            {`(${
              props.dataAnalysis
                ? dateFormatter.toLongDate(
                    props.dataAnalysis[
                      SolicitationAnalysisViewDTOFields.AptitudeDate
                    ],
                  )
                : props.docAnalysis &&
                  dateFormatter.toLongDate(
                    props.docAnalysis[
                      SolicitationDocumentationAnalysisViewDTOFields
                        .AptitudeDate
                    ],
                  )
            })`}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} container spacing={3}>
        {props.data ? (
          props.dataAnalysis ? (
            <Grid xs={12} p={3}>
              <Paper elevation={2} sx={{ p: 1 }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      props.dataAnalysis[
                        SolicitationAnalysisViewDTOFields.AptitudeMessage
                      ],
                  }}
                />
              </Paper>
            </Grid>
          ) : (
            <Stack spacing={2} sx={{ width: '90%' }} mt={2} ml={2}>
              <Skeleton sx={{ width: ' 100%' }} />
              <Skeleton sx={{ width: ' 100%' }} />
              <Skeleton sx={{ width: ' 100%' }} />
              <Skeleton sx={{ width: ' 100%' }} />
            </Stack>
          )
        ) : props.docAnalysis ? (
          <Grid xs={12} p={3}>
            <Paper elevation={2} sx={{ p: 1 }}>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    props.docAnalysis[
                      SolicitationDocumentationAnalysisViewDTOFields
                        .AptitudeMessage
                    ],
                }}
              />
            </Paper>
          </Grid>
        ) : (
          <Stack spacing={2} sx={{ width: '90%' }} mt={2} ml={2}>
            <Skeleton sx={{ width: ' 100%' }} />
            <Skeleton sx={{ width: ' 100%' }} />
            <Skeleton sx={{ width: ' 100%' }} />
            <Skeleton sx={{ width: ' 100%' }} />
          </Stack>
        )}
      </Grid>
      
      <SafetyGridComponent
        componentName={safetyComponentName}
        objectName={safetyObjectName}
        disabled={props.viewState || !isStageResponsible}
        item
        xs={12}
        mb={2}
      >
        <ToggleButtonGroup
          color={'primary'}
          value={
            !props.viewState
              ? approval
              : props.data
                ? props.dataApproval?.[
                    SolicitationApprovalViewDTOFields
                      .SolicitationApprovalResultCode
                  ]
                : props.docApproval?.[
                    SolicitationDocumentationApprovalViewDTOFields
                      .SolicitationApprovalResultCode
                  ]
          }
          exclusive
          onChange={handleChange}
          aria-label={'Aprobacion'}
          size={'large'}
          fullWidth
          disabled={props.viewState || !isStageResponsible}
        >
          {props.approvalResults.length !== 0 &&
            props.approvalResults.map((state) => (
              <ToggleButton
                value={state[EntityWithIdAndDescriptionFields.Id]}
                color={
                  state[EntityWithIdAndDescriptionFields.Id] === 2
                    ? 'success'
                    : 'error'
                }
                disabled={props.viewState || !isStageResponsible}
              >
                <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                  <Stack spacing={0.5}>
                    <Typography fontSize={17} fontWeight={700}>
                      {state[EntityWithIdAndDescriptionFields.Description]}
                    </Typography>
                    <Typography
                      fontSize={10}
                      fontWeight={600}
                      color={'#A1A5B7 !important'}
                    >
                      {state[SolicitationApprovalResultViewDTOFields.Detail]}
                    </Typography>
                  </Stack>
                  {state[EntityWithIdAndDescriptionFields.Id] === 2 ? (
                    <CheckIcon fontSize={'small'} />
                  ) : (
                    <ReplyIcon fontSize={'small'} />
                  )}
                </Stack>
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </SafetyGridComponent>
      <Grid item xs={12}>
        <Typography fontSize={16} fontWeight={700} color={'#A1A5B7 !important'}>
          Consideraciones de uso interno
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={5}
          fullWidth
          onChange={onChangeTextField}
          defaultValue={getDefaultTextField()}
          disabled={props.viewState || !writePermission}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack direction={'row'} justifyContent={'flex-end'}>
          {isStageResponsible && (
            <SafetyComponent
              componentName={safetyComponentName}
              objectName={safetyObjectName}
              disabled={!approval}
            >
              <Button
                variant={'contained'}
                color={'primary'}
                onClick={() => props.handleContinue(justification, approval)}
                disabled={!approval}
              >
                Continuar
              </Button>
            </SafetyComponent>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default OffererSolicitationAssessmentApprovalDetail;
