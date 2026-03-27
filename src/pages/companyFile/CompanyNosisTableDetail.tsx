import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Card, Grid, Stack, Typography } from '@mui/material';

import { CheckOrWarningIcon } from 'components/icons/Icons';
import { ITableColumn, TableListCompanyFileSummary } from 'components/table';

import { EntityWithIdFields } from 'types/baseEntities';
import {
  BouncedChequesFields,
  NosisQuery,
  NosisQueryFields,
  NosisSummaryQuery,
  NosisSummaryQueryFields,
  NosisTotalFields,
  SocialSecurityContributionsFields,
} from 'types/nosis/nosisData';

import { HttpPublicBases } from 'http/publicBases/httpPublicBases';
import { numberFormatter } from '../../util/formatters/numberFormatter';
import {PublicEntityEnums} from "../../util/typification/publicEntityEnums";

const tableSx = {
  backgroundColor: '#2aa2aa',
  borderRadius: '16px',
  pt: 2,
  pl: 1,
  pr: 1,
  pb: 2,
};

interface CompanyNosisTableDetailProps {
  companyId?: number;
}

function CompanyNosisTableDetail({ companyId }: CompanyNosisTableDetailProps) {
  const [nosisSummaryList, setNosisSummaryList] =
    useState<NosisSummaryQuery[]>();

  const getCell = (
    queryId: number,
    tabTo: string,
    approve: boolean,
    content: React.ReactNode = 'Detalle',
  ) => {
    if (companyId) {
      return (
        <Stack direction="row" alignItems="center" justifyContent="center">
          <CheckOrWarningIcon
            value={approve}
            style={{ fontSize: '15px', marginRight: '-12px' }}
          />

          <Link to={`detalle?tab=${tabTo}&id=${queryId}`}>
            <Typography
              color={'#00ffd1'}
              style={{
                fontSize: '14px',
                textTransform: 'none',
                textDecorationLine: 'underline',
              }}
            >
              {content}
            </Typography>
          </Link>
        </Stack>
      );
    }

    return <></>;
  };

  const columns: ITableColumn[] = [
    {
      label: 'Informe',
      value: NosisQueryFields.BusinessName,
      width: '12%',
      onRenderCell: (query: NosisQuery) => (
        <Typography style={{ marginLeft: '-28px' }}>
          {query[NosisQueryFields.BusinessName]}
        </Typography>
      ),
    },
    {
      label: PublicEntityEnums.BCRA,
      value: NosisQueryFields.BankDebtApproved,
      width: '35%',
      onRenderCell: (query: NosisSummaryQuery) => (
        <Grid container>
          <Grid item xs={12}>
            {getCell(
              query[EntityWithIdFields.Id],
                PublicEntityEnums.BCRA,
              query[NosisSummaryQueryFields.BankDebtApproved],
            )}
          </Grid>
          <Grid item xs={6}>
            <Stack>
              <Typography sx={{ fontSize: '10px !important' }}>
                Situación
              </Typography>
              {query[NosisSummaryQueryFields.TotalCurrentDebt].map((x) => (
                <Typography
                  sx={{
                    fontSize: '10px !important',
                    textTransform: 'none !important',
                  }}
                >
                  {x[NosisTotalFields.Description]}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack alignItems={'center'}>
              <Typography sx={{ fontSize: '10px !important' }}>
                Cantidad
              </Typography>
              {query[NosisSummaryQueryFields.TotalCurrentDebt].map((x) => (
                <Typography sx={{ fontSize: '10px' }}>
                  {x[NosisTotalFields.Quantity]}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack alignItems={'center'}>
              <Typography sx={{ fontSize: '10px !important' }}>
                Monto
              </Typography>
              {query[NosisSummaryQueryFields.TotalCurrentDebt].map((x) => (
                <Typography sx={{ fontSize: '10px' }}>
                  {numberFormatter.toStringWithAmount(
                    x[NosisTotalFields.Amount],
                    '$',
                  )}
                </Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Cheques',
      value: NosisQueryFields.BouncedChequesApproved,
      width: '25%',
      onRenderCell: (query: NosisSummaryQuery) => (
        <Grid container>
          <Grid item xs={12}>
            {getCell(
              query[EntityWithIdFields.Id],
              `cheques`,
              query[NosisSummaryQueryFields.BouncedChequesApproved],
            )}
          </Grid>
          <Grid item xs={6}>
            <Stack>
              <Typography sx={{ fontSize: '10px !important' }}>
                Motivo
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                No Pag Sin Fondos
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                No Pag Otros Motivos
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                Sin Fondo, Sin Pago Multa
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack alignItems={'center'}>
              <Typography sx={{ fontSize: '10px !important' }}>
                Cantidad
              </Typography>
              <Typography sx={{ fontSize: '10px !important' }}>
                {
                  query[NosisSummaryQueryFields.BouncedChequesBCRA][
                    BouncedChequesFields.NoFundsQuantity
                  ]
                }
              </Typography>
              <Typography sx={{ fontSize: '10px !important' }}>
                {
                  query[NosisSummaryQueryFields.BouncedChequesBCRA][
                    BouncedChequesFields.OthersQuantity
                  ]
                }
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                {
                  query[NosisSummaryQueryFields.BouncedChequesBCRA][
                    BouncedChequesFields.NoFundsPenaltyQuantity
                  ]
                }
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack alignItems={'center'}>
              <Typography sx={{ fontSize: '10px !important' }}>
                Monto
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                {
                  query[NosisSummaryQueryFields.BouncedChequesBCRA][
                    BouncedChequesFields.NoFundsAmount
                  ]
                }
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                {
                  query[NosisSummaryQueryFields.BouncedChequesBCRA][
                    BouncedChequesFields.OthersAmount
                  ]
                }
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                {
                  query[NosisSummaryQueryFields.BouncedChequesBCRA][
                    BouncedChequesFields.NoFundsPenaltyAmount
                  ]
                }
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Aportes',
      value: NosisQueryFields.SocialSecurityContributionsApproved,
      width: '18%',
      onRenderCell: (query: NosisSummaryQuery) => (
        <Grid container>
          <Grid item xs={12}>
            {getCell(
              query[EntityWithIdFields.Id],
              `aportes`,
              query[
                NosisSummaryQueryFields.SocialSecurityContributionsApproved
              ],
            )}
          </Grid>
          <Grid item xs={6}>
            <Stack>
              <Typography sx={{ fontSize: '10px !important' }}>
                Motivo
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                Pagos
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                Pagos Parcial
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                Sin Pagos
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack alignItems={'center'}>
              <Typography sx={{ fontSize: '10px !important' }}>
                Cantidad
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                {
                  query[NosisSummaryQueryFields.SocialSecurityContributions][
                    SocialSecurityContributionsFields.TotalContributions
                  ]
                }
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                {
                  query[NosisSummaryQueryFields.SocialSecurityContributions][
                    SocialSecurityContributionsFields.PartialContributions
                  ]
                }
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px !important',
                  textTransform: 'none !important',
                }}
              >
                {
                  query[NosisSummaryQueryFields.SocialSecurityContributions][
                    SocialSecurityContributionsFields.UnpaidContributions
                  ]
                }
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Score',
      value: NosisQueryFields.Scoring,
      width: '4%',
      onRenderCell: (query: NosisQuery) =>
        getCell(
          query[EntityWithIdFields.Id],
          `score`,
          query[NosisQueryFields.Scoring] > 300,
          query[NosisQueryFields.Scoring],
        ),
    },
  ];

  useEffect(() => {
    setNosisSummaryList(undefined);

    if (companyId)
      HttpPublicBases.getSummaryListByCompanyId(companyId).then(
        setNosisSummaryList,
      );
  }, [companyId]);

  return (
    <Card sx={tableSx}>
      <TableListCompanyFileSummary
        entityList={nosisSummaryList}
        columns={columns}
        isLoading={!nosisSummaryList}
        error={false}
      />
    </Card>
  );
}

export default CompanyNosisTableDetail;
