import {
  CompanyDeclarationOfAssets,
  CompanyDeclarationOfAssetsFields,
  CompanyLastYearDeclarationOfAssets,
} from '../../../../types/company/companyFinanceInformationData';
import { numberFormatter } from '../../../../util/formatters/numberFormatter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { metronicTableSx } from '../../../../components/table';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import React from 'react';

interface CompanyDeclarationOfAssetsIncomeTableDetailProps {
  firstYear: CompanyLastYearDeclarationOfAssets;
  secondYear: CompanyDeclarationOfAssets;
}

interface ITableColumn {
  label: string;
  value: CompanyDeclarationOfAssetsFields;
  subtotal?: boolean;
  total?: boolean;
}
const CompanyDeclarationOfAssetsIncomeTableDetail = (
  props: CompanyDeclarationOfAssetsIncomeTableDetailProps,
) => {
  const columns: ITableColumn[] = [
    {
      label: 'Ingreso de Ventas',
      value: CompanyDeclarationOfAssetsFields.IncomeSalesGrossProfit,
    },
    { label: 'CMV', value: CompanyDeclarationOfAssetsFields.CMVGrossProfit },
    {
      label: 'Resultado Bruto',
      value: CompanyDeclarationOfAssetsFields.GrossProfitTotal,
      total: true,
    },

    {
      label: 'Otros Ingresos',
      value: CompanyDeclarationOfAssetsFields.OtherIncomesResult,
    },
    {
      label: 'Otros Egresos',
      value: CompanyDeclarationOfAssetsFields.OtherEgressResult,
    },

    {
      label: 'Resultado Total',
      value: CompanyDeclarationOfAssetsFields.TotalResult,
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

export default CompanyDeclarationOfAssetsIncomeTableDetail;
