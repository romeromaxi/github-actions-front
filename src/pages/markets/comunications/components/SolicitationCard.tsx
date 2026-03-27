import { Box, Grid, Stack, Typography } from '@mui/material';
import { DataWithLabel } from 'components/misc/DataWithLabel';
import { EnumColors } from 'types/general/generalEnums';
import {
  SolicitationProductLine,
  SolicitationProductLineFields,
} from 'types/solicitations/solicitationData';
import { dateFormatter } from 'util/formatters/dateFormatter';
import CardBaseStyles from '../../../../components/cards/CardBase.styles';
import React from 'react';
import { solicitationBoxSx } from './SolicitationBox.styles';
import ActivityLabelWithData from '../../../company/activity/components/ActivityLabelWithData';

interface SolicitationCardProps {
  solicitation: SolicitationProductLine;
  focusOnCompany?: boolean;
}

function SolicitationCard({
  solicitation,
  focusOnCompany,
}: SolicitationCardProps) {
  const classes = CardBaseStyles();

  const title: string = focusOnCompany
    ? solicitation[SolicitationProductLineFields.CompanyBusinessName]
    : solicitation[SolicitationProductLineFields.Line];

  const getSummary = () => (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      {solicitation[SolicitationProductLineFields.CompanyBusinessName] &&
        !focusOnCompany && (
          <Grid item>
            <DataWithLabel
              label="Empresa"
              data={
                solicitation[SolicitationProductLineFields.CompanyBusinessName]
              }
              color={EnumColors.GREEN}
              rowDirection
            />
          </Grid>
        )}
      <Grid item>
        <DataWithLabel
          label="Inicio Comunicación"
          data={
            dateFormatter.toShortDate(
              solicitation[SolicitationProductLineFields.CreationDate] || null,
            ) || '-'
          }
          color={EnumColors.GREEN}
          rowDirection
        />
      </Grid>
      <Grid item>
        <DataWithLabel
          label="Fecha Vencimiento"
          data={
            dateFormatter.toShortDate(
              solicitation[SolicitationProductLineFields.ExpirationDate] ||
                null,
            ) || '-'
          }
          color={EnumColors.GREEN}
          rowDirection
        />
      </Grid>
    </Grid>
  );

  return (
    <Box sx={solicitationBoxSx}>
      <Stack gap={3}>
        <Typography fontWeight={600} fontSize={'1.25rem'} color={'dark'}>
          {title}
        </Typography>
        <div>
          {[
            ...(solicitation[
              SolicitationProductLineFields.CompanyBusinessName
            ] && !focusOnCompany
              ? [
                  {
                    label: 'Empresa',
                    data: solicitation[
                      SolicitationProductLineFields.CompanyBusinessName
                    ],
                  },
                ]
              : []),
            {
              label: 'Inicio Comunicación',
              data:
                dateFormatter.toShortDate(
                  solicitation[SolicitationProductLineFields.CreationDate] ||
                    null,
                ) || '-',
            },
            {
              label: 'Fecha Vencimiento',
              data:
                dateFormatter.toShortDate(
                  solicitation[SolicitationProductLineFields.ExpirationDate] ||
                    null,
                ) || '-',
            },
          ].map((props) => (
            <ActivityLabelWithData {...props} />
          ))}
        </div>
      </Stack>
    </Box>
    // <Card className={classes.cardWithShadow}>
    //     <CardHeader title={title}
    //     />
    // <CardContent>
    //     {getSummary()}
    // </CardContent>
    // </Card>
    // <CardBase
    //             baseColor={EnumColors.YELLOW}
    //           title={title}
    //           summaryContent={getSummary()}
    // />
  );
}

export default SolicitationCard;
