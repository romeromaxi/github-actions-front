import React, { CSSProperties, Fragment, useMemo } from 'react';
import { ProductLineViewDetail, ProductLineFields } from 'types/lines/productLineData';
import { styled } from '@mui/styles';
import {
  Grid,
  Stack,
  Table,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import MarketTypography from '../../components/MarketTypography';
import { ProductLineTemplateType } from 'types/lines/productLineEnums';
import { numberFormatter } from 'util/formatters/numberFormatter';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { dateFormatter } from 'util/formatters/dateFormatter';

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: grey[200],
  },
}));

type LineDetailRow = {
  label: string;
  field: ProductLineFields;
};

const cellTextStyle: CSSProperties = {
  color: '#212529',
  fontSize: '0.875rem',
  fontWeight: '400',
  lineHeight: '20px',
  textAlign: 'left',
};

const numericCellTextStyle: CSSProperties = {
  color: '#212529',
  fontSize: '0.875rem',
  fontWeight: '400',
  lineHeight: '20px',
  textAlign: 'right',
};

const headerStyle: CSSProperties = {
  ...cellTextStyle,
  textTransform: 'uppercase',
  fontWeight: '500',
};

const maxAmountRow = {
  label: 'MONTO MÁX.',
  field: ProductLineFields.AmountMax,
};
const minAmountRow = {
  label: 'MONTO MÍN.',
  field: ProductLineFields.AmountMin,
};
const currencyRow = {
  label: 'MONEDA',
  field: ProductLineFields.CurrencyCodeDesc,
};
const coverageRow = {
  label: 'COBERTURA',
  field: ProductLineFields.CoverageGuarantee,
};
const comissionsRow = {
  label: 'COMISIONES',
  field: ProductLineFields.Commission,
};
const productRow = {
  label: 'PRODUCTO',
  field: ProductLineFields.ProductDesc,
};
const nameRow = {
  label: 'NOMBRE',
  field: ProductLineFields.Line,
};
const gracePeriodRow = {
  label: 'PERÍODO DE GRACIA',
  field: ProductLineFields.HasPeriodGrace,
};
const graceMonthsRow = {
  label: 'MESES DE GRACIA',
  field: ProductLineFields.MonthGrace,
};
const rateTypeRow = {
  label: 'TIPO DE TASA',
  field: ProductLineFields.RateDesc,
};
const rateMinRow = {
  label: 'TASA MÍN.',
  field: ProductLineFields.RateMin,
};
const rateMaxRow = {
  label: 'TASA MÁX.',
  field: ProductLineFields.RateMax,
};
const amortizationRow = {
  label: 'AMORTIZACIÓN',
  field: ProductLineFields.AmortizationDesc,
};
const expensesRow = {
  label: 'GASTOS',
  field: ProductLineFields.Expenses,
};
const minTermRow = {
  label: 'PLAZO MÍN.',
  field: ProductLineFields.MonthsMin,
};
const maxTermRow = {
  label: 'PLAZO MÁX.',
  field: ProductLineFields.MonthsMax,
};
const checkIssuerRow = {
  label: 'EMISOR CHEQUE',
  field: ProductLineFields.CheckIssuerDesc,
};
const checkTypeRow = {
  label: 'TIPO CHEQUE',
  field: ProductLineFields.CheckTypeDesc,
};
const dateFromRow = {
  label: 'VIGENCIA MIN',
  field: ProductLineFields.DateSince,
};
const dateToRow = {
  label: 'VIGENCIA MAX',
  field: ProductLineFields.DateTo,
};
const additionalCostsRow = {
  label: 'GASTOS ADICIONALES',
  field: ProductLineFields.AdditionalCostsDesc,
};
const costsRow = {
  label: 'GASTOS ADICIONALES',
  field: ProductLineFields.Costs,
};
const financialPercentageRow = {
  label: 'PORC. FINANCIAMIENTO',
  field: ProductLineFields.CoverageGuarantee,
};
const cannonRow = {
  label: 'CANNON',
  field: ProductLineFields.Canon,
};
const typeOfGoodRow = {
  label: 'TIPO DE BIEN',
  field: ProductLineFields.TypeOfGoodDesc,
};

