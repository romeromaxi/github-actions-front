import * as React from "react";
import {useEffect, useState} from "react";
import {
    InternalReportSummaryTotal,
    InternalReportSummaryTotalFields,
    OffererReportSummary,
    OffererReportSummaryFields
} from "../../../types/offerer/offererReports";
import {HttpReports} from "../../../http/reports/httpReports";
import {Alert, Skeleton, Stack} from "@mui/material";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {PresentationChart} from "@phosphor-icons/react";
import {INavTab, NavsTabInsideHeader} from "../../../components/navs/NavsTab";
import {ReportsEmbeddedBase} from "../../offerer/reports/components/ReportsEmbedded";
import {TotalBoxComponentInteralNew} from "../../../components/misc/TotalBoxComponent";
import {BaseIconWrapper} from "../../../components/icons/Icons";
import {TypographyBase} from "../../../components/misc/TypographyBase";

const ReportsPage = () => {
    const [reports, setReports] = useState<OffererReportSummary[]>()
    const [summary, setSummary] = useState<InternalReportSummaryTotal>()
    
    useEffect(() => {
        Promise.all(
            [
                HttpReports.getInternal(),
                HttpReports.getInternalSummary()
            ]
        ).then(([reports, summary]) => {
            setReports(reports)
            setSummary(summary)
        })
    }, []);

    

    const lstTabsReports: INavTab[] | null = React.useMemo(() => {
        if (!reports) return null;

        if (reports.length === 0) return [];

        return reports.map((r, index) => {

            const content = <ReportsEmbeddedBase reportId={r[EntityWithIdFields.Id]} />

            return {
                label: r[OffererReportSummaryFields.ReportTitle],
                content: content,
                default: index === 0
            }
        });
    }, [reports])
    
    
    return (
        <Stack spacing={2}>
                {
                    lstTabsReports ?
                        <Stack>
                            <NavsTabInsideHeader lstTabs={
                                [{
                                    tabList: lstTabsReports
                                }]
                            }>
                                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                        <BaseIconWrapper Icon={PresentationChart} size={'md'} bg={'#F7FAFC'}/>
                                        <Stack>
                                            <TypographyBase variant={'h4'} fontWeight={500}>
                                                Reportes
                                            </TypographyBase>
                                        </Stack>
                                    </Stack>
                                    {
                                        summary ?
                                            <Stack direction='row' alignItems='center' spacing={2}>
                                                <TotalBoxComponentInteralNew total={summary[InternalReportSummaryTotalFields.TotalUsersQty]}
                                                                      label={'Usuarios'}
                                                                      subtotal={summary[InternalReportSummaryTotalFields.LastWeekNewUsersQty]}
                                                                      subtotalTooltip={'Nuevos en la última semana'}
                                                                      subtotalTwo={summary[InternalReportSummaryTotalFields.ValidatedUsersQty]}
                                                                      subtotalTwoTooltip={'Validados'}
                                                />
                                                <TotalBoxComponentInteralNew total={summary[InternalReportSummaryTotalFields.TotalCompaniesQty]} 
                                                                      label={'Empresas'}
                                                                      subtotal={summary[InternalReportSummaryTotalFields.LastWeekNewCompaniesQty]}
                                                                      subtotalTooltip={'Nuevas en la última semana'}
                                                                      subtotalTwo={summary[InternalReportSummaryTotalFields.ValidatedCompaniesQty]} 
                                                                      subtotalTwoTooltip={'Validadas'}
                                                />
                                            </Stack>
                                        :
                                            Array.from({length: 4}).map((d,k) => <Skeleton sx={{width: '200px', height: '50px', borderRadius: '8px'}} />)
                                    }
                                </Stack>
                            </NavsTabInsideHeader>
                            {lstTabsReports.length === 0 && <Alert>No hay reportes gráficos para ver por el momento</Alert>}
                        </Stack>
                        :
                        <Skeleton sx={{width: '100% !important', height: '20px !important'}}/>
                }
        </Stack>
    )
}


export default ReportsPage