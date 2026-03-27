import {
  CompanyFinancialTotals,
  CompanyFinancialTotalsFields,
} from '../../../../types/company/companyFinanceInformationData';
import { metronicTableSx } from '../../../../components/table';
import { numberFormatter } from '../../../../util/formatters/numberFormatter';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Grid,
} from '@mui/material';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';

interface CompanyFinancialYearlyTotalsProps {
  totals: CompanyFinancialTotals[];
}

interface ITableColumn {
  label: string;
  value: CompanyFinancialTotalsFields;
  subtotal?: boolean;
  total?: boolean;
}

const CompanyFinancialYearlyTotals = ({
  totals,
}: CompanyFinancialYearlyTotalsProps) => {
  const columns: ITableColumn[] = [
    {
      label: 'Activo Corriente',
      value: CompanyFinancialTotalsFields.ActiveCurrentTotal,
      subtotal: true,
    },
    {
      label: 'Activo No Corriente',
      value: CompanyFinancialTotalsFields.ActiveNotCurrentTotal,
      subtotal: true,
    },
    {
      label: 'Total Activo',
      value: CompanyFinancialTotalsFields.ActiveTotal,
      total: true,
    },
    {
      label: 'Pasivo Corriente',
      value: CompanyFinancialTotalsFields.PassiveCurrentTotal,
      subtotal: true,
    },
    {
      label: 'Pasivo No Corriente',
      value: CompanyFinancialTotalsFields.PassiveNotCurrentTotal,
      subtotal: true,
    },
    {
      label: 'Total Pasivo',
      value: CompanyFinancialTotalsFields.PassiveTotal,
      total: true,
    },
    {
      label: 'Patrimonio Neto',
      value: CompanyFinancialTotalsFields.NetPatrimonyTotal,
      total: true,
    },
  ];

  const resultColumns: ITableColumn[] = [
    {
      label: 'Resultado Neto',
      value: CompanyFinancialTotalsFields.NetResult,
      total: true,
    },
  ];

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

  const getVariation = (field: CompanyFinancialTotalsFields): string => {
    //@ts-ignore
    let currentYear: number | undefined = totals[0][field];
    //@ts-ignore
    let lastYear: number | undefined = totals[1][field];

    if (!currentYear || !lastYear) return '-';

    return numberFormatter.toStringWithPercentage(
      ((currentYear - lastYear) / lastYear) * 100,
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant={'h6'} fontWeight={600} mb={2}>
          Estado de Situación Patrimonial
        </Typography>
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
                  {''}
                </Typography>
              </TableCell>
              <TableCell variant={'head'}>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                >
                  {dateFormatter.toYearDate(
                    totals[0][CompanyFinancialTotalsFields.Date],
                  )}
                </Typography>
              </TableCell>
              <TableCell variant={'head'}>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                  textAlign={'center'}
                >
                  {dateFormatter.toYearDate(
                    totals[1][CompanyFinancialTotalsFields.Date],
                  )}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                >
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
                      totals[0][oneColumn.value],
                      '$',
                      0,
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography textAlign={'right !important'}>
                    {numberFormatter.toStringWithAmount(
                      totals[1][oneColumn.value],
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
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h6'} fontWeight={600} mb={2}>
          Estado de Resultado
        </Typography>
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
                  {''}
                </Typography>
              </TableCell>
              <TableCell variant={'head'}>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                >
                  {dateFormatter.toYearDate(
                    totals[0][CompanyFinancialTotalsFields.Date],
                  )}
                </Typography>
              </TableCell>
              <TableCell variant={'head'}>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                  textAlign={'center'}
                >
                  {dateFormatter.toYearDate(
                    totals[1][CompanyFinancialTotalsFields.Date],
                  )}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                >
                  Variación
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {resultColumns.map((oneColumn, index) => (
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
                      totals[0][oneColumn.value],
                      '$',
                      0,
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography textAlign={'right !important'}>
                    {numberFormatter.toStringWithAmount(
                      totals[1][oneColumn.value],
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
      </Grid>
    </Grid>
  );
};

export default CompanyFinancialYearlyTotals;
