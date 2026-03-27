import { Alert, Box, Stack, Tooltip } from '@mui/material';
import * as React from 'react';
import {
  SolicitationSummaryFields,
  SolicitationSummaryViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import { EntityWithIdFields } from 'types/baseEntities';
import { DataWithLabel } from 'components/misc/DataWithLabel';
import SolicitationOffererStatusChip from './SolicitationOffererStatusChip';
import { stringFormatter } from 'util/formatters/stringFormatter';

interface PymeCurrentSolicitationsInOffererProps {
  solicitations: SolicitationSummaryViewDTO[];
  fromCompany?: boolean
}

const PymeCurrentSolicitationsInOfferer = ({
  solicitations, fromCompany = false
}: PymeCurrentSolicitationsInOffererProps) => {
  return (
    <Stack spacing={1}>
      {solicitations.length !== 0 ? (
        solicitations.map((solicitation) => (
          <DataWithLabel
            label={
              <Stack direction={'row'} gap={1} alignItems={'center'}>
                Solicitud #{solicitation[EntityWithIdFields.Id]}
                <Tooltip
                  title={
                    solicitation[
                      SolicitationSummaryFields.SolicitationStatusTypeDesc
                    ]
                  }
                  placement={'top'}
                >
                  <div>
                    <SolicitationOffererStatusChip
                      label={stringFormatter.cutIfHaveMoreThan(
                        solicitation[
                          SolicitationSummaryFields.SolicitationStatusTypeDesc
                        ],
                        20,
                      )}
                      statusCode={
                        solicitation[
                          SolicitationSummaryFields.SolicitationStatusTypeCode
                        ]
                      }
                      small
                    />
                  </div>
                </Tooltip>
              </Stack>
            }
            data={solicitation[SolicitationViewDTOFields.LineDesc]}
            link
            onClick={() => {
              const to =
                !fromCompany
                  ? `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}`
                  : `/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}`;
              window.open(to, '_blank');
            }}
          />
        ))
      ) : (
        <Box sx={{ width: '100%' }}>
          <Alert severity="info">{`Al parecer no se han encontrado más solicitudes`}</Alert>
        </Box>
      )}
    </Stack>
  );
};

export default PymeCurrentSolicitationsInOfferer;
