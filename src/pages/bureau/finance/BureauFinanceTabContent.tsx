import React from "react";
import {Card, CardContent, Divider, Grid, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import BureauFinanceIndicatorsComponent, {
    BureauFinanceCurrencyIndicatorsComponent
} from "./BureauFinanceIndicatorsComponent";
import {FinancialIndicators, FinancialIndicatorsFields} from "types/general/generalFinanceData";
import {BalancesSourceType} from "hooks/contexts/BalancesContext";

interface BureauFinanceTabContentProps {
    indicators?: FinancialIndicators,
    dataSource: BalancesSourceType,
    loading: boolean,
}

function BureauFinanceTabContent({ indicators, dataSource, loading }: BureauFinanceTabContentProps){
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const article = dataSource === BalancesSourceType.Company ? 'tu' : 'la';
    
    return (
        <React.Fragment>

            <Grid item xs={12}>
                <Card variant={'infoBureau'}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5.8}>
                                <BureauFinanceCurrencyIndicatorsComponent title={'Capital de trabajo'}
                                                                          description={`Mide los recursos con los que cuenta ${article} PyME para operar en el día a día. Indica si la empresa puede cubrir sus gastos y compromisos de corto plazo sin necesidad de financiamiento adicional.`}
                                                                          tooltipTitle={'Se calcula como la diferencia entre el activo corriente y el pasivo corriente.'}
                                                                          value={indicators?.[FinancialIndicatorsFields.WorkingCapital]}
                                                                          currency={'$'}
                                                                          loading={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={0.1}>
                                <Divider orientation={!isMobile ? 'vertical' : 'horizontal'} />
                            </Grid>

                            <Grid item xs={12} md={5.8}>
                                <BureauFinanceCurrencyIndicatorsComponent title={'Ventas mensuales promedio'}
                                                                          description={`Representa el nivel promedio de facturación mensual de ${article} PyME. Ayuda a dimensionar el tamaño del negocio y su nivel de actividad.`}
                                                                          tooltipTitle={'Se obtiene promediando las ventas registradas en el período analizado.'}
                                                                          value={indicators?.[FinancialIndicatorsFields.AverageMonthlySales]}
                                                                          currency={'$'}
                                                                          loading={loading}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant={'infoBureau'}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <BureauFinanceIndicatorsComponent title={'Rentabilidad'}
                                                                  description={`Indica la capacidad de ${article} PyME para afrontar obligaciones de corto plazo utilizando sus activos más líquidos.`}
                                                                  tooltipTitle={'Activo corriente / Pasivo corriente.'}
                                                                  direction={'row'}
                                                                  helperText={<React.Fragment>Valores <strong>mayores a 1 indican</strong> una mejor capacidad para cumplir con compromisos inmediatos.</React.Fragment>}
                                                                  value={indicators?.[FinancialIndicatorsFields.CurrentLiquidity]}
                                                                  loading={loading}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant={'infoBureau'}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5.8}>
                                <BureauFinanceIndicatorsComponent title={'Endeudamiento'}
                                                                  description={`Refleja qué proporción de la estructura financiera de ${article} PyME está financiada con deuda frente a recursos propios.`}
                                                                  tooltipTitle={'Pasivo total / Patrimonio neto.'}
                                                                  helperText={<React.Fragment><strong>Un menor nivel de endeudamiento</strong> suele implicar menor exposición al riesgo financiero.</React.Fragment>}
                                                                  value={indicators?.[FinancialIndicatorsFields.Indebtedness]}
                                                                  loading={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={0.1}>
                                <Divider orientation={!isMobile ? 'vertical' : 'horizontal'} />
                            </Grid>

                            <Grid item xs={12} md={5.8}>
                                <BureauFinanceIndicatorsComponent title={'Endeudamiento diferido'}
                                                                  description={`Mide el peso de las deudas de largo plazo dentro de la estructura financiera de la empresa.`}
                                                                  tooltipTitle={'Pasivo no corriente / Patrimonio neto.'}
                                                                  helperText={<React.Fragment><strong>Un endeudamiento diferido más bajo</strong> indica menor carga financiera futura.</React.Fragment>}
                                                                  value={indicators?.[FinancialIndicatorsFields.DeferredIndebtedness]}
                                                                  loading={loading}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant={'infoBureau'}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <BureauFinanceIndicatorsComponent title={'Solvencia'}
                                                                  description={`Evalúa la capacidad de ${article} PyME para sostener sus obligaciones totales en el largo plazo con sus propios activos.`}
                                                                  tooltipTitle={'Activo total / Pasivo total.'}
                                                                  direction={'row'}
                                                                  value={indicators?.[FinancialIndicatorsFields.Solvency]}
                                                                  loading={loading}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant={'infoBureau'}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <BureauFinanceIndicatorsComponent title={'Rentabilidad'}
                                                                  description={`Mide qué parte de las ventas se transforma en ganancia para la empresa. Permite evaluar el desempeño económico del negocio.`}
                                                                  tooltipTitle={'Resultado neto / Ventas totales × 100.'}
                                                                  direction={'row'}
                                                                  value={indicators?.[FinancialIndicatorsFields.ProfitabilitySales]}
                                                                  loading={loading}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant={'infoBureau'}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5.8}>
                                <BureauFinanceIndicatorsComponent title={'Utilidad neta sobre patrimonio neto'}
                                                                  description={`Indica el rendimiento generado sobre el capital propio invertido en la empresa.`}
                                                                  tooltipTitle={'Utilidad neta / Patrimonio neto × 100.'}
                                                                  value={indicators?.[FinancialIndicatorsFields.ReturnOnTotalAssets]}
                                                                  loading={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={0.1}>
                                <Divider orientation={!isMobile ? 'vertical' : 'horizontal'} />
                            </Grid>

                            <Grid item xs={12} md={5.8}>
                                <BureauFinanceIndicatorsComponent title={'Retorno sobre activo total (ROA)'}
                                                                  description={`Mide la capacidad de la empresa para generar resultados a partir del total de sus activos.`}
                                                                  tooltipTitle={'Resultado neto / Activo total × 100.'}
                                                                  value={indicators?.[FinancialIndicatorsFields.DeferredIndebtedness]}
                                                                  loading={loading}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant={'infoBureau'}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5.8}>
                                <BureauFinanceCurrencyIndicatorsComponent title={'Ventas post balance'}
                                                                          description={`Refleja el nivel de ventas registradas luego del último cierre contable informado.`}
                                                                          tooltipTitle={'Suma de ventas registradas desde el último cierre contable hasta la fecha.'}
                                                                          value={indicators?.[FinancialIndicatorsFields.SalesPostBalance]}
                                                                          currency={'$'}
                                                                          loading={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={0.1}>
                                <Divider orientation={!isMobile ? 'vertical' : 'horizontal'} />
                            </Grid>

                            <Grid item xs={12} md={5.8}>
                                <BureauFinanceCurrencyIndicatorsComponent title={'Compras post balance'}
                                                                          description={`Muestra las compras realizadas por la empresa desde el último balance presentado.`}
                                                                          tooltipTitle={'Suma de compras registradas desde el último cierre contable hasta la fecha.'}
                                                                          value={indicators?.[FinancialIndicatorsFields.PurchasesPostBalance]}
                                                                          currency={'$'}
                                                                          loading={loading}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </React.Fragment>
    )
}

export default BureauFinanceTabContent;