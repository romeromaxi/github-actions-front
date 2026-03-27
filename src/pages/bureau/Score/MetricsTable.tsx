import React, {useMemo} from 'react';
import {Skeleton} from "@mui/lab";
import {Metrics, MetricsFields} from 'types/nosis/nosisData';
import {Card, CardContent, CardHeader, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {themeColorDefinition} from "util/themes/definitions";
import {WrapperIcons} from "components/icons/Icons";
import { MinusIcon, MoveRightIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

interface MetricsTableProps {
    title?: string,
    description?: string,
    metrics?: Metrics;
    loading: boolean;
    error: boolean;
}

function MetricsTable({ title, description, metrics, loading, error }: MetricsTableProps) {

  return (
      <Card>
          <CardHeader title={title || 'Tendencia'}
                      subheader={description}
          />
          
          <CardContent>
              {
                  loading ?
                      <Stack p={'12px'} spacing={2}>
                          <Skeleton />
                          <Skeleton />
                          <Skeleton />
                          <Skeleton />
                      </Stack>
                      :
                      (!!metrics && !error) ?
                          <Stack>
                              <MetricTableRow label={'Últimos 3 Meses'}
                                              value={metrics[MetricsFields.ThreeMonthTrendScoringDesc]}
                                              trendCode={metrics[MetricsFields.ThreeMonthTrendScoring]}
                              />
                              <MetricTableRow label={'Últimos 6 Meses'}
                                              value={metrics[MetricsFields.SixMonthTrendScoringDesc]}
                                              trendCode={metrics[MetricsFields.SixMonthTrendScoring]}
                              />
                              <MetricTableRow label={'Últimos 9 Meses'}
                                              value={metrics[MetricsFields.NineMonthTrendScoringDesc]}
                                              trendCode={metrics[MetricsFields.NineMonthTrendScoring]}
                              />
                              <MetricTableRow label={'Últimos 12 Meses'}
                                              value={metrics[MetricsFields.TwelveMonthTrendScoringDesc]}
                                              trendCode={metrics[MetricsFields.TwelveMonthTrendScoring]}
                              />
                          </Stack>
                          :
                          <Stack direction={'row'} justifyContent={'center'}>
                              <TypographyBase variant={'body3'} color={'text.lighter'}>
                                  Tuvimos un problema al cargar la información. Intente nuevamente en unos instantes
                              </TypographyBase>
                          </Stack>
              }              
          </CardContent>
      </Card>
  );
}

interface MetricTableRowProps {
    label: string,
    value: string,
    trendCode: number
}

function MetricTableRow({ label, value, trendCode }: MetricTableRowProps){
    const rowProps = useMemo(() => {
        if (trendCode > 0)
            return {
                Icon: TrendingUpIcon,
                color: themeColorDefinition.systemFeedback.success.primary
            }

        if (trendCode < 0)
            return {
                Icon: TrendingDownIcon,
                color: themeColorDefinition.systemFeedback.warning.primary
            }

        return {
            Icon: value ? MoveRightIcon : MinusIcon,
            color: themeColorDefinition.UIElements.texts.lighter
        }
    }, [value, trendCode])
    
    return (
        <Stack direction={{ xs: 'column', sm: 'row' }}
               p={'12px'}
               justifyContent={'space-between'}
               borderBottom={`1px solid ${themeColorDefinition.UIElements.borders.tertiary}`}
               alignItems={'center'}
        >
            <TypographyBase variant={'body3'}
                            color={'text.lighter'}
                            fontWeight={600}
                            textTransform={'uppercase'}
            >
                {label}
            </TypographyBase>

            <Stack direction={'row'} spacing={1}
                   alignItems={'center'}
            >
                <WrapperIcons Icon={rowProps.Icon}
                              size={'md'}
                              color={rowProps.color}
                />
                
                <TypographyBase variant={'body3'}
                                fontWeight={600}
                                color={rowProps.color}
                >
                    {value}
                </TypographyBase>
            </Stack>
        </Stack>
    )
}

export default MetricsTable;
