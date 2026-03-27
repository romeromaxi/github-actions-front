import {
    CompanyDeclarationOfAssetsFields,
    CompanyDeclarationOfAssetsTotals,
    CompanyDeclarationOfAssetsTotalsFields,
    CompanyLastYearDeclarationOfAssetsFields
} from "../../../../types/company/companyFinanceInformationData";
import {numberFormatter} from "../../../../util/formatters/numberFormatter";
import {Box, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import {ITableColumn, TableColumnType, TableList} from "../../../../components/table";
import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {ControlledTextFieldFilled} from "../../../../components/forms";
import {DescriptionFinancialTotals, DescriptionFinancialTotalsFields} from "../../../../types/general/generalFinanceData";


interface CompanyFinancialDeclarationOfAssetsTotalsProps {
    totals: CompanyDeclarationOfAssetsTotals[];
    nameBase: string
}

declare type PhysicalCompanyFinancialTotalsNumericalFields =
    CompanyDeclarationOfAssetsTotalsFields.CurrentActiveTotal | CompanyDeclarationOfAssetsTotalsFields.NonCurrentActiveTotal |
    CompanyDeclarationOfAssetsTotalsFields.ActiveTotal | CompanyDeclarationOfAssetsTotalsFields.CurrentPassiveTotal |
    CompanyDeclarationOfAssetsTotalsFields.NonCurrentPassiveTotal | CompanyDeclarationOfAssetsTotalsFields.PassiveTotal |
    CompanyDeclarationOfAssetsTotalsFields.NetPatrimonyTotal;

interface PhysicalCompanyFinancialTotalsNumericalColumns {
    label: string;
    value: PhysicalCompanyFinancialTotalsNumericalFields;
    total?: boolean;
}


const declarationOfAssetsCols: PhysicalCompanyFinancialTotalsNumericalColumns[] = [
    {
        label: 'Activo Corriente',
        value: CompanyDeclarationOfAssetsTotalsFields.CurrentActiveTotal,
    },
    {
        label: 'Activo No Corriente',
        value: CompanyDeclarationOfAssetsTotalsFields.NonCurrentActiveTotal,
    },
    {
        label: 'Total Activo',
        value: CompanyDeclarationOfAssetsTotalsFields.ActiveTotal,
        total: true
    },
    {
        label: 'Pasivo Corriente',
        value: CompanyDeclarationOfAssetsTotalsFields.CurrentPassiveTotal
    },
    {
        label: 'Pasivo No Corriente',
        value: CompanyDeclarationOfAssetsTotalsFields.NonCurrentPassiveTotal
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
]
const checkingHighlighted = (entity: DescriptionFinancialTotals) =>
    entity[DescriptionFinancialTotalsFields.Highlighted];
const CompanyFinancialDeclarationOfAssetsTotals = ({
                                                  totals,
                                              }: CompanyFinancialDeclarationOfAssetsTotalsProps) => {
    const [columns, setColumns] = useState<ITableColumn[]>([])
    const [formattedTotals, setFormattedTotals] = useState<DescriptionFinancialTotals[]>()



    useEffect(() => {
        if (totals) {
            setFormattedTotals(undefined);
            setColumns([]);

            setColumns([
                {
                    label: '',
                    value: DescriptionFinancialTotalsFields.Description,
                    textAlign: 'left',
                    onCheckingHighlighted: checkingHighlighted
                },
                {
                    label: 'Valor mercado',
                    value: DescriptionFinancialTotalsFields.TotalCurrentYear,
                    type: TableColumnType.Currency,
                    currency: "$",
                    textAlign: 'right',
                    textAlignHeader: 'right',
                    onCheckingHighlighted: checkingHighlighted
                },
                {
                    label: 'Valor fiscal',
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

            const finalTotalData = declarationOfAssetsCols.map(x => {
                const field = x.value;

                return {
                    [DescriptionFinancialTotalsFields.Description]: x.label,
                    [DescriptionFinancialTotalsFields.TotalCurrentYear]: totals[0][field] ?? 0,
                    [DescriptionFinancialTotalsFields.TotalPreviousYear]: totals[1][field] ?? 0,
                    [DescriptionFinancialTotalsFields.Variation]: getVariation(field),
                    [DescriptionFinancialTotalsFields.Highlighted]: !!x.total
                } as DescriptionFinancialTotals
            })

            setFormattedTotals(finalTotalData);
        }
    }, [totals]);

    const getVariation = (
        field: PhysicalCompanyFinancialTotalsNumericalFields,
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
        <Stack spacing={2}>
            <Typography variant={'subtitle2'} fontWeight={500} sx={{marginLeft: '16px !important'}}>
                Estado de Situación Patrimonial
            </Typography>
            <TableList entityList={formattedTotals}
                       columns={columns}
                       isLoading={!totals || !formattedTotals}
                       error={false}
            />
        </Stack>
    );
};



export const CompanyFinancialDeclarationOfAssetsEditTotals = ({ nameBase, totals }: CompanyFinancialDeclarationOfAssetsTotalsProps) => {
    const { control, setValue, watch } = useFormContext();
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));
  
    const [columns, setColumns] = useState<ITableColumn[]>([]);
    const [formattedTotals, setFormattedTotals] = useState<DescriptionFinancialTotals[]>();
  
    const handleFocus = (e: any) => e.target.select();
  
    const watchActiveCurrentTotal = watch(`${nameBase}.${CompanyDeclarationOfAssetsFields.CurrentActiveTotal}`, 0);
    const watchActiveNotCurrentTotal = watch(`${nameBase}.${CompanyDeclarationOfAssetsFields.NonCurrentActiveTotal}`, 0);
    const watchPassiveCurrentTotal = watch(`${nameBase}.${CompanyDeclarationOfAssetsFields.CurrentPassiveTotal}`, 0);
    const watchPassiveNotCurrentTotal = watch(`${nameBase}.${CompanyDeclarationOfAssetsFields.NonCurrentPassiveTotal}`, 0);
    const watchLastActiveCurrentTotal = watch(`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.CurrentActiveTotal}`, 0);
    const watchLastActiveNotCurrentTotal = watch(`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.NonCurrentActiveTotal}`, 0);
    const watchLastPassiveCurrentTotal = watch(`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.CurrentPassiveTotal}`, 0);
    const watchLastPassiveNotCurrentTotal = watch(`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.NonCurrentPassiveTotal}`, 0);
    const watchPassiveTotal = watch(`${nameBase}.${CompanyDeclarationOfAssetsFields.PassiveTotal}`, 0);
    const watchActiveTotal = watch(`${nameBase}.${CompanyDeclarationOfAssetsFields.ActiveTotal}`, 0);
    const watchLastPassiveTotal = watch(`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.PassiveTotal}`, 0);
    const watchLastActiveTotal = watch(`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.ActiveTotal}`, 0);
  
    useEffect(() => {
      setValue(
        `${nameBase}.${CompanyDeclarationOfAssetsFields.ActiveTotal}`,
        parseFloat(watchActiveCurrentTotal || '0') + parseFloat(watchActiveNotCurrentTotal || '0'),
      );
    }, [watchActiveCurrentTotal, watchActiveNotCurrentTotal]);
  
    useEffect(() => {
      setValue(
        `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.ActiveTotal}`,
        parseFloat(watchLastActiveCurrentTotal || '0') + parseFloat(watchLastActiveNotCurrentTotal || '0'),
      );
    }, [watchLastActiveCurrentTotal, watchLastActiveNotCurrentTotal]);
  
    useEffect(() => {
      setValue(
        `${nameBase}.${CompanyDeclarationOfAssetsFields.PassiveTotal}`,
        parseFloat(watchPassiveCurrentTotal || '0') + parseFloat(watchPassiveNotCurrentTotal || '0'),
      );
    }, [watchPassiveCurrentTotal, watchPassiveNotCurrentTotal]);
  
    useEffect(() => {
      setValue(
        `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.PassiveTotal}`,
        parseFloat(watchLastPassiveCurrentTotal || '0') + parseFloat(watchLastPassiveNotCurrentTotal || '0'),
      );
    }, [watchLastPassiveCurrentTotal, watchLastPassiveNotCurrentTotal]);
  
    useEffect(() => {
      setValue(
        `${nameBase}.${CompanyDeclarationOfAssetsFields.NetPatrimonyTotal}`,
        parseFloat(watchActiveTotal || '0') - parseFloat(watchPassiveTotal || '0'),
      );
    }, [watchPassiveTotal, watchActiveTotal]);
  
    useEffect(() => {
      setValue(
        `${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${CompanyDeclarationOfAssetsFields.NetPatrimonyTotal}`,
        parseFloat(watchLastActiveTotal || '0') - parseFloat(watchLastPassiveTotal || '0'),
      );
    }, [watchLastActiveTotal, watchLastPassiveTotal]);
  
    const getVariation = (field: PhysicalCompanyFinancialTotalsNumericalFields): string => {
      //@ts-ignore
      let currentYear: number | undefined = totals[0][field];
      //@ts-ignore
      let lastYear: number | undefined = totals[1][field];
  
      if (!currentYear || !lastYear) return '-';
  
      return numberFormatter.toStringWithPercentage(((currentYear - lastYear) / lastYear) * 100);
    };

    const checkingHighlighted = (entity: DescriptionFinancialTotals) =>
        entity[DescriptionFinancialTotalsFields.Highlighted];
  
    useEffect(() => {
      if (totals) {
        setFormattedTotals(undefined);
        setColumns([]);
  
        setColumns([
          {
            label: '',
            value: DescriptionFinancialTotalsFields.Description,
            textAlign: 'left', 
            onCheckingHighlighted: checkingHighlighted
          },
          {
            label: 'Valor mercado',
            value: DescriptionFinancialTotalsFields.TotalCurrentYear,
            textAlign: 'right',
            textAlignHeader: 'right',
            onCheckingHighlighted: checkingHighlighted,
            onRenderCell: (item: DescriptionFinancialTotals) =>
              item[DescriptionFinancialTotalsFields.Highlighted] ? (
                  <Typography variant={'body2'} sx={{fontSize: '.9rem !important'}}>
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
                />
              ),
          },
          {
            label: 'Valor fiscal',
            value: DescriptionFinancialTotalsFields.TotalPreviousYear,
            textAlign: 'right',
            textAlignHeader: 'right',
            onCheckingHighlighted: checkingHighlighted,
            onRenderCell: (item: DescriptionFinancialTotals) =>
              item[DescriptionFinancialTotalsFields.Highlighted] ? (
                  <Typography variant={'body2'} sx={{fontSize: '.9rem !important'}}>
                      {numberFormatter.toStringWithAmount(
                        watch(`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${item[DescriptionFinancialTotalsFields.Field]}`),
                        '$',
                      )}
                  </Typography>
              ) : (
                <ControlledTextFieldFilled
                  control={control}
                  name={`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${item[DescriptionFinancialTotalsFields.Field]}`}
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
            onCheckingHighlighted: checkingHighlighted
          },
        ]);
  
        const finalTotalData = declarationOfAssetsCols.map((x) => {
          const field = x.value;
  
          return {
            [DescriptionFinancialTotalsFields.Description]: x.label,
            [DescriptionFinancialTotalsFields.TotalCurrentYear]: totals[0][field] ?? 0,
            [DescriptionFinancialTotalsFields.TotalPreviousYear]: totals[1][field] ?? 0,
            [DescriptionFinancialTotalsFields.Variation]: getVariation(field),
            [DescriptionFinancialTotalsFields.Highlighted]: !!x.total,
            [DescriptionFinancialTotalsFields.Field]: field,
          } as DescriptionFinancialTotals;
        });
  
        setFormattedTotals(finalTotalData);
      }
    }, [totals]);
  
    if (isMobileScreenSize) {
      return (
        <Stack spacing={2}>
          <Typography variant={'subtitle2'} fontWeight={500} sx={{ marginLeft: '16px !important', marginTop: '16px !important' }}>
            Estado de Situación Patrimonial
          </Typography>
          {formattedTotals?.map((item) => (
            <Box key={item[DescriptionFinancialTotalsFields.Description]} sx={{ mb: 3, borderBottom: '1px solid #EDF2F7', pb: 2 }}>
              <Box
                sx={{
                  backgroundColor: '#F7FAFC',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight={500}>
                  {item[DescriptionFinancialTotalsFields.Description]}
                </Typography>
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, width: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
                <Typography variant="subtitle1">
                  Valor mercado
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {item[DescriptionFinancialTotalsFields.Highlighted] ? (
                    <Typography variant="subtitle1" sx={{ mr: '14px'}}>
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
                      sx={{ maxWidth: '120px' }}
                    />
                  )}
                </Box>
              </Stack>
  
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
                <Typography variant="subtitle1">
                  Valor fiscal
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {item[DescriptionFinancialTotalsFields.Highlighted] ? (
                    <Typography variant="subtitle1" sx={{ mr: '14px'}}>
                      {numberFormatter.toStringWithAmount(
                        watch(`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${item[DescriptionFinancialTotalsFields.Field]}`),
                        '$',
                      )}
                    </Typography>
                  ) : (
                    <ControlledTextFieldFilled
                      control={control}
                      name={`${nameBase}.${CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets}.${item[DescriptionFinancialTotalsFields.Field]}`}
                      disabled={item[DescriptionFinancialTotalsFields.Highlighted]}
                      fullWidth
                      currency
                      textAlign={'right'}
                      onFocus={handleFocus}
                      sx={{ maxWidth: '120px' }}
                    />
                  )}
                </Box>
              </Stack>
  
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', paddingLeft: '16px', paddingRight: '16px', mt: 1}}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Variación
                </Typography>
                <Typography variant="caption" sx={{ textAlign: 'right', color: "text.secondary", mr: '14px' }}>
                  {item[DescriptionFinancialTotalsFields.Variation]}
                </Typography>
              </Stack>
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
        <TableList entityList={formattedTotals} columns={columns} isLoading={!totals || !formattedTotals} error={false} />
      </Stack>
    );
  };

export default CompanyFinancialDeclarationOfAssetsTotals;