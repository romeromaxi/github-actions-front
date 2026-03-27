import {useEffect, useState} from "react";
import {Box, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import {
    DescriptionFinancialTotals,
    DescriptionFinancialTotalsFields,
    IncomeStatementFields
} from "../../../../types/general/generalFinanceData";
import {numberFormatter} from "../../../../util/formatters/numberFormatter";
import {ITableColumn, TableList} from "../../../../components/table";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import {ControlledTextFieldFilled} from "../../../../components/forms";
import {useFormContext} from "react-hook-form";
import {TypographyBase} from "../../../../components/misc/TypographyBase";

interface FinancialResultDynamicYearlyTotalsProps {
    year: number;
    incomeNameBase: string;
    disabled?: boolean
}

interface DynamicIncomeTotalsColumns {
    label: string;
    field: string;
    total?: boolean;
}

const financialResultColumns: DynamicIncomeTotalsColumns[] = [
    {
        label: 'Ventas',
        field: IncomeStatementFields.Sales,
    },
    {
        label: 'Costo de Ventas',
        field: IncomeStatementFields.CostOfSales,
    },
    {
        label: 'Resultado Bruto',
        field: IncomeStatementFields.GrossResult,
        total: true,
    },
    {
        label: 'Gastos Operativos',
        field: IncomeStatementFields.OperatingExpenses,
    },
    {
        label: 'Amortizaciones',
        field: IncomeStatementFields.AmortizationTotal,
    },
    {
        label: 'Resultados Operativos',
        field: IncomeStatementFields.OperatingResults,
        total: true,
    },
    {
        label: 'Otros Ingresos/Gastos',
        field: IncomeStatementFields.OtherIncomeAndExpenses,
    },
    {
        label: 'Resultados Extraordinarios',
        field: IncomeStatementFields.ExtraordinaryResults,
    },
    {
        label: 'Intereses Ganados',
        field: IncomeStatementFields.InterestIncome,
    },
    {
        label: 'Intereses Pagados',
        field: IncomeStatementFields.InterestExpense,
    },
    {
        label: 'Impuesto a las Ganancias',
        field: IncomeStatementFields.IncomeTaxExpense,
    },
    {
        label: 'Resultado Neto',
        field: IncomeStatementFields.NetResult,
        total: true,
    }
];

export const FinancialResultDynamicYearlyTotals = ({
    year, incomeNameBase, disabled
}: FinancialResultDynamicYearlyTotalsProps) => {
    const [columns, setColumns] = useState<ITableColumn[]>([]);
    const [financialTotal, setFinancialTotals] = useState<DescriptionFinancialTotals[]>();

    const { control, watch, setValue } = useFormContext();
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));

    const currentDate = new Date(year, 1, 1);

    const incomeCurrentNameBase = `${incomeNameBase}`;

    const watchSales = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.Sales}`, 0);
    const watchCMV = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.CostOfSales}`, 0);
    const watchGrossResult = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.GrossResult}`, 0);
    const watchOperatingExpenses = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.OperatingExpenses}`, 0);
    const watchAmortization = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.AmortizationTotal}`, 0);
    const watchOperatingResults = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.OperatingResults}`, 0);
    const watchOtherIncomeExpenses = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.OtherIncomeAndExpenses}`, 0);
    const watchExtraordinaryResults = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.ExtraordinaryResults}`, 0);
    const watchInterestsEarned = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.InterestIncome}`, 0);
    const watchInterestsPaid = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.InterestExpense}`, 0);
    const watchIncomeTax = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.IncomeTaxExpense}`, 0);
    const watchNetResult = watch(`${incomeCurrentNameBase}.${IncomeStatementFields.NetResult}`, 0);

    /*useEffect(() => {
        const grossResult = parseFloat(watchSales || '0') - parseFloat(watchCMV || '0');
        setValue(`${incomeCurrentNameBase}.${IncomeStatementFields.GrossResult}`, grossResult);
    }, [watchSales, watchCMV]);*/

    /*useEffect(() => {
        const operatingResults = 
            parseFloat(watchGrossResult || '0') - 
            parseFloat(watchOperatingExpenses || '0');
        setValue(`${incomeCurrentNameBase}.${IncomeStatementFields.OperatingResults}`, operatingResults);
    }, [watchGrossResult, watchOperatingExpenses]);*/

    /*useEffect(() => {
        const netResult = 
            parseFloat(watchOperatingResults || '0') -
            parseFloat(watchAmortization || '0') +
            parseFloat(watchOtherIncomeExpenses || '0') + 
            parseFloat(watchExtraordinaryResults || '0') + 
            parseFloat(watchInterestsEarned || '0') - 
            parseFloat(watchInterestsPaid || '0') - 
            parseFloat(watchIncomeTax || '0');
        setValue(`${incomeCurrentNameBase}.${IncomeStatementFields.NetResult}`, netResult);
    }, [watchOperatingResults, watchOtherIncomeExpenses, watchExtraordinaryResults, 
        watchInterestsEarned, watchInterestsPaid, watchIncomeTax, watchAmortization]);*/

    const checkingHighlighted = (entity: DescriptionFinancialTotals) =>
        entity[DescriptionFinancialTotalsFields.Highlighted];

    const handleFocus = (e: any) => e.target.select();

    useEffect(() => {
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
                label: 'Valor',
                value: DescriptionFinancialTotalsFields.TotalCurrentYear,
                currency: '$',
                textAlign: 'right',
                textAlignHeader: 'right',
                onCheckingHighlighted: checkingHighlighted,
                onRenderCell: (item: DescriptionFinancialTotals) =>
                    (item[DescriptionFinancialTotalsFields.Highlighted] && !item[DescriptionFinancialTotalsFields.HighlightedEditable]) ? (
                        <Typography variant={'body2'} sx={{fontSize: '.9rem !important'}}>
                            {numberFormatter.toStringWithAmount(watch(`${incomeCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                        </Typography>
                    ) : (
                        disabled ?
                            <TypographyBase>
                                {numberFormatter.toStringWithAmount(watch(`${incomeCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                            </TypographyBase>
                            :
                            <ControlledTextFieldFilled
                                control={control}
                                name={`${incomeCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                                fullWidth
                                currency
                                textAlign={'right'}
                                onFocus={handleFocus}
                                inputProps={{ style: { fontWeight: item[DescriptionFinancialTotalsFields.Highlighted] ? 600 : 400 } }}
                            />
                    ),
            },
        ]);

        const finalTotalData = financialResultColumns.map((x) => {
            const field = x.field;

            return {
                [DescriptionFinancialTotalsFields.Description]: x.label,
                [DescriptionFinancialTotalsFields.TotalCurrentYear]: watch(`${incomeCurrentNameBase}.${field}`) ?? 0,
                [DescriptionFinancialTotalsFields.Highlighted]: !!x.total,
                [DescriptionFinancialTotalsFields.HighlightedEditable]: true,
                [DescriptionFinancialTotalsFields.Field]: field,
            } as DescriptionFinancialTotals;
        });

        setFinancialTotals(finalTotalData);
    }, [year, watchSales, watchCMV, watchGrossResult, watchOperatingExpenses, watchAmortization, 
        watchOperatingResults, watchOtherIncomeExpenses, watchExtraordinaryResults, 
        watchInterestsEarned, watchInterestsPaid, watchIncomeTax, watchNetResult]);

    if (isMobileScreenSize) {
        return (
            <Stack spacing={2}>
                <Typography variant={'subtitle2'} fontWeight={500} sx={{ marginLeft: '16px !important' }}>
                    Estado de Resultado
                </Typography>

                <Box sx={{ mb: 3, borderBottom: '1px solid #EDF2F7', pb: 2 }}>
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
                            {dateFormatter.toYearDate(currentDate)}
                        </Typography>
                    </Box>

                    {financialTotal?.map((item) => (
                        <Box key={`${currentDate}-${item[DescriptionFinancialTotalsFields.Description]}`} sx={{ mb: 2, paddingX: '16px' }}>
                            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                                {item[DescriptionFinancialTotalsFields.Description]}
                            </Typography>

                            <Box sx={{ width: '100%' }}>
                                {(item[DescriptionFinancialTotalsFields.Highlighted] && !item[DescriptionFinancialTotalsFields.HighlightedEditable]) ? (
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
                                        {numberFormatter.toStringWithAmount(watch(`${incomeCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                                    </Typography>
                                ) : (
                                    <ControlledTextFieldFilled
                                        control={control}
                                        name={`${incomeCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                                        disabled={!item[DescriptionFinancialTotalsFields.HighlightedEditable]}
                                        fullWidth
                                        currency
                                        textAlign={'right'}
                                        onFocus={handleFocus}
                                        sx={{ width: '100%' }}
                                    />
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Stack>
        );
    }

    return (
        <Stack spacing={2}>
            <Typography variant={'subtitle2'} fontWeight={500} sx={{marginLeft: '16px !important'}}>
                Estado de Resultado
            </Typography>
            
            <TableList 
                entityList={financialTotal}
                columns={columns}
                isLoading={!financialTotal}
                error={false}
            />
        </Stack>
    );
};