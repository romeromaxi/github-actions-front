import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Stack, Typography } from '@mui/material';
import OffererLogo from '../../offerer/components/OffererLogo';
import BoxDataWithLabel from 'components/misc/BoxDataWithLabel';
import { dateFormatter } from 'util/formatters/dateFormatter';
import {
  SolicitationAlertIconButton,
  SolicitationAlertIconType,
} from '../../offerer/components/OffererSolicitation/OffererSolicitationTable/SolicitationAlertIcons';
import { EntityWithIdFields } from 'types/baseEntities';
import {
  CompanySolicitationPageSecObjects,
  SecurityComponents,
} from 'types/security';
import {
  SolicitationFlagsFields,
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import SolicitationOffererStatusChip, {
    SolicitationCompanyStatusChip
} from '../../offerer/components/OffererSolicitation/SolicitationOffererStatusChip';
import CompanySolicitationCancelButton from './CompanySolicitationCancelButton';
import { useCompanySolicitation } from './CompanySolicitationContext';

interface CompanySolicitationHeaderProps {
  solicitation: SolicitationViewDTO;
}

function CompanySolicitationHeader({
  solicitation,
}: CompanySolicitationHeaderProps) {
  const { flags } = useCompanySolicitation();
  const navigate = useNavigate();

  return (
    <div>
      <Grid container alignItems={'center'} spacing={2}>
        <Grid item xs={2}>
          <OffererLogo
            sx={{
              borderRadius: '10px',
              objectFit: 'contain',
              width: 150,
              height: 90,
            }}
            offererId={solicitation[SolicitationViewDTOFields.OffererId]}
          />
        </Grid>
        <Grid item xs={10}>
          {solicitation && (
            <>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Stack spacing={0} justifyContent={'space-between'}>
                  <Stack spacing={0}>
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                      <Typography fontSize={21} fontWeight={600}>
                        {
                          solicitation[
                            SolicitationViewDTOFields.OffererBusinessName
                          ]
                        }
                      </Typography>
                      <SolicitationCompanyStatusChip
                        label={
                          solicitation[
                            SolicitationViewDTOFields
                              .CompanySolicitationStatusTypeDesc
                          ]
                        }
                        statusCode={
                          solicitation[
                            SolicitationViewDTOFields
                              .CompanySolicitationStatusTypeCode
                          ]
                        }
                        alertType={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
                      />
                      <SolicitationAlertIconButton
                        AlertCode={
                          solicitation[SolicitationViewDTOFields.AlertTypeCode]
                        }
                        type={SolicitationAlertIconType.Message}
                        onClick={() => {
                          navigate(
                            `/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}?tab=activity`,
                          );
                        }}
                        securityComponentName={
                          SecurityComponents.CompanySolicitationPage
                        }
                        securityObjectName={
                          CompanySolicitationPageSecObjects.SolicitationCompanyChatLink
                        }
                      />

                      <SolicitationAlertIconButton
                        AlertCode={
                          solicitation[SolicitationViewDTOFields.AlertTypeCode]
                        }
                        type={SolicitationAlertIconType.Document}
                        onClick={() => {
                          navigate(
                            `/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}?tab=requestedFiles`,
                          );
                        }}
                        securityComponentName={
                          SecurityComponents.CompanySolicitationPage
                        }
                        securityObjectName={
                          CompanySolicitationPageSecObjects.SolicitationCompanyRequestedFilesLink
                        }
                      />
                    </Stack>

                    <Typography
                      fontSize={16}
                      fontWeight={600}
                      color={'#7e8299'}
                      mt={0.35}
                    >
                      {solicitation[SolicitationViewDTOFields.LineDesc]}
                    </Typography>
                  </Stack>

                  <Stack direction={'row'} mt={1}>
                    <BoxDataWithLabel
                      label={'Última actualización'}
                      data={`${dateFormatter.toShortDate(solicitation[SolicitationViewDTOFields.CompanyLastModified])}`}
                    />
                  </Stack>
                </Stack>

                {flags?.[SolicitationFlagsFields.SolicitationCancelAllowed] && (
                  <Stack direction={'row'} alignItems="end">
                    <CompanySolicitationCancelButton
                      solicitationId={solicitation[EntityWithIdFields.Id]}
                    />
                  </Stack>
                )}
              </Stack>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default CompanySolicitationHeader;
