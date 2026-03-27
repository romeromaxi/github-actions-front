import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Table, TableBody, TableHead, Typography } from '@mui/material';

import { EditIconButton } from 'components/buttons/Buttons';
import TableListStyles from 'components/table/TableList.styles';
import {
  ITableColumn,
  TableColumnType,
  TableLoadingSkeleton,
  TableRowEntity,
  TableRowHeader,
} from 'components/table';

import { EntityWithIdFields } from 'types/baseEntities';
import {
  CompanyFinancialTotals,
  CompanyFinancialTotalsFields,
} from 'types/company/companyFinanceInformationData';

interface CompanyFinancialYearProps {
  lstFinancialTotals?: CompanyFinancialTotals[];
  allowEdit?: boolean;
}

const columnBase: ITableColumn[] = [
  {
    label: 'Ejercicio',
    value: CompanyFinancialTotalsFields.Date,
    onRenderCell: (entity: CompanyFinancialTotals) => (
      <div>
        Año{' '}
        {entity[CompanyFinancialTotalsFields.Date].toString().substring(0, 4)}
      </div>
    ),
  },
  {
    label: 'Act. Corr.',
    value: CompanyFinancialTotalsFields.ActiveCurrentTotal,
    type: TableColumnType.Currency,
  },
  {
    label: 'Act. No Corr.',
    value: CompanyFinancialTotalsFields.ActiveNotCurrentTotal,
    type: TableColumnType.Currency,
  },
  {
    label: 'Act. Total',
    value: CompanyFinancialTotalsFields.ActiveTotal,
    type: TableColumnType.Currency,
  },
  {
    label: 'Pas. Corr.',
    value: CompanyFinancialTotalsFields.PassiveCurrentTotal,
    type: TableColumnType.Currency,
  },
  {
    label: 'Pas. No Corr.',
    value: CompanyFinancialTotalsFields.PassiveNotCurrentTotal,
    type: TableColumnType.Currency,
  },
  {
    label: 'Pas. Total',
    value: CompanyFinancialTotalsFields.PassiveTotal,
    type: TableColumnType.Currency,
  },
  {
    label: 'Pat. Neto',
    value: CompanyFinancialTotalsFields.NetPatrimonyTotal,
    type: TableColumnType.Currency,
  },
  {
    label: 'Ventas',
    value: CompanyFinancialTotalsFields.IncomeTotal,
    type: TableColumnType.Currency,
  },
  {
    label: 'Ventas / 12',
    value: CompanyFinancialTotalsFields.IncomeTotal,
    type: TableColumnType.Currency,
  },
];

function CompanyFinancialYear(props: CompanyFinancialYearProps) {
  const navigate = useNavigate();
  const classes = TableListStyles();

  const columns: ITableColumn[] = props.allowEdit
    ? [
        ...columnBase,
        {
          label: '',
          value: CompanyFinancialTotalsFields.IncomeTotal,
          type: TableColumnType.Button,
          onRenderCell: (entity: CompanyFinancialTotals) => (
            <EditIconButton
              onClick={() =>
                navigate(`?edit=finance&id=${entity[EntityWithIdFields.Id]}`)
              }
            />
          ),
        },
      ]
    : columnBase;

  return (
    <Typography component="div" className={classes.root}>
      <Table stickyHeader className={classes.table}>
        <TableHead>
          <TableRowHeader columns={columns} />
        </TableHead>

        <TableBody>
          {!props.lstFinancialTotals ? (
            <TableLoadingSkeleton colSpan={columns.length} />
          ) : props.lstFinancialTotals.length ? (
            props.lstFinancialTotals.map((oneEntity, index) => {
              let keyTableRowEntity: string = `${(oneEntity as any)['id']}_${index}`;
              return (
                <TableRowEntity
                  key={keyTableRowEntity}
                  keyComponent={keyTableRowEntity}
                  entity={oneEntity as any}
                  columns={columns}
                  firstRow={index === 0}
                />
              );
            })
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </Typography>
  );
}

export default CompanyFinancialYear;
