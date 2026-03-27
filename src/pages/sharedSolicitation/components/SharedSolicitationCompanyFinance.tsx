import {CompanyFilePublic, CompanyFilePublicFields} from "../../../types/companyFile/companyFileData";
import {CompanyViewDTOFields} from "../../../types/company/companyData";
import {PersonTypes} from "../../../types/person/personEnums";
import {Grid, Stack, Typography} from "@mui/material";
import {DataWithLabel} from "../../../components/misc/DataWithLabel";
import React from "react";
import CompanyFileFinancialSummaryTab from "../../companyFile/finance/components/CompanyFileFinancialSummaryTab";
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import {
    CompanyDeclarationOfAssetsTotalsFields, CompanyFinancialTotalsFields
} from "../../../types/company/companyFinanceInformationData";
import CompanyFileDeclarationOfAssetsTotals
    from "../../companyFile/finance/components/CompanyFileDeclarationOfAssetsTotals";
import {grey} from "@mui/material/colors";
import CompanyFlowTableDetail from "../../companyFile/finance/components/CompanyFlowTableDetail";
import {CompanyFlowSemesterData} from "../../../types/company/companyFlowData";
import CompanyFlowChart from "../../company/flow/CompanyFlowChart";
import CompanyFlowYearlyTotals from "../../company/flow/CompanyFlowYearlyTotals";


interface SharedSolicitationCompanyFinanceProps {
    companyData: CompanyFilePublic
}


const SharedSolicitationCompanyFinance = ({companyData} : SharedSolicitationCompanyFinanceProps) => {
    const isPhysical = companyData[CompanyFilePublicFields.Company][CompanyViewDTOFields.PersonTypeCode] == PersonTypes.Physical
    
    
    return (
        isPhysical ? <SharedSolicitationCompanyFinancePhysical companyData={companyData} />
        : <SharedSolicitationCompanyFinanceLegal companyData={companyData} />
    )
}


const SharedSolicitationCompanyFinancePhysical = ({companyData} : SharedSolicitationCompanyFinanceProps) => {
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4.5}>
                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <Typography
                        variant="caption"
                        sx={{
                            width: '100%',
                            fontStyle: 'normal',
                            fontWeight: 300,
                            fontSize: '14px',
                            lineHeight: '22px',
                            color: 'rgb(95, 116, 141)',
                        }}
                    >
                        Fecha de la última manifestación de bienes personales:
                    </Typography>
                    <Typography fontWeight={600} fontSize={14}>
                        {dateFormatter.toShortDate(companyData[CompanyFilePublicFields.TotalDeclarationOfAssets][0][CompanyDeclarationOfAssetsTotalsFields.Date])}
                    </Typography>
                </Stack>
            </Grid>
            <Grid item md={7.5}></Grid>
            <Grid item xs={12}>
                <Stack>
                    <Typography fontSize={16} fontWeight={600}>Manifestación de bienes</Typography>
                    <Typography fontSize={14} fontWeight={500} fontStyle={'italic'} color={grey[600]}>
                        {`Fecha: ${dateFormatter.toShortDate(companyData[CompanyFilePublicFields.TotalDeclarationOfAssets][0][CompanyDeclarationOfAssetsTotalsFields.Date])}`}
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <CompanyFileDeclarationOfAssetsTotals totals={companyData[CompanyFilePublicFields.TotalDeclarationOfAssets]} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                    <Typography fontSize={16} fontWeight={600}>Movimientos</Typography>
                    <CompanyFlowTableDetail
                        flowList={companyData[CompanyFilePublicFields.Flows]}
                        physicalPerson
                    />
                </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                    <Stack spacing={1}>
                        <Typography fontSize={16} fontWeight={600}>Gráfico de Movimientos</Typography>
                        <CompanyFlowChart
                            flowList={companyData[CompanyFilePublicFields.Flows] as unknown as CompanyFlowSemesterData[]}
                            reverse
                        />
                    </Stack>
                    <Stack spacing={1}>
                        <Typography fontSize={16} fontWeight={600}>Totales por año</Typography>
                        <CompanyFlowYearlyTotals flowList={companyData[CompanyFilePublicFields.Flows]} />
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    )
}


const SharedSolicitationCompanyFinanceLegal = ({companyData} : SharedSolicitationCompanyFinanceProps) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {!!companyData[CompanyFilePublicFields.Company][CompanyViewDTOFields.DayClosing] &&
                    !!companyData[CompanyFilePublicFields.Company][CompanyViewDTOFields.MonthClosing] && 
                        <DataWithLabel
                            label={'Fecha de Cierre'}
                            data={`${companyData[CompanyFilePublicFields.Company][CompanyViewDTOFields.DayClosing]}/${companyData[CompanyFilePublicFields.Company][CompanyViewDTOFields.MonthClosing]}`}
                            rowDirection
                        />
                }
            </Grid>
            <Grid item xs={12}>
                <DataWithLabel
                    label={'Año de último balance cerrado'}
                    data={`${dateFormatter.toYearDate(companyData[CompanyFilePublicFields.CompanyTotalExercises][0][CompanyFinancialTotalsFields.Date])}`}
                    rowDirection
                />
            </Grid>
            <Grid item xs={12}>
                <CompanyFileFinancialSummaryTab totalsLast={companyData[CompanyFilePublicFields.CompanyTotalExercises]}
                                                totalsPrev={companyData[CompanyFilePublicFields.CompanyTotalPreviousExercises]}
                />
            </Grid>
        </Grid>
    )
}

export default SharedSolicitationCompanyFinance