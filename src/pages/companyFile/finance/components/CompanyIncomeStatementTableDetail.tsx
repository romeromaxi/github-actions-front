import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { DefaultStylesButton } from 'components/buttons/Buttons';

import { HttpCompanyIncomeStatement } from 'http/index';
import { numberFormatter } from 'util/formatters/numberFormatter';
import {
  CompanyIncomeLastYearStatement,
  CompanyIncomeStatement,
  CompanyIncomeStatementFields,
} from 'types/company/companyFinanceInformationData';
import { PersonTypes } from 'types/person/personEnums';
import { metronicTableSx } from '../../../../components/table';

interface CompanyIncomeStatementTableDetailProps {
  firstYear: CompanyIncomeLastYearStatement;
  secondYear: CompanyIncomeStatement;
}

interface ITableColumn {
  label: string;
  value: CompanyIncomeStatementFields;
  subtotal?: boolean;
  total?: boolean;
}

function CompanyIncomeStatementTableDetail(
  props: CompanyIncomeStatementTableDetailProps,
) {
  const columns: ITableColumn[] = [
    { label: 'Ventas', value: CompanyIncomeStatementFields.IncomeSales },
    {
      label: 'Total Ingresos',
      value: CompanyIncomeStatementFields.IncomeTotal,
      total: true,
    },

    { label: 'CMV', value: CompanyIncomeStatementFields.EgressCMV },
    {
      label: 'G. Administración',
      value: CompanyIncomeStatementFields.EgressExpenseAdministrative,
    },
    {
      label: 'G. Fabricación',
      value: CompanyIncomeStatementFields.EgressExpenseManufacturing,
    },
    {
      label: 'G. Comercialización',
      value: CompanyIncomeStatementFields.EgressExpenseFinancial,
    },
    {
      label: 'Otros Ing/Egresos',
      value: CompanyIncomeStatementFields.EgressOtherIncomeExpenses,
    },
    { label: 'ATP', value: CompanyIncomeStatementFields.EgressATP },
    {
      label: 'Rdo Vta Bienes de Uso',
      value: CompanyIncomeStatementFields.EgressResultsSalesThingOfUse,
    },
    { label: 'RECPAM', value: CompanyIncomeStatementFields.EgressRECPAM },
    {
      label: 'Total Egresos',
      value: CompanyIncomeStatementFields.EgressTotal,
      total: true,
    },

    {
      label: 'Resultado Neto',
      value: CompanyIncomeStatementFields.NetResult,
      total: true,
    },

    {
      label: 'Total Amortizaciones',
      value: CompanyIncomeStatementFields.AmortizationTotal,
      total: true,
    },
  ];

  const getVariation = (field: CompanyIncomeStatementFields): string => {
    //@ts-ignore
    let currentYear: number | undefined = props.firstYear[field];
    //@ts-ignore
    let lastYear: number | undefined = props.secondYear[field];

    if (!currentYear || !lastYear) return '-';

    return numberFormatter.toStringWithPercentage(
      ((currentYear - lastYear) / lastYear) * 100,
    );
  };

  const sxSubTotal = {
    '& > .MuiTableCell-root': {
      fontStyle: 'italic',
      fontWeight: 600,
      color: 'black !important',
    },
  };

  const sxTotal = {
    '& > .MuiTableCell-root': {
      fontWeight: 'bold !important',
      textTransform: 'uppercase',
      fontSize: '15px',
      color: 'black !important',
    },
  };

  return (
    <div>
      <Table stickyHeader sx={metronicTableSx}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography
                variant={'subtitle1'}
                fontWeight={800}
                color={'primary'}
                textAlign={'left !important'}
              >
                Cuenta
              </Typography>
            </TableCell>
            <TableCell variant={'head'}>
              <Typography variant={'subtitle1'} fontWeight={800} color={'primary'}>
                {props.firstYear[CompanyIncomeStatementFields.Year]}
              </Typography>
            </TableCell>
            <TableCell variant={'head'}>
              <Typography
                variant={'subtitle1'}
                fontWeight={800}
                color={'primary'}
                textAlign={'center'}
              >
                {props.secondYear[CompanyIncomeStatementFields.Year]}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant={'subtitle1'} fontWeight={800} color={'primary'}>
                Variación
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {columns.map(
            (oneColumn, index) =>
              (props.firstYear[oneColumn.value] !== 0 ||
                props.secondYear[oneColumn.value] !== 0) && (
                <TableRow
                  key={`column_${oneColumn.value}_${index}`}
                  sx={
                    oneColumn.total
                      ? sxTotal
                      : oneColumn.subtotal
                        ? sxSubTotal
                        : {}
                  }
                >
                  <TableCell>
                    <Typography color={'#7E8299 !important'}>
                      {oneColumn.label}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography textAlign={'right !important'}>
                      {numberFormatter.toStringWithAmount(
                        props.firstYear[oneColumn.value],
                        '$',
                        0,
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography textAlign={'right !important'}>
                      {numberFormatter.toStringWithAmount(
                        props.secondYear[oneColumn.value],
                        '$',
                        0,
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>{getVariation(oneColumn.value)}</TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}
export default CompanyIncomeStatementTableDetail;
