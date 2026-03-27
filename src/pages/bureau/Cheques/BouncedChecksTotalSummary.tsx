import React, {useMemo} from "react";
import {Card, CardContent, CardHeader, Grid} from "@mui/material";
import {
    BouncedChecksSummary,
    BouncedChecksSummaryFields,
    BouncedCheckTotalFields,
    BouncedCheckTotalWithReasons,
    BouncedCheckTotalWithReasonsFields
} from "./bouncedChecksCommon";
import BouncedChecksTotal from "./BouncedChecksTotal";
import {numberFormatter} from "util/formatters/numberFormatter";
import {ITableColumn, TableList} from "components/table";
import {TypographyBase} from "components/misc/TypographyBase";
import BouncedChecksEmpty from "./BouncedChecksEmpty";

interface BouncedChecksTotalSummaryProps {
    title: string,
    subtitle: string,
    summary?: BouncedChecksSummary,
    loading: boolean,
    error: boolean,
    lastDate?: Date,
}

function BouncedChecksTotalSummary({ title, subtitle, summary, loading, error, lastDate }: BouncedChecksTotalSummaryProps) {
    
    const showEmptyState = useMemo(() => {
        if (loading || !summary) return false;
        
        return summary?.[BouncedChecksSummaryFields.BouncedChecks][BouncedCheckTotalFields.Quantity] === 0
    }, [loading, summary])
    
    const dataTable: BouncedCheckTotalWithReasons[] | undefined = useMemo(() => {
        if (!summary) return undefined;
        
        return [
            {
                [BouncedCheckTotalWithReasonsFields.CausalReason]: 'Rechazos sin fondos',
                [BouncedCheckTotalFields.Quantity]: summary[BouncedChecksSummaryFields.ChecksWithoutFunds][BouncedCheckTotalFields.Quantity],
                [BouncedCheckTotalFields.Amount]: summary[BouncedChecksSummaryFields.ChecksWithoutFunds][BouncedCheckTotalFields.Amount],
            },
            {
                [BouncedCheckTotalWithReasonsFields.CausalReason]: 'Rechazos por defectos formales',
                [BouncedCheckTotalFields.Quantity]: summary[BouncedChecksSummaryFields.ChecksFormalDefects][BouncedCheckTotalFields.Quantity],
                [BouncedCheckTotalFields.Amount]: summary[BouncedChecksSummaryFields.ChecksFormalDefects][BouncedCheckTotalFields.Amount],
            },
            {
                [BouncedCheckTotalWithReasonsFields.CausalReason]: 'Rechazos a la registración',
                [BouncedCheckTotalFields.Quantity]: summary[BouncedChecksSummaryFields.ChecksOtherReasons][BouncedCheckTotalFields.Quantity],
                [BouncedCheckTotalFields.Amount]: summary[BouncedChecksSummaryFields.ChecksOtherReasons][BouncedCheckTotalFields.Amount],
            }
        ];
    }, [summary])

    const columns: ITableColumn[] = [
        {
            label: 'Causal',
            value: BouncedCheckTotalWithReasonsFields.CausalReason,
            textAlignHeader: 'left',
            textAlign: 'left'
        },
        {
            label: 'Cantidad',
            value: BouncedCheckTotalFields.Quantity,
            textAlignHeader: 'right',
            textAlign: 'right',
            onRenderCell: (e: any) => (
                <TypographyBase color={!!e[BouncedCheckTotalFields.Quantity] ? '#5B6560' : '#C2C2C2' }>
                    {numberFormatter.toNumberWithoutDecimal(e[BouncedCheckTotalFields.Quantity])}
                </TypographyBase>
            )
        },
        {
            label: 'Monto',
            value: BouncedCheckTotalFields.Amount,
            textAlignHeader: 'right',
            textAlign: 'right',
            onRenderCell: (e: any) => (
                <TypographyBase color={!!e[BouncedCheckTotalFields.Amount] ? '#5B6560' : '#C2C2C2' }>
                    {numberFormatter.toStringWithAmount(e[BouncedCheckTotalFields.Amount], "$")}
                </TypographyBase>
            )
        }
    ];
    
    return (
        <Card>
            <CardHeader title={title}
                        subheader={subtitle}
            />

            <CardContent>

                {
                    showEmptyState ?
                        <Grid container spacing={2} justifyContent={'center'}>
                            <Grid item xs={10} sm={8} md={7}>
                                <BouncedChecksEmpty variant={'section'}
                                                    lastDate={lastDate}
                                                    textDisclaimer={title}
                                />
                            </Grid>
                        </Grid>
                        :
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                {
                                    !!summary && (
                                        <BouncedChecksTotal title={`${summary[BouncedChecksSummaryFields.BouncedChecks][BouncedCheckTotalFields.Quantity]} cheques rechazados`}
                                                            value={numberFormatter.toStringWithAmount(summary[BouncedChecksSummaryFields.BouncedChecks][BouncedCheckTotalFields.Amount], "$")}
                                                            description={'Monto total en cheques rechazados'}
                                                            color={'warning.main'}
                                        />
                                    )
                                }
        
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {
                                    !!summary &&
                                    <BouncedChecksTotal title={`${summary[BouncedChecksSummaryFields.PaidChecks][BouncedCheckTotalFields.Quantity]} de ${summary[BouncedChecksSummaryFields.BouncedChecks][BouncedCheckTotalFields.Quantity]} cheques abonados`}
                                                        value={numberFormatter.toStringWithAmount(summary[BouncedChecksSummaryFields.PaidChecks][BouncedCheckTotalFields.Amount], "$")}
                                                        description={'Monto total en cheques abonados'}
                                                        color={'success.main'}
                                    />
                                }
                            </Grid>
        
                            <Grid item xs={12}>
                                <TableList variant={'bureauStyle'}
                                           entityList={dataTable}
                                           totalsRowMapList={[
                                               {
                                                   columnIndex: 1,
                                                   entityField: BouncedCheckTotalFields.Quantity,
                                                   sxOverride: { color: 'text.main' }
                                               },
                                               {
                                                   columnIndex: 2,
                                                   entityField: BouncedCheckTotalFields.Amount,
                                                   sxOverride: { color: 'text.main' }
                                               },
                                           ]}
                                           columns={columns}
                                           isLoading={!dataTable || loading}
                                           error={error}
                                />
                            </Grid>
                        </Grid>
                }
            </CardContent>
        </Card>
    )
}

export default BouncedChecksTotalSummary;