import {useEffect, useState} from "react";
import {Box, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import {
    DescriptionFinancialTotals,
    DescriptionFinancialTotalsFields,
    PatrimonialStatementFields
} from "../../../../types/general/generalFinanceData";
import {numberFormatter} from "../../../../util/formatters/numberFormatter";
import {ITableColumn, TableList} from "../../../../components/table";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import {ControlledTextFieldFilled} from "../../../../components/forms";
import {useFormContext} from "react-hook-form";
import { TypographyBase } from "components/misc/TypographyBase";

interface FinancialPatrimonialDynamicYearlyTotalsProps {
    year: number;
    patrimonialNameBase: string;
    disabled?: boolean 
}

declare type FinancialTotalsNumericalFields = string;

interface FinancialTotalsNumericalColumns {
    label: string;
    field: FinancialTotalsNumericalFields;
    total?: boolean;
    totalEditable?: boolean;
}

const financialTotalsColumns: FinancialTotalsNumericalColumns[] = [
    { label: 'Disponibilidades', field: PatrimonialStatementFields.ActiveCurrentAvailabilities },
    { label: 'Créditos por Ventas', field: PatrimonialStatementFields.ActiveCurrentSalesReceivables },
    { label: 'Bienes de Cambio', field: PatrimonialStatementFields.ActiveCurrentExchangeThing },
    { label: 'Cuenta Particulares CP', field: PatrimonialStatementFields.ActiveCurrentPartnerAccountsCP },
    { label: 'Otros Activos CP', field: PatrimonialStatementFields.ActiveCurrentOthers },
    {
        label: 'Activo Corriente',
        field: PatrimonialStatementFields.ActiveCurrentTotal,
        total: true,
        totalEditable: true
    },
    { label: 'Bienes de Uso', field: PatrimonialStatementFields.ActiveNotCurrentThingOfUse },
    { label: 'Inmuebles', field: PatrimonialStatementFields.ActiveNotCurrentLandAndBuildings },
    { label: 'Otros Bienes de Uso', field: PatrimonialStatementFields.ActiveNotCurrentOtherGoods },
    { label: 'Cuentas Particulares LP', field: PatrimonialStatementFields.ActiveNotCurrentPartnerAccountsLP },
    { label: 'Otros Activos LP', field: PatrimonialStatementFields.ActiveNotCurrentOthers },
    {
        label: 'Activo No Corriente',
        field: PatrimonialStatementFields.ActiveNotCurrentTotal,
        total: true,
        totalEditable: true
    },
    {
        label: 'Total Activo',
        field: PatrimonialStatementFields.ActiveTotal,
        total: true,
    },
    { label: 'Deudas Comerciales', field: PatrimonialStatementFields.PassiveCurrentCommercialDebt },
    { label: 'Deudas Bancarias CP', field: PatrimonialStatementFields.PassiveCurrentBankDebts },
    { label: 'Deudas Sociales', field: PatrimonialStatementFields.PassiveCurrentSocialDebts },
    { label: 'Deudas Fiscales CP', field: PatrimonialStatementFields.PassiveCurrentFiscalDebts },
    { label: 'Otras Deudas CP', field: PatrimonialStatementFields.PassiveCurrentOtherDebts },
    {
        label: 'Pasivo Corriente',
        field: PatrimonialStatementFields.PassiveCurrentTotal,
        total: true,
        totalEditable: true
    },
    { label: 'Deudas Bancarias LP', field: PatrimonialStatementFields.PassiveNotCurrentBankDebts },
    { label: 'Deudas Fiscales LP', field: PatrimonialStatementFields.PassiveNotCurrentFiscalDebts },
    { label: 'Otros Pasivos LP', field: PatrimonialStatementFields.PassiveNotCurrentOthers },
    {
        label: 'Pasivo No Corriente',
        field: PatrimonialStatementFields.PassiveNotCurrentTotal,
        total: true,
        totalEditable: true
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
    },
]

export const FinancialPatrimonialDynamicYearlyTotals = ({
    year, patrimonialNameBase, disabled
}: FinancialPatrimonialDynamicYearlyTotalsProps) => {
    const [columns, setColumns] = useState<ITableColumn[]>([]);
    const [financialTotal, setFinancialTotals] = useState<DescriptionFinancialTotals[]>();

    const { control, watch, setValue } = useFormContext();
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));

    const currentDate = new Date(year, 1, 1);

    const patrimonialCurrentNameBase = `${patrimonialNameBase}`;

    const watchActiveCurrentTotal = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveCurrentTotal}`, 0);
    const watchActiveNotCurrentTotal = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveNotCurrentTotal}`, 0);
    const watchActiveTotal = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveTotal}`, 0);
    const watchPassiveCurrentTotal = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveCurrentTotal}`, 0);
    const watchPassiveNotCurrentTotal = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveNotCurrentTotal}`, 0);
    const watchPassiveTotal = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveTotal}`, 0);

    //const watchActiveCurrentCashBanks = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveCurrentAvailabilities}`, 0);
    //const watchActiveCurrentSalesReceivables = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveCurrentSalesReceivables}`, 0);
    //const watchActiveCurrentOthers = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveCurrentOthers}`, 0);
    //const watchActiveCurrentPartnerAccountsCP = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveCurrentPartnerAccountsCP}`, 0);
    //const watchActiveCurrentExchangeThing = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveCurrentExchangeThing}`, 0);

    //const watchActiveNotCurrentPartnerAccountsLP = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveNotCurrentPartnerAccountsLP}`, 0);
    //const watchActiveNotCurrentThingOfUse = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveNotCurrentThingOfUse}`, 0);
    //const watchActiveNotCurrentLandAndBuildings = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveNotCurrentLandAndBuildings}`, 0);
    //const watchActiveNotCurrentOtherGoods = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveNotCurrentOtherGoods}`, 0);
    //const watchActiveNotCurrentOthers = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveNotCurrentOthers}`, 0);

    //const watchPassiveCurrentCommercialDebt = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveCurrentCommercialDebt}`, 0);
    //const watchPassiveCurrentLoans = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveCurrentBankDebts}`, 0);
    //const watchPassiveCurrentRemunerations = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveCurrentSocialDebts}`, 0);
    //const watchPassiveCurrentFiscalCharges = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveCurrentFiscalDebts}`, 0);
    //const watchPassiveCurrentOtherDebts = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveCurrentOtherDebts}`, 0);

    //const watchPassiveNotCurrentLoans = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveNotCurrentBankDebts}`, 0);
    //const watchPassiveNotCurrentFiscalCharges = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveNotCurrentFiscalDebts}`, 0);
    //const watchPassiveNotCurrentOthers = watch(`${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveNotCurrentOthers}`, 0);
    
    /*useEffect(() => {
        const total = 
            parseFloat(watchActiveCurrentCashBanks || '0') +
            parseFloat(watchActiveCurrentSalesReceivables || '0') +
            parseFloat(watchActiveCurrentExchangeThing || '0') +
            parseFloat(watchActiveCurrentPartnerAccountsCP || '0') +
            parseFloat(watchActiveCurrentOthers || '0');
        
        setValue(
            `${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveCurrentTotal}`,
            total
        );
    }, [watchActiveCurrentCashBanks, watchActiveCurrentSalesReceivables, watchActiveCurrentExchangeThing,
        watchActiveCurrentPartnerAccountsCP, watchActiveCurrentOthers]);*/

    /*useEffect(() => {
        const total = 
            parseFloat(watchActiveNotCurrentThingOfUse || '0') +
            parseFloat(watchActiveNotCurrentOthers || '0') +
            parseFloat(watchActiveNotCurrentPartnerAccountsLP || '0') +
            parseFloat(watchActiveNotCurrentLandAndBuildings || '0') +
            parseFloat(watchActiveNotCurrentOtherGoods || '0');
        
        setValue(
            `${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveNotCurrentTotal}`,
            total
        );
    }, [watchActiveNotCurrentThingOfUse, watchActiveNotCurrentOthers, watchActiveNotCurrentPartnerAccountsLP,
        watchActiveNotCurrentLandAndBuildings, watchActiveNotCurrentOtherGoods]);*/

    useEffect(() => {
        setValue(
            `${patrimonialCurrentNameBase}.${PatrimonialStatementFields.ActiveTotal}`,
            parseFloat(watchActiveCurrentTotal || '0') + parseFloat(watchActiveNotCurrentTotal || '0'),
        );
    }, [watchActiveCurrentTotal, watchActiveNotCurrentTotal]);

    /*useEffect(() => {
        const total = 
            parseFloat(watchPassiveCurrentCommercialDebt || '0') +
            parseFloat(watchPassiveCurrentLoans || '0') +
            parseFloat(watchPassiveCurrentRemunerations || '0') +
            parseFloat(watchPassiveCurrentFiscalCharges || '0') +
            parseFloat(watchPassiveCurrentOtherDebts || '0');
        
        setValue(
            `${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveCurrentTotal}`,
            total
        );
    }, [watchPassiveCurrentCommercialDebt, watchPassiveCurrentLoans, watchPassiveCurrentRemunerations,
        watchPassiveCurrentFiscalCharges, watchPassiveCurrentOtherDebts]);*/

    /*useEffect(() => {
        const total = 
            parseFloat(watchPassiveNotCurrentLoans || '0') +
            parseFloat(watchPassiveNotCurrentFiscalCharges || '0') +
            parseFloat(watchPassiveNotCurrentOthers || '0');
        
        setValue(
            `${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveNotCurrentTotal}`,
            total
        );
    }, [watchPassiveNotCurrentLoans, watchPassiveNotCurrentFiscalCharges, watchPassiveNotCurrentOthers]);*/

    useEffect(() => {
        setValue(
            `${patrimonialCurrentNameBase}.${PatrimonialStatementFields.PassiveTotal}`,
            parseFloat(watchPassiveCurrentTotal || '0') + parseFloat(watchPassiveNotCurrentTotal || '0'),
        );
    }, [watchPassiveCurrentTotal, watchPassiveNotCurrentTotal]);

    useEffect(() => {
        setValue(
            `${patrimonialCurrentNameBase}.${PatrimonialStatementFields.NetPatrimonyTotal}`,
            parseFloat(watchActiveTotal || '0') - parseFloat(watchPassiveTotal || '0'),
        );
    }, [watchActiveTotal, watchPassiveTotal]);

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
                            {numberFormatter.toStringWithAmount(watch(`${patrimonialCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                        </Typography>
                    ) : (
                        disabled ?
                            <TypographyBase variant={'body3'}>
                                {numberFormatter.toStringWithAmount(watch(`${patrimonialCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                            </TypographyBase> 
                            :
                            <ControlledTextFieldFilled
                                control={control}
                                name={`${patrimonialCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                                fullWidth
                                currency
                                textAlign={'right'}
                                onFocus={handleFocus}
                                inputProps={{ style: { fontWeight: item[DescriptionFinancialTotalsFields.Highlighted] ? 600 : 400 } }}
                            />
                    ),
            },
        ]);

        const finalTotalData = financialTotalsColumns.map((x) => {
            const field = x.field;

            return {
                [DescriptionFinancialTotalsFields.Description]: x.label,
                [DescriptionFinancialTotalsFields.TotalCurrentYear]: watch(`${patrimonialCurrentNameBase}.${field}`) ?? 0,
                [DescriptionFinancialTotalsFields.Highlighted]: !!x.total,
                [DescriptionFinancialTotalsFields.HighlightedEditable]: !!x.totalEditable,
                [DescriptionFinancialTotalsFields.Field]: field,
            } as DescriptionFinancialTotals;
        });

        setFinancialTotals(finalTotalData);
    }, [year, watchActiveCurrentTotal, watchActiveNotCurrentTotal, watchActiveTotal, 
        watchPassiveCurrentTotal, watchPassiveNotCurrentTotal, watchPassiveTotal]);

    if (isMobileScreenSize) {
        return (
            <Stack spacing={2}>
                <Typography variant={'subtitle2'} fontWeight={500} sx={{ marginLeft: '16px !important' }}>
                    Estado de Situación Patrimonial
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
                                        {numberFormatter.toStringWithAmount(watch(`${patrimonialCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`), '$')}
                                    </Typography>
                                ) : (
                                    <ControlledTextFieldFilled
                                        control={control}
                                        name={`${patrimonialCurrentNameBase}.${item[DescriptionFinancialTotalsFields.Field]}`}
                                        disabled={item[DescriptionFinancialTotalsFields.Highlighted]}
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
                Estado de Situación Patrimonial
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
