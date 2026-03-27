import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { numberFormatter } from 'util/formatters/numberFormatter';
import {
  CompanyBasePatrimonialStatement,
  CompanyBasePatrimonialStatementFields,
  CompanyPatrimonialStatement,
} from 'types/company/companyFinanceInformationData';
import { metronicTableSx } from '../../../../components/table';

interface CompanyPatrimonialStatementTableDetailProps {
  firstYear: CompanyPatrimonialStatement;
  secondYear: CompanyBasePatrimonialStatement;
}

interface ITableColumn {
  label: string;
  value: CompanyBasePatrimonialStatementFields;
  subtotal?: boolean;
  total?: boolean;
}

function CompanyPatrimonialStatementTableDetail(
  props: CompanyPatrimonialStatementTableDetailProps,
) {
  const columns: ITableColumn[] = [
    {
      label: 'Caja y Bancos',
      value: CompanyBasePatrimonialStatementFields.ActiveCurrentCashBanks,
    },
    {
      label: 'Inversiones',
      value: CompanyBasePatrimonialStatementFields.ActiveCurrentInvestments,
    },
    {
      label: 'Otros Créditos',
      value:
        CompanyBasePatrimonialStatementFields.ActiveCurrentOtherReceivables,
    },
    {
      label: 'Bienes de Cambio',
      value: CompanyBasePatrimonialStatementFields.ActiveCurrentExchangeThing,
    },
    {
      label: 'Otros Activos',
      value: CompanyBasePatrimonialStatementFields.ActiveCurrentOthers,
    },
    {
      label: 'Subtotal Activo Corriente',
      value: CompanyBasePatrimonialStatementFields.ActiveCurrentTotal,
      subtotal: true,
    },

    {
      label: 'Créditos por Ventas',
      value:
        CompanyBasePatrimonialStatementFields.ActiveNotCurrentSalesReceivables,
    },
    {
      label: 'Otros Créditos',
      value:
        CompanyBasePatrimonialStatementFields.ActiveNotCurrentOtherReceivables,
    },
    {
      label: 'Activos por Impuestos Diferidos',
      value:
        CompanyBasePatrimonialStatementFields.ActiveNotCurrentDeferredTaxes,
    },
    {
      label: 'Bienes de Cambio',
      value:
        CompanyBasePatrimonialStatementFields.ActiveNotCurrentExchangeThing,
    },
    {
      label: 'Bienes de Uso',
      value: CompanyBasePatrimonialStatementFields.ActiveNotCurrentThingOfUse,
    },
    {
      label: 'Participaciones permanentes',
      value:
        CompanyBasePatrimonialStatementFields.ActiveNotCurrentPermanentParticipations,
    },
    {
      label: 'Inversiones',
      value: CompanyBasePatrimonialStatementFields.ActiveNotCurrentInvestments,
    },
    {
      label: 'Activos Intangibles',
      value: CompanyBasePatrimonialStatementFields.ActiveNotCurrentIntangibles,
    },
    {
      label: 'Otros Activos',
      value: CompanyBasePatrimonialStatementFields.ActiveNotCurrentOthers,
    },
    {
      label: 'Subtotal Activo No Corriente',
      value: CompanyBasePatrimonialStatementFields.ActiveNotCurrentTotal,
      subtotal: true,
    },

    {
      label: 'Total Activo',
      value: CompanyBasePatrimonialStatementFields.ActiveTotal,
      total: true,
    },

    {
      label: 'Deudas Comerciales',
      value: CompanyBasePatrimonialStatementFields.PassiveCurrentCommercialDebt,
    },
    {
      label: 'Préstamos',
      value: CompanyBasePatrimonialStatementFields.PassiveCurrentLoans,
    },
    {
      label: 'Remuneraciones y Cargas Sociales',
      value:
        CompanyBasePatrimonialStatementFields.PassiveCurrentRemunerationsSocialCharges,
    },
    {
      label: 'Cargas Fiscales',
      value: CompanyBasePatrimonialStatementFields.PassiveCurrentFiscalCharges,
    },
    {
      label: 'Anticipo de Clientes',
      value:
        CompanyBasePatrimonialStatementFields.PassiveCurrentCustomerAdvances,
    },
    {
      label: 'Dividendos a Pagar',
      value:
        CompanyBasePatrimonialStatementFields.PassiveCurrentDividendsPayable,
    },
    {
      label: 'Otras Deudas',
      value: CompanyBasePatrimonialStatementFields.PassiveCurrentOtherDebts,
    },
    {
      label: 'Previsiones',
      value: CompanyBasePatrimonialStatementFields.PassiveCurrentProvisions,
    },
    {
      label: 'Subtotal Pasivo Corriente',
      value: CompanyBasePatrimonialStatementFields.PassiveCurrentTotal,
      subtotal: true,
    },

    {
      label: 'Deudas Comerciales',
      value:
        CompanyBasePatrimonialStatementFields.PassiveNotCurrentCommercialDebt,
    },
    {
      label: 'Préstamos',
      value: CompanyBasePatrimonialStatementFields.PassiveNotCurrentLoans,
    },
    {
      label: 'Remuneraciones y Cargas Sociales',
      value:
        CompanyBasePatrimonialStatementFields.PassiveNotCurrentRemunerationsSocialCharges,
    },
    {
      label: 'Cargas Fiscales',
      value:
        CompanyBasePatrimonialStatementFields.PassiveNotCurrentFiscalCharges,
    },
    {
      label: 'Anticipo de Clientes',
      value:
        CompanyBasePatrimonialStatementFields.PassiveNotCurrentCustomerAdvances,
    },
    {
      label: 'Dividendos a Pagar',
      value:
        CompanyBasePatrimonialStatementFields.PassiveNotCurrentDividendsPayable,
    },
    {
      label: 'Otras Deudas',
      value: CompanyBasePatrimonialStatementFields.PassiveNotCurrentOtherDebts,
    },
    {
      label: 'Previsiones',
      value: CompanyBasePatrimonialStatementFields.PassiveNotCurrentProvisions,
    },
    {
      label: 'Subtotal Pasivo No Corriente',
      value: CompanyBasePatrimonialStatementFields.PassiveNotCurrentTotal,
      subtotal: true,
    },

    {
      label: 'Total Pasivo',
      value: CompanyBasePatrimonialStatementFields.PassiveTotal,
      total: true,
    },

    {
      label: 'Patrimonio Neto',
      value: CompanyBasePatrimonialStatementFields.NetPatrimonyTotal,
      total: true,
    },
  ];

  const getVariation = (
    field: CompanyBasePatrimonialStatementFields,
  ): string => {
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
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: '15px',
      backgroundColor: 'rgba(245, 248, 250, 0.75) !important',
      color: '#181C32 !important',
      '& > p': {
        color: 'grey.900 !important',
      },
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
                {props.firstYear[CompanyBasePatrimonialStatementFields.Year]}
              </Typography>
            </TableCell>
            <TableCell variant={'head'}>
              <Typography variant={'subtitle1'} fontWeight={800} color={'primary'}>
                {props.secondYear[CompanyBasePatrimonialStatementFields.Year]}
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
export default CompanyPatrimonialStatementTableDetail;
