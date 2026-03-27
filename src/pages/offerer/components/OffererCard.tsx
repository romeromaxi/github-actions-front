import React from 'react';

import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';

import { Offerer, OffererFields } from 'types/offerer/offererData';
import CardHeaderWithBorder from 'components/cards/CardHeaderWithBorder';
import { DetailPymeIconButton } from 'components/buttons/Buttons';
import { DataWithLabelPrimary } from 'components/misc/DataWithLabel';

import { CompanyNameTypographyProps } from './OffererCard.styles';
import { EnumColors } from '../../../types/general/generalEnums';
import { OffererStatus } from '../../../types/offerer/offererEnums';

interface OffererCardProps {
  offerer: Offerer;
  onDetail?: () => void;
}

function OffererCard({ offerer, onDetail }: OffererCardProps) {
  return (
    <Card>
      <CardHeaderWithBorder
        baseColor={EnumColors.BLUE}
        title={
          <Stack direction="column">
            <Typography {...CompanyNameTypographyProps}>
              {offerer[OffererFields.BusinessName]}
            </Typography>
          </Stack>
        }
        action={
          <Stack direction="row" sx={{ gap: '16px' }}>
            {onDetail && (
              <DetailPymeIconButton color="secondary" onClick={onDetail} />
            )}
          </Stack>
        }
      />

      <CardContent>
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <DataWithLabelPrimary
              label="CUIT"
              data={offerer[OffererFields.CUIT] ?? ''}
              rowDirection
            />
            {offerer[OffererFields.StatusCode] == OffererStatus.Active && (
              <DataWithLabelPrimary
                label="Estado"
                data={
                  (
                    <Chip
                      label={offerer[OffererFields.Status]}
                      color="success"
                    />
                  ) ?? ''
                }
                rowDirection
              />
            )}
            {offerer[OffererFields.StatusCode] == OffererStatus.Analisys && (
              <DataWithLabelPrimary
                label="Estado"
                data={
                  (
                    <Chip
                      label={offerer[OffererFields.Status]}
                      color="warning"
                    />
                  ) ?? ''
                }
                rowDirection
              />
            )}
            {offerer[OffererFields.StatusCode] == OffererStatus.Inactive && (
              <DataWithLabelPrimary
                label="Estado"
                data={
                  (
                    <Chip label={offerer[OffererFields.Status]} color="error" />
                  ) ?? ''
                }
                rowDirection
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default OffererCard;
