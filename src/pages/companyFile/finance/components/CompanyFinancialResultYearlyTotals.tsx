import React, {useEffect, useState} from "react";
import {
    CompanyFinancialTotals,
    CompanyFinancialTotalsFields, CompanyIncomeLastYearStatementFields
} from "types/company/companyFinanceInformationData";
import {numberFormatter} from "util/formatters/numberFormatter";
import {Box, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import {ITableColumn, TableColumnType, TableList} from "components/table";
import {dateFormatter} from "util/formatters/dateFormatter";
import {ControlledTextFieldFilled} from "components/forms";
import {useFormContext} from "react-hook-form";
import { DescriptionFinancialTotals, DescriptionFinancialTotalsFields } from "types/general/generalFinanceData";
import {TypographyBase} from "../../../../components/misc/TypographyBase";


interface FinancialResultYearlyTotalsProps {
    totals: CompanyFinancialTotals[];
    incomeNameBase?: string;
    disabled?: boolean;
}

declare type CompanyFinancialTotalsNumericalFields = 'ventas' | 'resultadoNeto';

interface CompanyFinancialTotalsNumericalColumns {
    label: string;
    field: CompanyFinancialTotalsNumericalFields;
    total?: boolean;
}

const financialTotalsColumns: CompanyFinancialTotalsNumericalColumns[] = [
    {
        label: 'Ventas',
        field: 'ventas',
        total: false
    },
    {
        label: 'Resultado Neto',
        field: 'resultadoNeto',
        total: false
    }
]

const CompanyFinancialResultYearlyTotals = ({
                                          totals,
                                      }: FinancialResultYearlyTotalsProps
) => {

    const [columns, setColumns] = useState<ITableColumn[]>([]);
    const [financialTotal, setFinancialTotals] =
        useState<DescriptionFinancialTotals[]>();

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
                    label: dateFormatter.toYearDate(totals[0][CompanyFinancialTotalsFields.Date]),
                    value: DescriptionFinancialTotalsFields.TotalCurrentYear,
                    type: TableColumnType.Currency,
                    currency: "$",
                    textAlign: 'right',
                    textAlignHeader: 'right',
                    onCheckingHighlighted: checkingHighlighted
                },
                {
                    label: dateFormatter.toYearDate(totals[1][CompanyFinancialTotalsFields.Date]),
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
            <Typography variant={'subtitle2'} fontWeight={500} sx={{marginLeft: '16px !important'}}>Estado de Resultado</Typography>

            <TableList entityList={financialTotal}
                       columns={columns}
                       isLoading={!financialTotal || !totals}
                       error={false}
            />
        </Stack>
    );
};

