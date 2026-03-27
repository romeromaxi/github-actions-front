import {Box, Grid, Stack, Typography} from '@mui/material';
import React, {useContext, useEffect} from 'react';
import {SolicitationFlagsFields,} from 'types/solicitations/solicitationData';
import {dateFormatter} from 'util/formatters/dateFormatter';
import SolicitationOffererStatusChip from './SolicitationOffererStatusChip';
import {OffererSolicitationNavHeaderSecObjects, SecurityComponents,} from '../../../../types/security';
import {SafetyComponent} from '../../../../components/security';
import {DataWithLabel} from '../../../../components/misc/DataWithLabel';
import TotalBoxComponentStyles from '../../../../components/misc/TotalBoxComponent.styles';
import OffererSolicitationResponsibleCommercialButton from './OffererSolicitationResponsibleCommercialButton';
import OffererSolicitationResponsibleButton from './OffererSolicitationResponsibleButton';
import {SolicitationNavHeaderContext} from './OffererSolicitationNavHeader';
import {CompanyLogoById} from '../../../company/components/CompanyLogo';
import {useSolicitation} from "../../../../hooks/contexts/SolicitationsContext";
import {SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {PersonTypes} from "../../../../types/person/personEnums";

interface OffererSolicitationHeaderProps {
  solicitationId: number;
  actionId?: number;
}

const OffererSolicitationHeader = ({
  solicitationId,
  actionId,
}: OffererSolicitationHeaderProps) => {
  const classes = TotalBoxComponentStyles();
  const { solicitation, getSolicitation, flags } = useSolicitation();
  const { permissionWorkflowCode } = useContext(SolicitationNavHeaderContext);

  useEffect(() => {
    getSolicitation(solicitationId);
  }, []);
  
  return (
    <>
      <Grid container alignItems={'center'} spacing={2}>
        <Grid item xs={1.75}>
          <CompanyLogoById companyId={solicitation?.[SolicitationViewDTOFields.CompanyId]}
                           isPhysicalPerson={solicitation?.[SolicitationViewDTOFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                           size={'xl'}
          />
        </Grid>
        <Grid item xs={10.25}>
          {solicitation && (
            <>
              <Stack
                direction={'row'}
                spacing={3}
                justifyContent={'space-between'}
              >
                <Box
                  sx={{
                    display: 'flex !important',
                    flexDirection: 'column !important',
                    justifyContent: 'space-between !important',
                  }}
                >
                  <Typography fontSize={21} fontWeight={600}>
                    {solicitation[SolicitationViewDTOFields.LineDesc]}
                  </Typography>
                  <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <DataWithLabel
                      label={'Responsable Comercial'}
                      data={
                        solicitation[
                          SolicitationViewDTOFields
                            .CommercialResponsibleUserName
                        ] || 'Sin definir'
                      }
                      rowDirection
                    />
                    {!!flags?.[
                      SolicitationFlagsFields
                        .SolicitationCommercialResponsibleAsignedAllowed
                    ] && (
                      <SafetyComponent
                        componentName={
                          SecurityComponents.OffererSolicitationNavHeader
                        }
                        objectName={
                          OffererSolicitationNavHeaderSecObjects.AssignmentResponsibleCommercialSolicitationButton
                        }
                      >
                        <OffererSolicitationResponsibleCommercialButton />
                      </SafetyComponent>
                    )}
                  </Stack>
                </Box>
                <Box>
                  <Typography
                    fontSize={16}
                    fontWeight={600}
                    textAlign={'center'}
                  >
                    Estado de la Solicitud
                  </Typography>
                  <Box
                    className={classes.boxContainer}
                    sx={{ minWidth: '500px !important' }}
                  >
                    <Box marginTop={'-15px'} sx={{ textAlign: 'center' }}>
                      <SolicitationOffererStatusChip
                        label={
                          solicitation[
                            SolicitationViewDTOFields
                              .OffererSolicitationStatusLabelDesc
                          ]
                        }
                        statusCode={
                          solicitation[
                            SolicitationViewDTOFields
                              .OffererSolicitationStatusTypeCode
                          ]
                        }
                        alertType={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
                        sx={{
                          marginTop: 2,
                          marginBottom: 2,
                        }}
                      />
                    </Box>
                    <DataWithLabel
                      label={'Última actualización'}
                      data={dateFormatter.toShortDate(
                        solicitation[
                          SolicitationViewDTOFields.CompanyLastModified
                        ],
                      )}
                      rowDirection
                    />
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                      <DataWithLabel
                        label={'Responsable de Etapa'}
                        data={
                          solicitation[
                            SolicitationViewDTOFields.StageResponsibleUserName
                          ] || 'Sin definir'
                        }
                        rowDirection
                      />
                      {!!actionId && (
                        <SafetyComponent
                          permissionWorkflowCode={permissionWorkflowCode}
                          componentName={
                            SecurityComponents.OffererSolicitationNavHeader
                          }
                          objectName={
                            OffererSolicitationNavHeaderSecObjects.AssignmentSolicitationButton
                          }
                        >
                          <OffererSolicitationResponsibleButton
                            actionId={actionId}
                          />
                        </SafetyComponent>
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Stack>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default OffererSolicitationHeader;
