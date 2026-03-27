import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, Stack, Typography} from "@mui/material";

import {ITableColumn, TableList} from 'components/table';
import {numberFormatter} from 'util/formatters/numberFormatter';
import CardItemsNotFound from "components/cards/CardItemsNotFound";
import {TypographyBase} from "components/misc/TypographyBase";
import {DataWithLabel} from "../../../../components/misc/DataWithLabel";
import {BalancesSourceType} from "../../../../hooks/contexts/BalancesContext";
import {HttpCompanyFinance} from "../../../../http";
import {
  DescriptionFinancialTotals,
  DescriptionFinancialTotalsFields,
  FinancialIndicators,
  FinancialIndicatorsFields
} from "../../../../types/general/generalFinanceData";
import {HttpSolicitationFinance} from "../../../../http/solicitations/httpSolicitationFinance";
import {HttpClientPortfolioBalances} from "../../../../http/clientPortfolio/httpClientPortfolio";
import {ButtonExportDropdown} from "../../../../components/buttons/ButtonExportDropdown";
import {downloadFileBlobHelper} from "../../../../util/helpers";
import {HttpFinancialIndicatorsExports} from "../../../../http/financialEntity/httpFinancialIndicatorsExports";

interface FinancialIndicatorsTableProps {
  dataId: number | string;
  dataSource: BalancesSourceType;
  error: boolean;
}

declare type FinancialTotalsNumericalFields =
    FinancialIndicatorsFields.WorkingCapital | FinancialIndicatorsFields.Indebtedness |
    FinancialIndicatorsFields.ProfitabilitySales | FinancialIndicatorsFields.CurrentLiquidity |
    FinancialIndicatorsFields.AverageMonthlySales | FinancialIndicatorsFields.Solvency |
    FinancialIndicatorsFields.DeferredIndebtedness | FinancialIndicatorsFields.ReturnOnTotalAssets |
    FinancialIndicatorsFields.NetProfitOverEquity | FinancialIndicatorsFields.SalesPostBalance | FinancialIndicatorsFields.PurchasesPostBalance

interface FinancialIndicatorTableFields {
  label: string;
  subtitle: string;
  field: FinancialTotalsNumericalFields;
  currency?: string;
}

const financialTotalsColumns: FinancialIndicatorTableFields[] = [
  {
    label: 'Rentabilidad',
    field: FinancialIndicatorsFields.ProfitabilitySales,
    subtitle: 'Participación del resultado final sobre ventas totales'
  },
  {
    label: 'Liquidez corriente',
    field: FinancialIndicatorsFields.CurrentLiquidity,
    subtitle: 'En qué medida superan los activos liquidables a corto plazo a los compromisos exigibles en mismo periodo (corriente: T < 1) Detecta posible problema de liquidez para afrontar compromisos en el corto plazo'
  },
  {
    label: 'Endeudamiento',
    field: FinancialIndicatorsFields.Indebtedness,
    subtitle: 'Comparación entre deudas con terceros (pasivo total) y finaciación con recursos propios (patrimonio neto)'
  },
  {
    label: 'Capital de trabajo',
    field: FinancialIndicatorsFields.WorkingCapital,
    currency: '$',
    subtitle: 'Valor monetario de la diferencia entre los activos más líquidos (activo corriente) y deudas con vencimiento más próximo (pasivo corriente)'
  },
  {
    label: 'Ventas mensuales promedio',
    field: FinancialIndicatorsFields.AverageMonthlySales,
    currency: '$',
    subtitle: 'Este resultado indica cuál es el valor promedio de ventas mensuales. A su vez, siempre debe considerarse cada empresa según su sector y posibles variaciones estacionales'
  },
  {
    label: 'Solvencia',
    field: FinancialIndicatorsFields.Solvency,
    subtitle: 'Indica en qué proporción el activo excede al pasivo, por lo tanto y en forma indirecta, nos orienta sobre la participación del patrimonio neto en el financiamiento del activo total'
  },
  {
    label: 'Endeudamiento diferido',
    field: FinancialIndicatorsFields.DeferredIndebtedness,
    subtitle: 'Cuanto más bajo sea indicará una menor posición relativa de deuda a largo plazo de la empresa'
  },
  {
    label: 'Retorno sobre activo total',
    field: FinancialIndicatorsFields.ReturnOnTotalAssets,
    subtitle: 'Ofrece una medida de la capacidad de la empresa para traducir la inversión en activos en ingreso neto. Cuanto mayor sea el resultado, mejor rendimiento de sus activos (también deberá consirarse el nivel de endeudamiento de la firma, ya que los activos pueden adquirirse con fondos propios o financiación de terceros)'
  },
  {
    label: 'Utilidad neta sobre patrimonio neto',
    field: FinancialIndicatorsFields.NetProfitOverEquity,
    currency: '%',
    subtitle: 'Este índice mide el retorno del capital invertido por los accionistas (sin considerar pagos de dividendos). Su resultado refleja el porcentaje que se ha ganado respecto del capital propio de la empresa. Cuanto mayor sea el porcentaje de retorno, la inversión operada por la empresa será más atractiva'
  },
  {
    label: 'Ventas post balance',
    field: FinancialIndicatorsFields.SalesPostBalance,
    currency: '$',
    subtitle: 'Muestra el monto neto gravado de ventas desde el último cierre de ejercicio contable hasta la actualidad'
  },
  {
    label: 'Compras post balance',
    field: FinancialIndicatorsFields.PurchasesPostBalance,
    currency: '$',
    subtitle: 'Muestra el monto neto gravado de compras desde el último cierre de ejercicio hasta la actualidad'
  }
]