const cellStyleMapper = (field: ProductLineFields) => {
  const map: { [key in ProductLineFields]?: React.ReactNode } = {
    [ProductLineFields.AmountMin]: numericCellTextStyle,
    [ProductLineFields.AmountMax]: numericCellTextStyle,
    [ProductLineFields.MonthsMin]: numericCellTextStyle,
    [ProductLineFields.MonthsMax]: numericCellTextStyle,
    [ProductLineFields.RateMin]: numericCellTextStyle,
    [ProductLineFields.RateMax]: numericCellTextStyle,
    [ProductLineFields.Commission]: numericCellTextStyle,
    [ProductLineFields.Expenses]: numericCellTextStyle,
    [ProductLineFields.MonthGrace]: numericCellTextStyle,
    [ProductLineFields.Costs]: numericCellTextStyle,
    [ProductLineFields.AdditionalCostsDesc]: numericCellTextStyle,
  };
  return map?.[field] || cellTextStyle;
};

const rowFormatter = (line: ProductLineViewDetail, field: ProductLineFields) => {
  const map: { [key in ProductLineFields]?: React.ReactNode } = {
    [ProductLineFields.AmountMin]: numberFormatter.toStringWithAmount(
      line[ProductLineFields.AmountMin],
      line[ProductLineFields.CurrencyCodeDesc] || '',
      0,
    ),
    [ProductLineFields.AmountMax]: numberFormatter.toStringWithAmount(
      line[ProductLineFields.AmountMax],
      line[ProductLineFields.CurrencyCodeDesc] || '',
      0,
    ),
    [ProductLineFields.MonthsMin]: `${line[ProductLineFields.MonthsMin]} meses`,
    [ProductLineFields.MonthsMax]: `${line[ProductLineFields.MonthsMax]} meses`,
    [ProductLineFields.RateMin]: numberFormatter.toStringWithPercentage(
      line[ProductLineFields.RateMin],
      1,
      1,
    ),
    [ProductLineFields.RateMax]: numberFormatter.toStringWithPercentage(
      line[ProductLineFields.RateMax],
      1,
      1,
    ),
    [ProductLineFields.HasPeriodGrace]: `${line[ProductLineFields.HasPeriodGrace] ? 'Si' : 'No'}`,
    [ProductLineFields.Line]: (
      <Tooltip
        title={
          line[ProductLineFields.Line]?.length >= 24
            ? line[ProductLineFields.Line]
            : ''
        }
      >
        <div>
          {`${stringFormatter.cutIfHaveMoreThan(line[ProductLineFields.Line], 22)}`}
        </div>
      </Tooltip>
    ),
    [ProductLineFields.ProductDesc]: (
      <Tooltip
        title={
          line[ProductLineFields.ProductDesc]?.length >= 24
            ? line[ProductLineFields.ProductDesc]
            : ''
        }
      >
        <div>
          {`${stringFormatter.cutIfHaveMoreThan(line[ProductLineFields.ProductDesc], 22)}`}
        </div>
      </Tooltip>
    ),
    [ProductLineFields.DateSince]: dateFormatter.toShortDate(
      line[ProductLineFields.DateSince],
    ),
    [ProductLineFields.DateTo]: dateFormatter.toShortDate(
      line[ProductLineFields.DateTo],
    ),
    [ProductLineFields.CoverageGuarantee]: line[
      ProductLineFields.CoverageGuarantee
    ]
      ? numberFormatter.toStringWithPercentage(
          line[ProductLineFields.CoverageGuarantee] ?? 0,
        )
      : 'No informa',
    [ProductLineFields.Commission]: line[ProductLineFields.Commission] ? (
      <Stack direction={'row'} gap={0.5} justifyContent={'end'}>
        <Fragment>
          {numberFormatter.toStringWithPercentage(
            line[ProductLineFields.Commission] ?? 0,
          )}
        </Fragment>
        {!!line[ProductLineFields.CommissionDesc] && (
          <Tooltip title={line[ProductLineFields.CommissionDesc]}>
            <Typography color={'text.disabled'}>*</Typography>
          </Tooltip>
        )}
      </Stack>
    ) : (
      'No informa'
    ),
    [ProductLineFields.RateDesc]: line[ProductLineFields.RateDesc] ? (
      <Stack direction={'row'} gap={0.5} justifyContent={'end'}>
        <Fragment>{line[ProductLineFields.RateDesc]}</Fragment>
        {!!line[ProductLineFields.RateInformation] && (
          <Tooltip title={line[ProductLineFields.RateInformation]}>
            <Typography color={'text.disabled'}>**</Typography>
          </Tooltip>
        )}
      </Stack>
    ) : (
      'No informa'
    ),
  };

  return map?.[field] || line[field];
};

