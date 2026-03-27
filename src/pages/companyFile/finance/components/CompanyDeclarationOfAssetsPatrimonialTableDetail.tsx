import {
  CompanyDeclarationOfAssets,
  CompanyDeclarationOfAssetsFields,
  CompanyLastYearDeclarationOfAssets,
} from '../../../../types/company/companyFinanceInformationData';
import { metronicTableSx } from '../../../../components/table';
import { numberFormatter } from '../../../../util/formatters/numberFormatter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';

interface CompanyDeclarationOfAssetsPatrimonialTableDetailProps {
  firstYear: CompanyLastYearDeclarationOfAssets;
  secondYear: CompanyDeclarationOfAssets;
}

interface ITableColumn {
  label: string;
  value: CompanyDeclarationOfAssetsFields;
  subtotal?: boolean;
  total?: boolean;
}

const CompanyDeclarationOfAssetsPatrimonialTableDetail = (
  props: CompanyDeclarationOfAssetsPatrimonialTableDetailProps,
) => {
  const columns: ITableColumn[] = [
    {
      label: 'Caja',
      value: CompanyDeclarationOfAssetsFields.CurrentActiveCash,
    },
    {
      label: 'Bancos',
      value: CompanyDeclarationOfAssetsFields.CurrentActiveBanks,
    },
    {
      label: 'Inversiones',
      value: CompanyDeclarationOfAssetsFields.CurrentActiveInvestments,
    },
    {
      label: 'Créditos Comerciales',
      value: CompanyDeclarationOfAssetsFields.CurrentActiveTradeReceivables,
    },
    {
      label: 'Otros Créditos',
      value: CompanyDeclarationOfAssetsFields.CurrentActiveOtherReceivables,
    },
    {
      label: 'Materias Primas',
      value: CompanyDeclarationOfAssetsFields.CurrentActiveRawMaterials,
    },
    {
      label: 'Mercaderias',
      value: CompanyDeclarationOfAssetsFields.CurrentActiveMerchandise,
    },
    {
      label: 'Subtotal Activo Corriente',
      value: CompanyDeclarationOfAssetsFields.CurrentActiveTotal,
      subtotal: true,
    },

    {
      label: 'Propiedades',
      value: CompanyDeclarationOfAssetsFields.NonCurrentActiveProperties,
    },
    {
      label: 'Maquinarias y Rodados',
      value:
        CompanyDeclarationOfAssetsFields.NonCurrentActiveMachineryAndVehicles,
    },
    {
      label: 'Otros Bienes',
      value: CompanyDeclarationOfAssetsFields.NonCurrentActiveOtherReceivables,
    },
    {
      label: 'Subtotal Activo No Corriente',
      value: CompanyDeclarationOfAssetsFields.NonCurrentActiveTotal,
      subtotal: true,
    },

    {
      label: 'Total Activo',
      value: CompanyDeclarationOfAssetsFields.ActiveTotal,
      total: true,
    },

    {
      label: 'Deudas Bancarias',
      value: CompanyDeclarationOfAssetsFields.CurrentPassiveBankDebts,
    },
    {
      label: 'Deudas Comerciales',
      value: CompanyDeclarationOfAssetsFields.CurrentPassiveBusinessDebts,
    },
    {
      label: 'Previsiones Fiscales',
      value: CompanyDeclarationOfAssetsFields.CurrentPassiveTaxForecastsDebts,
    },
    {
      label: 'Subtotal Pasivo Corriente',
      value: CompanyDeclarationOfAssetsFields.CurrentPassiveTotal,
      subtotal: true,
    },

    {
      label: 'Deudas Bancarias',
      value: CompanyDeclarationOfAssetsFields.NonCurrentPassiveBankDebts,
    },
    {
      label: 'Deudas Comerciales',
      value: CompanyDeclarationOfAssetsFields.NonCurrentPassiveBusinessDebts,
    },
    {
      label: 'Previsiones Fiscales',
      value:
        CompanyDeclarationOfAssetsFields.NonCurrentPassiveTaxForecastsDebts,
    },
    {
      label: 'A Largo Plazo',
      value: CompanyDeclarationOfAssetsFields.NonCurrentPassiveOtherLongTerm,
    },
    {
      label: 'Subtotal Pasivo No Corriente',
      value: CompanyDeclarationOfAssetsFields.NonCurrentPassiveTotal,
      subtotal: true,
    },

    {
      label: 'Total Pasivo',
      value: CompanyDeclarationOfAssetsFields.PassiveTotal,
      total: true,
    },

    {
      label: 'Patrimonio Neto',
      value: CompanyDeclarationOfAssetsFields.NetPatrimonyTotal,
      total: true,
    },
  ];

  const getVariation = (field: CompanyDeclarationOfAssetsFields): string => {
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
    <>
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
                Actual
              </Typography>
            </TableCell>
            <TableCell variant={'head'}>
              <Typography variant={'subtitle1'} fontWeight={800} color={'primary'}>
                Anterior
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
          {columns.map((oneColumn, index) => (
            <TableRow
              key={`column_${oneColumn.value}_${index}`}
              sx={
                oneColumn.total ? sxTotal : oneColumn.subtotal ? sxSubTotal : {}
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
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CompanyDeclarationOfAssetsPatrimonialTableDetail;
