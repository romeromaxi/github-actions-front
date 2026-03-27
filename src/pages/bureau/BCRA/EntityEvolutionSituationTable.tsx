import React, {useEffect, useRef, useState} from "react";
import {ITableColumn, TableList} from "components/table";
import {
    CurrentDebtLastTwelveMonths,
    CurrentDebtLastTwelveMonthsFields,
    SituationType,
    SituationTypeFields
} from "types/nosis/nosisData";
import {Card, CardContent, CardHeader, Grid, Stack, Tooltip, Typography} from "@mui/material";
import {dateFormatter} from "util/formatters/dateFormatter";
import {HttpCachePublicBases} from "http/index";
import {EntityWithIdFields} from "types/baseEntities";
import {TypographyBase} from "components/misc/TypographyBase";
import EntitySituationBadge from "./EntitySituationBadge";


interface EntityEvolutionSituationTableProps {
    title: string,
    subtitle: string,
    latestDebts?: CurrentDebtLastTwelveMonths[],
    loading: boolean,
    error: boolean
}


const EntityEvolutionSituationTable = ({title, subtitle, latestDebts, loading, error} : EntityEvolutionSituationTableProps) => {
    const tableRef = useRef<HTMLDivElement | null>(null);
    const [columns, setColumns] = useState<ITableColumn[]>([]);
    const [groupedData, setGroupedData] = useState<Record<string, CurrentDebtLastTwelveMonths[]>>({});
    const [situations, setSituations] = useState<SituationType[]>()
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
                    headerGroup: index === 0 ? year : undefined,
                    textAlign: 'center',
                    textAlignHeader: 'center',
                    onRenderCell: (debtDetails: CurrentDebtLastTwelveMonths[]) => {
                        const periodData = debtDetails.find(d => d[CurrentDebtLastTwelveMonthsFields.Period] === period);
                        return (
                            periodData && periodData[CurrentDebtLastTwelveMonthsFields.Situation] !== null ?
                                <Tooltip title={periodData[CurrentDebtLastTwelveMonthsFields.DebtSituationLongTypeDesc]}>
                                    <EntitySituationBadge situationCode={periodData[CurrentDebtLastTwelveMonthsFields.Situation] || 0}
                                                          size={'small'}
                                    />
                                </Tooltip>
                                :
                                <TypographyBase color={'text.tertiary'}>-</TypographyBase>
                        )
                    }
                });
            });
        });

        setheaderGroups(headerGroups);
        return columns;
    };

    useEffect(() => {
        HttpCachePublicBases.getSituationTypes().then(setSituations)
        if (latestDebts) {
            if (latestDebts.length === 0) {
                setColumns([]);
                setheaderGroups({});
                setGroupedData({});
                return
            }
            
            const grouped = groupByEntity(latestDebts);
            setGroupedData(grouped);

            const additionalCols = renderAdditionalCols();

            const headerGroups: Record<string, number> = {};

            additionalCols.forEach(col => {
                if (col.headerGroup) {
                    const year = col.headerGroup;
                    const count = additionalCols.filter(c => c.headerGroup === year).length;
                    headerGroups[year] = count;
                }
            });

            setColumns([
                {
                    label: 'Entidad',
                    minPadding: true,
                    textAlign: 'left',
                    sticky: true,
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

            setheaderGroups(headerGroups);
        }
    }, [latestDebts])


    useEffect(() => {
        HttpCachePublicBases.getSituationTypes().then(setSituations);
        if (latestDebts && latestDebts.length !== 0) {
            const grouped = groupByEntity(latestDebts);
            setGroupedData(grouped);

            const additionalCols = renderAdditionalCols();

            setColumns([
                {
                    label: 'Entidad',
                    minPadding: true,
                    textAlign: 'left',
                    sticky: true,
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
                    <TableList<CurrentDebtLastTwelveMonths[]>
                        entityList={Object.values(groupedData)}
                        columns={columns}
                        isLoading={loading}
                        error={error}
                        headerGroups={headerGroups}
                        tableContainerRef={tableRef}
                        sortGroups
                        variant={'bureauGroupsStyle'}
                    />
                    
                    <Stack spacing={.5}>
                        <TypographyBase variant={'h6'} color={'text.lighter'}>
                            Estados de la situación crediticia
                        </TypographyBase>
                        
                        <Grid container spacing={2}>
                            {
                                situations && situations.length &&
                                situations.map((situation, key) =>
                                    <Grid item xs={12} sm={6} md={4} 
                                          key={`situationItem_${key}`}>
                                        <Stack direction='row' alignItems='center' spacing={1}>
                                            <EntitySituationBadge situationCode={situation[EntityWithIdFields.Id]}
                                                                  size={'small'}
                                            />
                                            
                                            <TypographyBase variant={'body3'} color={'text.lighter'}>
                                                {situation[SituationTypeFields.Description]}
                                            </TypographyBase>
                                        </Stack>
                                    </Grid>
                                )
                            }
                        </Grid>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}


export default EntityEvolutionSituationTable