interface ProductLineDetailTableProps {
  productLine: ProductLineViewDetail;
}

export function ProductLineDetailTable({
  productLine,
}: ProductLineDetailTableProps) {
  const productTemplateMap: Record<ProductLineTemplateType, LineDetailRow[]> =
    useMemo(
      () => ({
        [ProductLineTemplateType.Financing]: [
          nameRow,
          productRow,
          currencyRow,
          minAmountRow,
          maxAmountRow,
          gracePeriodRow,
          graceMonthsRow,
          minTermRow,
          maxTermRow,
          rateTypeRow,
          rateMinRow,
          rateMaxRow,
          amortizationRow,
          expensesRow,
        ],
        [ProductLineTemplateType.NotLoanGuarantee]: [
          nameRow,
          productRow,
          currencyRow,
          comissionsRow,
          coverageRow,
        ],
        [ProductLineTemplateType.LoanGuaranteeOld]: [
          nameRow,
          productRow,
          currencyRow,
          minAmountRow,
          maxAmountRow,
          gracePeriodRow,
          graceMonthsRow,
          minTermRow,
          maxTermRow,
          rateTypeRow,
          rateMinRow,
          rateMaxRow,
          amortizationRow,
          expensesRow,
          coverageRow,
        ],
        [ProductLineTemplateType.LeasingOld]: [
          nameRow,
          productRow,
          currencyRow,
          minAmountRow,
          maxAmountRow,
          gracePeriodRow,
          graceMonthsRow,
          minTermRow,
          maxTermRow,
          rateTypeRow,
          rateMinRow,
          rateMaxRow,
          amortizationRow,
          expensesRow,
        ],
        [ProductLineTemplateType.OtherServices]: [
          nameRow,
          productRow,
          comissionsRow,
          expensesRow,
        ],
        [ProductLineTemplateType.PymeAccount]: [
          nameRow,
          productRow,
          comissionsRow,
          expensesRow,
        ],

        [ProductLineTemplateType.DocumentDiscounting]: [
          nameRow,
          productRow,
          checkIssuerRow,
          checkTypeRow,
          dateFromRow,
          dateToRow,
          comissionsRow,
          additionalCostsRow,
        ],
        [ProductLineTemplateType.LoanGuarantee]: [
          nameRow,
          productRow,
          currencyRow,
          rateTypeRow,
          rateMinRow,
          rateMaxRow,
          minTermRow,
          maxTermRow,
          minAmountRow,
          maxAmountRow,
          amortizationRow,
          gracePeriodRow,
          comissionsRow,
          coverageRow,
        ],
        [ProductLineTemplateType.Loans]: [
          nameRow,
          productRow,
          currencyRow,
          rateMinRow,
          rateMaxRow,
          minTermRow,
          maxTermRow,
          minAmountRow,
          maxAmountRow,
          amortizationRow,
          gracePeriodRow,
          comissionsRow,
        ],
        [ProductLineTemplateType.OtherLines]: [
          nameRow,
          productRow,
          comissionsRow,
          costsRow,
        ],
        [ProductLineTemplateType.Leasing]: [
          nameRow,
          productRow,
          typeOfGoodRow,
          financialPercentageRow,
          cannonRow,
          currencyRow,
          comissionsRow,
          costsRow,
        ],
      }),
      [],
    );
  const rowData = useMemo(
    () =>
      productTemplateMap[
        productLine?.[ProductLineFields.ProductTemplateCode] ||
          ProductLineTemplateType.Financing
      ],
    [productLine],
  );
  const rowDataHalfway = useMemo(
    () => Math.floor(rowData.length / 2),
    [rowData],
  );
  const doubleTable = useMemo(() => rowData.length > 4, [rowData]);

  return (
    <Grid item container xs={12}>
      <Grid item xs={doubleTable ? 6 : 12}>
        <Table>
          {(!doubleTable ? rowData : rowData.slice(0, rowDataHalfway)).map(
            (row: LineDetailRow) => (
              <StyledTableRow>
                <TableCell sx={{ width: 1 / 2 }}>
                  <MarketTypography style={headerStyle}>
                    {row.label}
                  </MarketTypography>
                </TableCell>
                <TableCell align={'left'}>
                  <MarketTypography style={numericCellTextStyle}>
                    {!(productLine[row.field] || productLine[row.field] === 0)
                      ? 'No informa'
                      : rowFormatter(productLine, row.field)}{' '}
                  </MarketTypography>
                </TableCell>
              </StyledTableRow>
            ),
          )}
        </Table>
      </Grid>
      {doubleTable && (
        <Grid item xs={6}>
          <Table>
            {rowData
              .slice(rowDataHalfway, rowData.length)
              .map((row: LineDetailRow) => (
                <StyledTableRow>
                  <TableCell sx={{ width: 1 / 2 }}>
                    <MarketTypography style={headerStyle}>
                      {row.label}
                    </MarketTypography>
                  </TableCell>
                  <TableCell align={'left'}>
                    <MarketTypography style={numericCellTextStyle}>
                      {!(productLine[row.field] || productLine[row.field] === 0)
                        ? 'No informa'
                        : rowFormatter(productLine, row.field)}{' '}
                    </MarketTypography>
                  </TableCell>
                </StyledTableRow>
              ))}
          </Table>
        </Grid>
      )}

      <Grid item xs={12}>
        <Stack spacing={1}>
          {productLine[ProductLineFields.CommissionDesc] && (
            <Typography>{`* ${productLine[ProductLineFields.CommissionDesc]}`}</Typography>
          )}

          {productLine[ProductLineFields.RateInformation] && (
            <Typography>{`** ${productLine[ProductLineFields.RateInformation]}`}</Typography>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}

export function LoadingProductLineDetailTable() {
  const rows: LineDetailRow[] = [
    // {
    //     name: 'MONEDA', value: <Skeleton variant="text"
    //                                      sx={{fontSize: '1rem'}}/>
    // },
    // {
    //     name: 'VIGENCIA', value: <Skeleton variant="text"
    //                                        sx={{fontSize: '1rem'}}/>
    // },
    // {
    //     name: 'COMISIONES', value: <Skeleton variant="text"
    //                                          sx={{fontSize: '1rem'}}/>
    // },
    // {
    //     name: 'PORC. COBERTURA AVAL', value: <Skeleton variant="text"
    //                                                    sx={{fontSize: '1rem'}}/>
    // },
  ];

  return (
    <Table>
      {rows.map((row: LineDetailRow) => (
        <StyledTableRow>
          <TableCell sx={{ width: 1 / 2 }}>
            {/*<MarketTypography>{row.name}</MarketTypography>*/}
          </TableCell>
          <TableCell align={'left'}>
            {/*<MarketTypography>{row.value}</MarketTypography>*/}
          </TableCell>
        </StyledTableRow>
      ))}
    </Table>
  );
}
