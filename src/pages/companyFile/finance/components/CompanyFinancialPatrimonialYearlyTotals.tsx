import React, {useEffect, useState} from "react";
import {Box, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import {
    CompanyFinancialTotals,
    CompanyPatrimonialStatementFields
} from "types/company/companyFinanceInformationData";
import {numberFormatter} from "util/formatters/numberFormatter";
import {ITableColumn, TableColumnType, TableList} from "components/table";
import {dateFormatter} from "util/formatters/dateFormatter";
import {ControlledTextFieldFilled} from "../../../../components/forms";
import {useFormContext} from "react-hook-form";
import {
    DescriptionFinancialTotals,
    DescriptionFinancialTotalsFields,
    FinancialYearFields,
    PatrimonialStatementFields
} from "../../../../types/general/generalFinanceData";
import {TypographyBase} from "../../../../components/misc/TypographyBase";

interface FinancialPatrimonialYearlyTotalsProps {
    totals: CompanyFinancialTotals[];
    patrimonialNameBase?: string;
    disabled?: boolean
}

declare type FinancialTotalsNumericalFields =
    PatrimonialStatementFields.ActiveCurrentTotal | PatrimonialStatementFields.ActiveNotCurrentTotal |
    PatrimonialStatementFields.ActiveTotal | PatrimonialStatementFields.PassiveCurrentTotal |
    PatrimonialStatementFields.PassiveNotCurrentTotal | PatrimonialStatementFields.PassiveTotal |
    PatrimonialStatementFields.NetPatrimonyTotal;

interface FinancialTotalsNumericalColumns {
    label: string;
    field: FinancialTotalsNumericalFields;
    total?: boolean;
}

const financialTotalsColumns: FinancialTotalsNumericalColumns[] = [
    {
        label: 'Activo Corriente',
        field: PatrimonialStatementFields.ActiveCurrentTotal,
    },
    {
        label: 'Activo No Corriente',
        field: PatrimonialStatementFields.ActiveNotCurrentTotal,
    },
    {
        label: 'Total Activo',
        field: PatrimonialStatementFields.ActiveTotal,
        total: true,
    },
    {
        label: 'Pasivo Corriente',
        field: PatrimonialStatementFields.PassiveCurrentTotal,
    },
    {
        label: 'Pasivo No Corriente',
        field: PatrimonialStatementFields.PassiveNotCurrentTotal,
    },
    {
        label: 'Total Pasivo',
        field: PatrimonialStatementFields.PassiveTotal,
        total: true,
    },
    {
        label: 'Patrimonio Neto',
        field: PatrimonialStatementFields.NetPatrimonyTotal,
        total: true,
    }
]

const CompanyFinancialPatrimonialYearlyTotals = ({
                                          totals,
                                      }: FinancialPatrimonialYearlyTotalsProps
) => {
    
    const [columns, setColumns] = useState<ITableColumn[]>([]);
    const [financialTotal, setFinancialTotals] = 
        useState<DescriptionFinancialTotals[]>();
    const getVariation = (field: PatrimonialStatementFields): string => {
        //@ts-ignore
        let currentYear: number | undefined = totals[0][field];
        //@ts-ignore
        let lastYear: number | undefined = totals[1][field];

        if (!currentYear || !lastYear) return '-';

        return numberFormatter.toStringWithPercentage(
            ((currentYear - lastYear) / lastYear) * 100,
        );
    };

    const checkingHighlighted = (entity: DescriptionFinancialTotals) => 
        entity[DescriptionFinancialTotalsFields.Highlighted];
    
    useEffect(() => {
        if (totals && totals.length) {
            setFinancialTotals(undefined);
            setColumns([]);
            
            setColumns([
                {
                    label: '',
                    value: DescriptionFinancialTotalsFields.Description,
                    textAlign: 'left',
                    onCheckingHighlighted: checkingHighlighted
                },
                {
                    label: dateFormatter.toYearDate(totals[0][FinancialYearFields.Date]),
                    value: DescriptionFinancialTotalsFields.TotalCurrentYear,
                    type: TableColumnType.Currency,
                    currency: "$",
                    textAlign: 'right',
                    textAlignHeader: 'right',
                    onCheckingHighlighted: checkingHighlighted
                },
                {
                    label: dateFormatter.toYearDate(totals[1][FinancialYearFields.Date]),
                    value: DescriptionFinancialTotalsFields.TotalPreviousYear,
                    type: TableColumnType.Currency,
                    currency: "$",
                    textAlign: 'right',
                    textAlignHeader: 'right',
                    onCheckingHighlighted: checkingHighlighted
                },
                {
                    label: 'Variación',
                    value: DescriptionFinancialTotalsFields.Variation,
                    textAlign: 'right',
                    textAlignHeader: 'center',
                    onCheckingHighlighted: checkingHighlighted
                },
            ])
            
            const finalTotalData = financialTotalsColumns.map(x => {
                const field = x.field;
                
                return {
                    [DescriptionFinancialTotalsFields.Description]: x.label,
                    [DescriptionFinancialTotalsFields.TotalCurrentYear]: totals[0][field] ?? 0,
                    [DescriptionFinancialTotalsFields.TotalPreviousYear]: totals[1][field] ?? 0,
                    [DescriptionFinancialTotalsFields.Variation]: getVariation(field),
                    [DescriptionFinancialTotalsFields.Highlighted]: !!x.total
                } as DescriptionFinancialTotals
            })
            setFinancialTotals(finalTotalData);
        }
    }, [totals]);
    
    return (
        <Stack spacing={2}>
            <Typography variant={'subtitle2'} fontWeight={500} sx={{marginLeft: '16px !important'}}>Estado de Situación Patrimonial</Typography>
            
            <TableList entityList={financialTotal}
                       columns={columns}
                       isLoading={!financialTotal || !totals}
                       error={false}
            />
        </Stack>
    );
};

export const FinancialPatrimonialYearlyEditTotals = ({ totals, patrimonialNameBase, disabled }: FinancialPatrimonialYearlyTotalsProps) => {
  const [columns, setColumns] = useState<ITableColumn[]>([]);
  const [financialTotal, setFinancialTotals] = useState<DescriptionFinancialTotals[]>();

  const patrimonialLastNameBase = `${patrimonialNameBase}`;
  const patrimonialPreviousNameBase = `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}`;

  const { control, watch, setValue } = useFormContext();
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));

  const getVariation = (field: FinancialTotalsNumericalFields): string => {
    //@ts-ignore
    let currentYear: number | undefined = totals[0][field];
    //@ts-ignore
    let lastYear: number | undefined = totals[1][field];

    if (!currentYear || !lastYear) return '-';

    return numberFormatter.toStringWithPercentage(((currentYear - lastYear) / lastYear) * 100);
  };

  const watchActiveCurrentTotal = watch(`${patrimonialLastNameBase}.${PatrimonialStatementFields.ActiveCurrentTotal}`, 0);
  const watchActiveNotCurrentTotal = watch(`${patrimonialLastNameBase}.${PatrimonialStatementFields.ActiveNotCurrentTotal}`, 0);
  const watchActiveTotal = watch(`${patrimonialLastNameBase}.${PatrimonialStatementFields.ActiveTotal}`, 0);
  const watchPassiveCurrentTotal = watch(`${patrimonialLastNameBase}.${PatrimonialStatementFields.PassiveCurrentTotal}`, 0);
  const watchPassiveNotCurrentTotal = watch(`${patrimonialLastNameBase}.${PatrimonialStatementFields.PassiveNotCurrentTotal}`, 0);
  const watchPassiveTotal = watch(`${patrimonialLastNameBase}.${PatrimonialStatementFields.PassiveTotal}`, 0);
  const watchLastActiveCurrentTotal = watch(`${patrimonialPreviousNameBase}.${PatrimonialStatementFields.ActiveCurrentTotal}`, 0);
  const watchLastActiveNotCurrentTotal = watch(`${patrimonialPreviousNameBase}.${PatrimonialStatementFields.ActiveNotCurrentTotal}`, 0);
  const watchLastActiveTotal = watch(`${patrimonialPreviousNameBase}.${PatrimonialStatementFields.ActiveTotal}`, 0);
  const watchLastPassiveCurrentTotal = watch(`${patrimonialPreviousNameBase}.${PatrimonialStatementFields.PassiveCurrentTotal}`, 0);
  const watchLastPassiveNotCurrentTotal = watch(`${patrimonialPreviousNameBase}.${PatrimonialStatementFields.PassiveNotCurrentTotal}`, 0);
  const watchLastPassiveTotal = watch(`${patrimonialPreviousNameBase}.${PatrimonialStatementFields.PassiveTotal}`, 0);
  
  useEffect(() => {
    setValue(
      `${patrimonialLastNameBase}.${PatrimonialStatementFields.ActiveTotal}`,
      parseFloat(watchActiveCurrentTotal || '0') + parseFloat(watchActiveNotCurrentTotal || '0'),
    );
  }, [watchActiveCurrentTotal, watchActiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialLastNameBase}.${PatrimonialStatementFields.PassiveTotal}`,
      parseFloat(watchPassiveCurrentTotal || '0') + parseFloat(watchPassiveNotCurrentTotal || '0'),
    );
  }, [watchPassiveCurrentTotal, watchPassiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialLastNameBase}.${PatrimonialStatementFields.NetPatrimonyTotal}`,
      parseFloat(watchActiveTotal || '0') - parseFloat(watchPassiveTotal || '0'),
    );
  }, [watchActiveTotal, watchPassiveTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialPreviousNameBase}.${PatrimonialStatementFields.ActiveTotal}`,
      parseFloat(watchLastActiveCurrentTotal || '0') + parseFloat(watchLastActiveNotCurrentTotal || '0'),
    );
  }, [watchLastActiveCurrentTotal, watchLastActiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialPreviousNameBase}.${PatrimonialStatementFields.PassiveTotal}`,
      parseFloat(watchLastPassiveCurrentTotal || '0') + parseFloat(watchLastPassiveNotCurrentTotal || '0'),
    );
  }, [watchLastPassiveCurrentTotal, watchLastPassiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialPreviousNameBase}.${PatrimonialStatementFields.NetPatrimonyTotal}`,
      parseFloat(watchLastActiveTotal || '0') - parseFloat(watchLastPassiveTotal || '0'),
    );
  }, [watchLastActiveTotal, watchLastPassiveTotal]);

  const checkingHighlighted = (entity: DescriptionFinancialTotals) =>
    entity[DescriptionFinancialTotalsFields.Highlighted];

  const handleFocus = (e: any) => e.target.select();

  useEffect(() => {
    if (totals) {
      setFinancialTotals(undefined);
      setColumns([]);

      setColumns([
        {
          label: '',
          value: DescriptionFinancialTotalsFields.Description,
          textAlign: 'left',
          onCheckingHighlighted: checkingHighlighted
        },
        {
          label: dateFormatter.toYearDate(totals[0][FinancialYearFields.Date]),
          value: DescriptionFinancialTotalsFields.TotalCurrentYear,
          currency: '$',
          textAlign: 'right',
          textAlignHeader: 'center',
          onCheckingHighlighted: checkingHighlighted,
          onRenderCell: (item: DescriptionFinancialTotals) =>
            item[DescriptionFinancialTotalsFields.Highlighted] ? (
              <Typography variant={'body2'} sx={{fontSize: '.9rem !important'}}>
                {numberFormatter.toStringWithAmount(watch(`${patrimonialLastNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
              </Typography>
            ) : (
                disabled ?
                    <TypographyBase variant={'body3'}>
                        {numberFormatter.toStringWithAmount(watch(`${patrimonialLastNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                    </TypographyBase>
                    :
                      <ControlledTextFieldFilled
                        control={control}
                        name={`${patrimonialLastNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                        disabled={item[DescriptionFinancialTotalsFields.Highlighted]}
                        fullWidth
                        currency
                        textAlign={'right'}
                        onFocus={handleFocus}
                      />
            ),
        },
        {
          label: `${dateFormatter.toYearDate(totals[1][FinancialYearFields.Date])} ajustado`,
          value: DescriptionFinancialTotalsFields.TotalPreviousYear,
          currency: '$',
          textAlign: 'right',
          textAlignHeader: 'center',
          onCheckingHighlighted: checkingHighlighted,
          onRenderCell: (item: DescriptionFinancialTotals) =>
            item[DescriptionFinancialTotalsFields.Highlighted] ? (
              <Typography variant={'body2'} sx={{fontSize: '.9rem !important'}}>
                {numberFormatter.toStringWithAmount(watch(`${patrimonialPreviousNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
              </Typography>
            ) : (
                disabled ?
                    <TypographyBase variant={'body3'}>
                        {numberFormatter.toStringWithAmount(watch(`${patrimonialPreviousNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                    </TypographyBase>
                    :
                      <ControlledTextFieldFilled
                        control={control}
                        name={`${patrimonialPreviousNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                        disabled={item[DescriptionFinancialTotalsFields.Highlighted]}
                        fullWidth
                        currency
                        textAlign={'right'}
                        onFocus={handleFocus}
                      />
            ),
        },
        {
          label: 'Variación',
          value: DescriptionFinancialTotalsFields.Variation,
          textAlign: 'right',
          textAlignHeader: 'center',
          onCheckingHighlighted: checkingHighlighted,
        },
      ]);

      const finalTotalData = financialTotalsColumns.map((x) => {
        const field = x.field;

        return {
          [DescriptionFinancialTotalsFields.Description]: x.label,
          [DescriptionFinancialTotalsFields.TotalCurrentYear]: totals[0][field] ?? 0,
          [DescriptionFinancialTotalsFields.TotalPreviousYear]: totals[1][field] ?? 0,
          [DescriptionFinancialTotalsFields.Variation]: getVariation(field),
          [DescriptionFinancialTotalsFields.Highlighted]: !!x.total,
          [DescriptionFinancialTotalsFields.Field]: field,
        } as DescriptionFinancialTotals;
      });

      setFinancialTotals(finalTotalData);
    }
  }, [totals]);


  if (isMobileScreenSize) {
    const currentYearDate = totals[0][FinancialYearFields.Date];
    const previousYearDate = totals[1][FinancialYearFields.Date];
  
    const groupedByYear = [
      { year: currentYearDate, nameBase: patrimonialLastNameBase },
      { year: previousYearDate, nameBase: patrimonialPreviousNameBase },
    ];
    
    return (
      <Stack spacing={2}>
        <Typography variant={'subtitle2'} fontWeight={500} sx={{ marginLeft: '16px !important', marginTop: '16px !important' }}>
          Estado de Situación Patrimonial
        </Typography>
  
        {groupedByYear.map(({ year, nameBase }) => (
          <Box key={year} sx={{ mb: 3, borderBottom: '1px solid #EDF2F7', pb: 2 }}>
            <Box
              sx={{
                backgroundColor: '#F7FAFC',
                borderRadius: '4px',
                padding: '8px 16px',
                mb: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="subtitle2" fontWeight={500}>
                {dateFormatter.toYearDate(year)}
              </Typography>
            </Box>
  
            {financialTotal?.map((item) => (
              <Box key={`${year}-${item[DescriptionFinancialTotalsFields.Description]}`} sx={{ mb: 2, paddingX: '16px' }}>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                  {item[DescriptionFinancialTotalsFields.Description]}
                </Typography>
  
                <Box sx={{ width: '100%' }}>
                  {item[DescriptionFinancialTotalsFields.Highlighted] ? (
                    <Typography
                      variant="subtitle1"
                      textAlign={'right'}
                      sx={{
                        mr: '14px',
                        minWidth: '126px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {numberFormatter.toStringWithAmount(watch(`${nameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                    </Typography>
                  ) : (
                    <ControlledTextFieldFilled
                      control={control}
                      name={`${nameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                      disabled={item[DescriptionFinancialTotalsFields.Highlighted]}
                      fullWidth
                      currency
                      textAlign={'right'}
                      onFocus={handleFocus}
                      sx={{ width: '100%' }}
                    />
                  )}
                </Box>
                {year === currentYearDate && (
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mt: 1 }}>
                    <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary' }}>
                      Variación
                    </Typography>
                    <Typography variant="caption" sx={{ flex: 1, textAlign: 'right', color: 'text.secondary', mr: '14px', }}>
                      {item[DescriptionFinancialTotalsFields.Variation]}
                    </Typography>
                  </Stack>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant={'subtitle2'} fontWeight={500} sx={{ marginLeft: '16px !important', marginTop: '16px !important' }}>
        Estado de Situación Patrimonial
      </Typography>
      <TableList entityList={financialTotal} columns={columns} isLoading={!financialTotal || !totals} error={false} />
    </Stack>
  );
};

export default CompanyFinancialPatrimonialYearlyTotals