export const FinancialResultYearlyEditTotals = ({ totals, incomeNameBase, disabled }: FinancialResultYearlyTotalsProps) => {
    const [columns, setColumns] = useState<ITableColumn[]>([]);
    const [financialTotal, setFinancialTotals] = useState<DescriptionFinancialTotals[]>();
  
    const incomeLastNameBase = `${incomeNameBase}`;
    const incomePreviousNameBase = `${incomeNameBase}.${CompanyIncomeLastYearStatementFields.LastYearIncomeStatement}`;
  
    const { control } = useFormContext();
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));
    const {  watch } = useFormContext();

    const getVariation = (field: CompanyFinancialTotalsFields): string => {
      //@ts-ignore
      let currentYear: number | undefined = totals[0][field];
      //@ts-ignore
      let lastYear: number | undefined = totals[1][field];
  
      if (!currentYear || !lastYear) return '-';
  
      return numberFormatter.toStringWithPercentage(((currentYear - lastYear) / lastYear) * 100);
    };
  
    const handleFocus = (e: any) => e.target.select();
    const checkingHighlighted = (entity: DescriptionFinancialTotals) =>
      entity[DescriptionFinancialTotalsFields.Highlighted];
  
    useEffect(() => {
      if (totals) {
        setFinancialTotals(undefined);
        setColumns([]);
  
        setColumns([
          {
            label: '',
            value: DescriptionFinancialTotalsFields.Description,
            textAlign: 'left',
          },
          {
            label: dateFormatter.toYearDate(totals[0][CompanyFinancialTotalsFields.Date]),
            value: DescriptionFinancialTotalsFields.TotalCurrentYear,
            textAlign: 'right',
            textAlignHeader: 'center',
            onRenderCell: (item: DescriptionFinancialTotals) => (
                disabled ?
                    <TypographyBase variant={'body3'}>
                        {numberFormatter.toStringWithAmount(watch(`${incomeLastNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                    </TypographyBase>
                    :
                      <ControlledTextFieldFilled
                        control={control}
                        name={`${incomeLastNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                        disabled={item[DescriptionFinancialTotalsFields.Highlighted]}
                        fullWidth
                        currency
                        textAlign={'right'}
                        onFocus={handleFocus}
                      />
            ),
          },
          {
            label: `${dateFormatter.toYearDate(totals[1][CompanyFinancialTotalsFields.Date])} ajustado`,
            value: DescriptionFinancialTotalsFields.TotalPreviousYear,
            textAlign: 'right',
            textAlignHeader: 'center',
            onRenderCell: (item: DescriptionFinancialTotals) => (
                disabled ?
                    <TypographyBase variant={'body3'}>
                        {numberFormatter.toStringWithAmount(watch(`${incomePreviousNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                    </TypographyBase>
                    :
                  <ControlledTextFieldFilled
                    control={control}
                    name={`${incomePreviousNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
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
          },
        ]);
  
        const finalTotalData = financialTotalsColumns.map((x) => {
          const field = x.field;
  
          return {
            [DescriptionFinancialTotalsFields.Description]: x.label,
            [DescriptionFinancialTotalsFields.TotalCurrentYear]: totals[0][field] ?? 0,
            [DescriptionFinancialTotalsFields.TotalPreviousYear]: totals[1][field] ?? 0,
            [DescriptionFinancialTotalsFields.Variation]: getVariation(field),
            [DescriptionFinancialTotalsFields.Field]: field,
            [DescriptionFinancialTotalsFields.Highlighted]: !!x.total,
          } as DescriptionFinancialTotals;
        });
  
        setFinancialTotals(finalTotalData);
      }
    }, [totals]);
  
    if (isMobileScreenSize) {
      
      const currentYearDate = totals[0][CompanyFinancialTotalsFields.Date];
      const previousYearDate = totals[1][CompanyFinancialTotalsFields.Date];
    
      const groupedByYear = [
        { year: currentYearDate, nameBase: incomeLastNameBase },
        { year: previousYearDate, nameBase: incomePreviousNameBase },
      ];
    
      return (
        <Stack spacing={2}>
          <Typography variant={'subtitle2'} fontWeight={500} sx={{ marginLeft: '16px !important' }}>
            Estado de Resultado
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
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mb: 1, gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={500} sx={{ flex: 1.7 }}>
                      {item[DescriptionFinancialTotalsFields.Description]}
                    </Typography>
      
                    <Box sx={{ flex: 2.3, display: 'flex', justifyContent: 'flex-end' }}>
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
                  </Stack>
      
                  {year === currentYearDate && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mt: 1 }}>
                      <Typography variant="caption" sx={{ flex: 1.7, color: 'text.secondary', fontWeight: 500 }}>
                        Variación
                      </Typography>
                      <Typography variant="caption" sx={{ flex: 2.3, textAlign: 'right', color: 'text.secondary', fontWeight: 500, mr: '14px' }}>
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
        <Typography variant={'subtitle2'} fontWeight={500} sx={{ marginLeft: '16px !important' }}>
          Estado de Resultado
        </Typography>
        <TableList entityList={financialTotal} columns={columns} isLoading={!financialTotal || !totals} error={false} />
      </Stack>
    );
  };


export default CompanyFinancialResultYearlyTotals