import React, { useEffect, useState } from 'react';
import { CompanyViewDTO } from '../../types/company/companyData';
import { HttpPublicBases } from '../../http/publicBases/httpPublicBases';
import { NosisQuery, NosisQueryFields } from '../../types/nosis/nosisData';
import { ITableColumn, TableList } from '../../components/table';
import { Stack, Typography } from '@mui/material';
import { CheckOrWarningIcon } from '../../components/icons/Icons';
import { Link } from 'react-router-dom';
import { EntityWithIdFields } from '../../types/baseEntities';
import {PublicEntityEnums} from "../../util/typification/publicEntityEnums";

interface CompanyFileDetailProps {
  company: CompanyViewDTO;
}

function CompanyNosisTable({ company }: CompanyFileDetailProps) {
  const [nosisQueryList, setNosisQueryList] = useState<NosisQuery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const columns: ITableColumn[] = [
    {
      label: 'Informes',
      onRenderCell: (query: NosisQuery) => (
        <Stack direction={'row'}>{query[NosisQueryFields.BusinessName]}</Stack>
      ),
    },
    {
      label: PublicEntityEnums.BCRA,
      onRenderCell: (query: NosisQuery) => (
        <Stack direction="row" alignItems={'center'} gap={1}>
          <CheckOrWarningIcon
            value={query[NosisQueryFields.BankDebtApproved]}
          />
          <Link
            to={`/bureau/${company[EntityWithIdFields.Id]}/detalle?tab=BCRA&id=${query[EntityWithIdFields.Id]}`}
          >
            <Typography color={'#00ffd1'}>Detalle</Typography>
          </Link>
        </Stack>
      ),
    },
    {
      label: 'Cheques',
      onRenderCell: (query: NosisQuery) => (
        <Stack direction="row" alignItems={'center'} gap={1}>
          <CheckOrWarningIcon
            value={query[NosisQueryFields.BouncedChequesApproved]}
          />
          <Link
            to={`/bureau/${company[EntityWithIdFields.Id]}/detalle?tab=cheques&id=${query[EntityWithIdFields.Id]}`}
          >
            <Typography color={'#00ffd1'}>Detalle</Typography>
          </Link>
        </Stack>
      ),
    },
    {
      label: 'Aportes',
      onRenderCell: (query: NosisQuery) => (
        <Stack direction="row" alignItems={'center'} gap={1}>
          <CheckOrWarningIcon
            value={query[NosisQueryFields.SocialSecurityContributionsApproved]}
          />
          <Link
            to={`/bureau/${company[EntityWithIdFields.Id]}/detalle?tab=aportes&id=${query[EntityWithIdFields.Id]}`}
          >
            <Typography color={'#00ffd1'}>Detalle</Typography>
          </Link>
        </Stack>
      ),
    },
    {
      label: 'Score',
      onRenderCell: (query: NosisQuery) => (
        <Stack direction="row" alignItems={'center'} gap={1}>
          <CheckOrWarningIcon value={query[NosisQueryFields.Scoring] > 500} />
          <Link
            to={`/bureau/${company[EntityWithIdFields.Id]}/detalle?tab=score&id=${query[EntityWithIdFields.Id]}`}
          >
            <Typography color={'#00ffd1'}>Detalle</Typography>
          </Link>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    HttpPublicBases.getListByCompanyId(company[EntityWithIdFields.Id])
      .then((queryList) => {
        setNosisQueryList(queryList);
        setLoading(false);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <TableList
        title={'Información de Bureau'}
        entityList={nosisQueryList}
        columns={columns}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}

export default CompanyNosisTable;
