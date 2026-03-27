import {
  CompanyDeclarationOfAssetsTotalsFields,
  CompanyDeclarationOfAssetsTotals,
} from 'types/company/companyFinanceInformationData';
import { numberFormatter } from 'util/formatters/numberFormatter';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { metronicTableSx } from 'components/table';

interface CompanyFileDeclarationOfAssetsTotalsProps {
  totals: CompanyDeclarationOfAssetsTotals[];
}

interface ITableColumn {
  label: string;
  value: CompanyDeclarationOfAssetsTotalsFields;
  subtotal?: boolean;
  total?: boolean;
}
const CompanyFileDeclarationOfAssetsTotals = ({
  totals,
}: CompanyFileDeclarationOfAssetsTotalsProps) => {
  const patrimonialStateColumns: ITableColumn[] = [
    {
      label: 'Activo Corriente',
      value: CompanyDeclarationOfAssetsTotalsFields.CurrentActiveTotal,
      subtotal: true,
    },
    {
      label: 'Activo No Corriente',
      value: CompanyDeclarationOfAssetsTotalsFields.NonCurrentActiveTotal,
      subtotal: true,
    },
    {
      label: 'Total Activo',
      value: CompanyDeclarationOfAssetsTotalsFields.ActiveTotal,
      total: true,
    },
    {
      label: 'Pasivo Corriente',
      value: CompanyDeclarationOfAssetsTotalsFields.CurrentPassiveTotal,
      subtotal: true,
    },
    {
      label: 'Pasivo No Corriente',
      value: CompanyDeclarationOfAssetsTotalsFields.NonCurrentPassiveTotal,
      subtotal: true,
    },
    {
      label: 'Total Pasivo',
      value: CompanyDeclarationOfAssetsTotalsFields.PassiveTotal,
      total: true,
    },
    {
      label: 'Patrimonio Neto',
      value: CompanyDeclarationOfAssetsTotalsFields.NetPatrimonyTotal,
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

  const getVariation = (
    field: CompanyDeclarationOfAssetsTotalsFields,
  ): string => {
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
        <Typography variant={'h6'} fontWeight={600}>
          Estado de Situación Patrimonial
        </Typography>
      </Grid>
      <Grid item xs={12}>
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
                  textAlign={'right !important'}
                >
                  Valor Mercado
                </Typography>
              </TableCell>
              <TableCell variant={'head'}>
                <Typography
                  variant={'subtitle1'}
                  fontWeight={800}
                  color={'primary'}
                  textAlign={'right !important'}
                >
                  Valor Fiscal
                </Typography>
              </TableCell>
              {/*<TableCell>
                                <Typography variant={'subtitle1'} fontWeight={800} color={'primary'}>Variación</Typography>
                            </TableCell>*/}
            </TableRow>
          </TableHead>

          <TableBody>
            {patrimonialStateColumns.map((oneColumn, index) => (
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
                {/* <TableCell>
                                        {getVariation(oneColumn.value)}
                                    </TableCell>*/}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default CompanyFileDeclarationOfAssetsTotals;
