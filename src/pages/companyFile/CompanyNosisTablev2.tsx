import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Stack, Typography } from '@mui/material';

import { CheckOrWarningIcon } from 'components/icons/Icons';
import { ITableColumn, TableListCompanyFileSummary } from 'components/table';

import { EntityWithIdFields } from 'types/baseEntities';
import { NosisQuery, NosisQueryFields } from 'types/nosis/nosisData';

import { HttpPublicBases } from 'http/publicBases/httpPublicBases';
import {PublicEntityEnums} from "../../util/typification/publicEntityEnums";

interface CompanyFileDetailProps {
  companyId?: number;
}

function CompanyNosisTablev2({ companyId }: CompanyFileDetailProps) {
  const [nosisQueryList, setNosisQueryList] = useState<NosisQuery[]>();

  const getCell = (
    queryId: number,
    tabTo: string,
    approve: boolean,
    content: React.ReactNode = 'Ver',
  ) => {
    if (companyId) {
      return (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={-7}
        >
          <CheckOrWarningIcon
            value={approve}
            style={{ fontSize: '15px', marginRight: '-12px' }}
          />

          <Link
            to={`/bureau/${companyId}/detalle`}
            style={{ textDecoration: 'none' }}
          >
            <Typography
              style={{
                fontSize: '14px',
                textTransform: 'none',
                textDecorationLine: 'none',
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
      onRenderCell: (query: NosisQuery) => (
        <Typography style={{ marginLeft: '-28px', color: 'black' }}>
          {query[NosisQueryFields.BusinessName]}
        </Typography>
      ),
    },
    {
      label: PublicEntityEnums.BCRA,
      value: NosisQueryFields.BankDebtApproved,
      onRenderCell: (query: NosisQuery) =>
        getCell(
          query[EntityWithIdFields.Id],
            PublicEntityEnums.BCRA,
          query[NosisQueryFields.BankDebtApproved],
        ),
    },
    {
      label: 'Cheques',
      value: NosisQueryFields.BouncedChequesApproved,
      onRenderCell: (query: NosisQuery) =>
        getCell(
          query[EntityWithIdFields.Id],
          `cheques`,
          query[NosisQueryFields.BouncedChequesApproved],
        ),
    },
    {
      label: 'Aportes',
      value: NosisQueryFields.SocialSecurityContributionsApproved,
      onRenderCell: (query: NosisQuery) =>
        getCell(
          query[EntityWithIdFields.Id],
          `aportes`,
          query[NosisQueryFields.SocialSecurityContributionsApproved],
        ),
    },
    {
      label: 'Score',
      value: NosisQueryFields.Scoring,
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
    setNosisQueryList(undefined);

    if (companyId)
      HttpPublicBases.getListByCompanyId(companyId).then((queryList) => {
        setNosisQueryList(queryList);
      });
  }, [companyId]);

  return (
    <TableListCompanyFileSummary
      entityList={nosisQueryList}
      columns={columns}
      isLoading={!nosisQueryList}
      error={false}
    />
  );
}

export default CompanyNosisTablev2;