function FinancialIndicatorsTable(
  props: FinancialIndicatorsTableProps,
) {
  const [loading, setLoading] = useState<boolean>(true);
  const [firstIndicators, setFirstIndicators] = useState<FinancialIndicators>();
  const [secondIndicators, setSecondIndicators] = useState<FinancialIndicators>();
  const [indicatorsData, setIndicatorsData] = useState<DescriptionFinancialTotals[]>()
  const [cols, setCols] = useState<ITableColumn[]>([])
  
  const getPromiseType = () => {
    if (!props.dataId) return Promise.resolve<FinancialIndicators[]>([]);
    
    switch (props.dataSource) {
      case BalancesSourceType.Company:
        return HttpCompanyFinance.getIndicatorsByCompanyId(props.dataId)
      case BalancesSourceType.Solicitation:
        return HttpSolicitationFinance.getIndicatorsBySolicitationId(props.dataId)
      case BalancesSourceType.ClientPortfolio:
        return HttpClientPortfolioBalances.getIndicators(props.dataId)
    }
  }
  
  useEffect(() => {
      setLoading(true)
      setFirstIndicators(undefined);
      setSecondIndicators(undefined);
      const promise = getPromiseType()
              
      promise.then((indicators) => {
              setFirstIndicators(indicators[0] || undefined);
              setSecondIndicators(indicators[1] || undefined);
          })
          .finally(() => setLoading(false))
  }, [props.dataId]);
  

  useEffect(() => {
    if (firstIndicators) {
      setIndicatorsData(undefined);
      
      setCols([
        {
          label: 'Ratio',
          value: DescriptionFinancialTotalsFields.Description,
          textAlign: 'left',
          width: '60%',
          onRenderCell: (item) => (
              <Stack overflow={'hidden'}>
                <Typography>{item[DescriptionFinancialTotalsFields.Description]}</Typography>
                {
                  !!item[DescriptionFinancialTotalsFields.LabelDescription] &&
                    <TypographyBase variant={'caption'} fontSize={10} fontWeight={400} color={'text.lighter'} maxLines={3} tooltip>
                      {item[DescriptionFinancialTotalsFields.LabelDescription]}
                    </TypographyBase>
                }
              </Stack>
          )
        },
        {
          label: `${firstIndicators[FinancialIndicatorsFields.Year]}`,
          value: DescriptionFinancialTotalsFields.TotalCurrentYear,
          textAlign: 'right',
          textAlignHeader: 'right'
        },
        /*{
          label: 'Variación',
          value: DescriptionFinancialTotalsFields.Variation,
          textAlign: 'right',
          textAlignHeader: 'center'
        },*/
      ])

      const finalTotalData = financialTotalsColumns.map(x => {
        const field = x.field;

        return {
          [DescriptionFinancialTotalsFields.Description]: x.label,
          [DescriptionFinancialTotalsFields.LabelDescription]: x.subtitle,
          [DescriptionFinancialTotalsFields.TotalCurrentYear]: !!x.currency ? numberFormatter.toStringWithAmount(firstIndicators[field], x.currency) : numberFormatter.toStringWithDecimals(firstIndicators[field] ?? null),
          [DescriptionFinancialTotalsFields.TotalPreviousYear]: '-',
          [DescriptionFinancialTotalsFields.Variation]: getVariation(field, x.currency)
        } as DescriptionFinancialTotals
      })

      setIndicatorsData(finalTotalData);
    }
  }, [firstIndicators, secondIndicators]);
  
  const getVariation = (field: FinancialIndicatorsFields, cur?: string): string => {
    if (!firstIndicators || !secondIndicators) return '-';
      
    //@ts-ignore
    let currentYear: number | undefined = firstIndicators[field];
    //@ts-ignore
    let lastYear: number | undefined = secondIndicators[field];

    if (!currentYear || !lastYear) return '-';
    
    if (cur === '%') return numberFormatter.toStringWithPercentage(currentYear - lastYear)

    return numberFormatter.toStringWithPercentage(
      ((currentYear - lastYear) / lastYear) * 100,
    );
  };
  
  const onExportIndicatorsExcel = () => {
    switch (props.dataSource) {
      case BalancesSourceType.Company:
        return HttpFinancialIndicatorsExports.exportCompanyIndicatorsToExcel(props.dataId).then(downloadFileBlobHelper)
      case BalancesSourceType.Solicitation:
        return HttpFinancialIndicatorsExports.exportSolicitationIndicatorsToExcel(props.dataId).then(downloadFileBlobHelper)
      case BalancesSourceType.ClientPortfolio:
          return HttpFinancialIndicatorsExports.exportClientPortfolioIndicatorsToExcel(props.dataId).then(downloadFileBlobHelper)
    }
    
  }

  return (
      <React.Fragment>
        {
          (!loading && (!indicatorsData || !indicatorsData.length)) ?
            <CardItemsNotFound title={`No hay indicadores para esta ${props.dataSource === BalancesSourceType.Company ? 'empresa' :
                props.dataSource === BalancesSourceType.Solicitation ? 'solicitud' : 'carpeta'}`}
                               description={<Stack>
                                 <Typography textAlign={'center'} color={'text.lighter'} variant={'subtitle1'}> Para poder ver los indicadores financieros es necesario cargar los datos de ejercicios contables en el menú de Información Económica Financiera</Typography>
                                 <Typography textAlign={'center'} color={'text.lighter'} variant={'subtitle1'}>Ver cómo te ven resulta útil para aprovechar o mejorar tu perfil</Typography>
                               </Stack>}
            />
            :
              <Card>
                <CardHeader title={'Indicadores financieros'}
                            action={indicatorsData && indicatorsData.length && <ButtonExportDropdown onExportExcel={onExportIndicatorsExcel} size='small' />}
                          subheader={
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={1}>
                            <DataWithLabel
                                rowDirection
                                label={'Fuente'}
                                data={<Typography variant={'caption'} fontWeight={500}>
                                  {props.dataSource === BalancesSourceType.Company ? 'Último estado contable en Perfil de la empresa' :
                                      props.dataSource === BalancesSourceType.Solicitation ? 'Último estado contable en esta solicitud' : 'Último estado contable en esta carpeta'}
                                </Typography>}
                            />
                            {/*<DataWithLabel
                                rowDirection
                                label={'Fuente de Explicación de indicadores'}
                                data={<Typography variant={'caption'} fontWeight={500}>{PublicEntityEnums.LUFE}</Typography>}
                            />*/}
                          </Stack>}
                />
                <CardContent>
                  <TableList title={''}
                             entityList={indicatorsData}
                             columns={cols}
                             isLoading={!indicatorsData || loading}
                             error={props.error}
                  />
                </CardContent>
              </Card>
        }
      </React.Fragment>
  );
}

export default FinancialIndicatorsTable;
