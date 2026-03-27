import React, {useEffect, useRef, useState} from "react";
import {ITableColumn, TableList} from "components/table";
import {CurrentDebtLastTwelveMonths, CurrentDebtLastTwelveMonthsFields} from "types/nosis/nosisData";
import {dateFormatter} from "util/formatters/dateFormatter";
import {Card, CardContent, CardHeader, Stack, Tooltip, Typography} from "@mui/material";
import {numberFormatter} from "util/formatters/numberFormatter";
import {TypographyBase} from "components/misc/TypographyBase";
import {WrapperIcons} from "components/icons/Icons";
import {InfoIcon} from "lucide-react";


interface EntityEvolutionDebtTableProps {
    title: string,
    subtitle: React.ReactNode,
    latestDebts?: CurrentDebtLastTwelveMonths[],
    loading: boolean,
    error: boolean
}


const EntityEvolutionDebtTable = ({ title, subtitle, latestDebts, loading, error }: EntityEvolutionDebtTableProps) => {
    const tableRef = useRef<HTMLDivElement | null>(null);
    const [columns, setColumns] = useState<ITableColumn[]>([]);
    const [groupedData, setGroupedData] = useState<Record<string, CurrentDebtLastTwelveMonths[]>>({});
    const [headerGroups, setheaderGroups] = useState<Record<string, number>>({})

    const groupByEntity = (data: CurrentDebtLastTwelveMonths[]) => {
        return data.reduce((acc, debt) => {
            const entity = debt[CurrentDebtLastTwelveMonthsFields.Entity];
            if (!acc[entity]) {
                acc[entity] = [];
            }
            acc[entity].push(debt);
            return acc;
        }, {} as Record<string, CurrentDebtLastTwelveMonths[]>);
    };

    const renderAdditionalCols = (): ITableColumn[] => {
        if (!latestDebts || latestDebts.length === 0) return [];

        const allPeriods = Array.from(new Set(latestDebts.map(d => d[CurrentDebtLastTwelveMonthsFields.Period])))
            .sort();

        const periodsByYear: Record<string, string[]> = {};
        allPeriods.forEach(period => {
            const year = period.substring(0, 4);
            if (!periodsByYear[year]) {
                periodsByYear[year] = [];
            }
            periodsByYear[year].push(period);
        });

        const columns: ITableColumn[] = [];
        const headerGroups: Record<string, number> = {};

        Object.keys(periodsByYear).sort().forEach(year => {
            const periods = periodsByYear[year];
            headerGroups[year] = periods.length;

            periods.forEach((period, index) => {
                columns.push({
                    label: `${dateFormatter.toMonthInitialsName(period)}`,
                    minPadding: true,
                    textAlign: 'center',
                    textAlignHeader: 'center',
                    headerGroup: index === 0 ? year : undefined,
                    onRenderCell: (debtDetails: CurrentDebtLastTwelveMonths[]) => {
                        const periodData = debtDetails.find(d => d[CurrentDebtLastTwelveMonthsFields.Period] === period);
                        return (
                            periodData && periodData[CurrentDebtLastTwelveMonthsFields.Amount] ?
                                <Tooltip title={numberFormatter.toStringWithAmount(periodData[CurrentDebtLastTwelveMonthsFields.Amount], '$')}>
                                    <Typography sx={{fontSize: '11px !important'}}>
                                        {periodData[CurrentDebtLastTwelveMonthsFields.Amount] / 1_000 < 1000 ? numberFormatter.toStringWithAmount(periodData[CurrentDebtLastTwelveMonthsFields.Amount] / 1_000, '', 1) : numberFormatter.toStringWithAmount(periodData[CurrentDebtLastTwelveMonthsFields.Amount] / 1_000, '', 0)}
                                    </Typography>
                                </Tooltip>
                                :
                                <TypographyBase color={'text.tertiary'}>-</TypographyBase>
                        );
                    }
                });
            });
        });

        setheaderGroups(headerGroups);
        return columns;
    };


    useEffect(() => {
        if (latestDebts) {
            if (latestDebts.length === 0) {
                setColumns([]);
                setGroupedData({});
                setheaderGroups({});
                return
            }
            
            const grouped = groupByEntity(latestDebts);
            setGroupedData(grouped);

            const additionalCols = renderAdditionalCols();
            
            setColumns([
                {
                    label: 'Entidad',
                    minPadding: true, textAlign: 'left', sticky: true,
                    onRenderCell: (debtDetails: CurrentDebtLastTwelveMonths[]) => (
                        <TypographyBase minWidth={{ xs: '100px', md: '220px' }}
                                        tooltip 
                                        maxLines={1}
                                        color={'text.lighter'}
                        >
                            {
                                debtDetails[0][CurrentDebtLastTwelveMonthsFields.Entity] ?
                                    `${debtDetails[0][CurrentDebtLastTwelveMonthsFields.Entity].toUpperCase()}`
                                    :
                                    '-'
                            }
                        </TypographyBase>
            )
                },
                ...additionalCols
            ]);
        }
    }, [latestDebts]);

    useEffect(() => {
        if (tableRef.current && !!groupedData && !!columns)
            tableRef.current.scrollLeft = tableRef.current.scrollWidth;
    }, [tableRef, columns, groupedData]);

    return (
        <Card>
            <CardHeader title={title}
                        subheader={subtitle}
            />
            
            <CardContent>
                <Stack spacing={3}>
                    <TableList<CurrentDebtLastTwelveMonths[]> entityList={Object.values(groupedData)} 
                                                              columns={columns} 
                                                              isLoading={loading} 
                                                              error={error} 
                                                              headerGroups={headerGroups} 
                                                              tableContainerRef={tableRef} 
                                                              sortGroups
                                                              variant={'bureauGroupsStyle'}
                    />
                    
                    <Stack direction={'row'} spacing={1}>
                        <TypographyBase variant={'body3'} color={'text.lighter'}
                        >
                            <WrapperIcons Icon={InfoIcon} size={'sm'} />
                        </TypographyBase>
                        <TypographyBase variant={'body3'} color={'text.lighter'}
                        >
                            Los valores de la tabla están <strong>expresados en miles de pesos</strong>
                        </TypographyBase>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};




export default EntityEvolutionDebtTable