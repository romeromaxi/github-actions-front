import {CompanyFilePublic, CompanyFilePublicFields} from "../../../../types/companyFile/companyFileData";
import React, {useState} from "react";
import {CompanyViewDTOFields} from "../../../../types/company/companyData";
import {PersonTypes} from "../../../../types/person/personEnums";
import {Accordion, AccordionDetails, AccordionSummary, Alert, Box, Stack, Typography} from "@mui/material";
import {BaseIconWrapper} from "../../../../components/icons/Icons";
import {CaretDown, CaretUp, PresentationChart} from "@phosphor-icons/react";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import {
    CompanyBasePatrimonialStatementFields,
    CompanyDeclarationOfAssetsFields, CompanyDeclarationOfAssetsTotals, CompanyDeclarationOfAssetsTotalsFields,
    CompanyLastYearDeclarationOfAssets,
} from "../../../../types/company/companyFinanceInformationData";
import CompanyFinancialPatrimonialYearlyTotals from "../../finance/components/CompanyFinancialPatrimonialYearlyTotals";
import CompanyFinancialResultYearlyTotals from "../../finance/components/CompanyFinancialResultYearlyTotals";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import CompanyFinancialDeclarationOfAssetsTotals from "../../../company/finance/components/CompanyFinancialDeclarationOfAssetsTotals";
import {EconomicFinancialTableWrapper} from "../CompanyEconomicFinancialDataSection";
import CompanyFlowYearlyTotals from "../../../company/flow/CompanyFlowYearlyTotals";
import CompanyFlowTableDetail from "../../finance/components/CompanyFlowTableDetail";
import {CompanyFileEditFormFields} from "../../../../hooks/contexts/CompanyFileContext";


interface CompanyFileEconomicFinancialDataAccordionProps {
    companyFile: CompanyFilePublic    
}


const CompanyFileEconomicFinancialDataAccordion = ({companyFile} : CompanyFileEconomicFinancialDataAccordionProps) => {
    const company = companyFile[CompanyFilePublicFields.Company]
    const flows = companyFile[CompanyFilePublicFields.Flows]
    const declarationOfAssets = companyFile[CompanyFilePublicFields.DeclarationOfAssets]
    
    const [expanded, setExpanded] = useState<boolean>(false)
    const isPhysicalPerson: boolean = company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical

    return (
        <Stack sx={{padding: '24px', borderRadius: '32px', backgroundColor: 'white'}}>
            <Accordion sx={{ backgroundColor: 'white !important' }} expanded={expanded}>
                <AccordionSummary>
                    <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}} onClick={() => setExpanded(!expanded)}>
                        <Stack direction='row' spacing={2}>
                            <BaseIconWrapper Icon={PresentationChart} size={'md'} bg={'#F7FAFC'} />
                            <Stack spacing={1}>
                                <Typography variant={'h4'} fontWeight={500}>Información económica financiera</Typography>
                                {
                                    isPhysicalPerson ?
                                        <React.Fragment>
                                            <Typography variant={'caption'} color={'#818992'}>
                                                {`Fecha de cierre: ${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`}
                                            </Typography>
                                            <Typography variant={'caption'} color={'#818992'}>
                                                {`Última manifestación de bienes: ${dateFormatter.toShortDate(declarationOfAssets?.[CompanyDeclarationOfAssetsFields.Date]) || '-'}`}
                                            </Typography>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <Typography variant={'caption'} color={'#818992'}>
                                                {`Fecha de cierre: ${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`}
                                            </Typography>
                                            <Typography variant={'caption'} color={'#818992'}>
                                                {`Último balance cerrado: ${company[CompanyViewDTOFields.YearLastClosing] || '-'}`}
                                            </Typography>
                                        </React.Fragment>
                                }
                            </Stack>
                        </Stack>
                        <Box onClick={() => setExpanded(!expanded)}>
                            <BaseIconWrapper Icon={expanded ? CaretUp : CaretDown} size={'md'} bg={'#F7FAFC'} />
                        </Box>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={3} sx={{width: '100%'}}>
                        {
                            isPhysicalPerson ?
                                <CompanyFileEconomicFinancialDeclarationOfAssets declarationOfAssets={declarationOfAssets} totals={companyFile[CompanyFilePublicFields.TotalDeclarationOfAssets]}/> :
                                <CompanyFileEconomicFinancialExercises companyFile={companyFile} />
                        }

                        <EconomicFinancialTableWrapper title={'Totales por año'}>
                            <CompanyFlowYearlyTotals flowList={flows} />
                        </EconomicFinancialTableWrapper>

                        <EconomicFinancialTableWrapper title={'Movimientos'}>
                            <CompanyFlowTableDetail physicalPerson={isPhysicalPerson} flowList={flows} />
                        </EconomicFinancialTableWrapper>
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Stack>
    )
}

const CompanyFileEconomicFinancialExercises = ({ companyFile } : CompanyFileEconomicFinancialDataAccordionProps) => {

    const lastPatrimonialStatement = companyFile[CompanyFilePublicFields.CompanyLastPatrimonialStatement]
    const prevPatrimonialStatement = companyFile[CompanyFilePublicFields.CompanyPreviousPatrimonialStatement]

    const lastFinancialDate = lastPatrimonialStatement ?
        `Ejercicio ${lastPatrimonialStatement[CompanyBasePatrimonialStatementFields.Year]}` : '';

    const prevFinancialDate = prevPatrimonialStatement ?
        `Ejercicio ${prevPatrimonialStatement[CompanyBasePatrimonialStatementFields.Year]}` : '';

    const lastFinancialTotals = companyFile[CompanyFilePublicFields.CompanyTotalExercises]

    const prevFinancialTotals = companyFile[CompanyFilePublicFields.CompanyTotalPreviousExercises]

    return (
        (lastFinancialTotals && prevFinancialTotals) ?
                <Stack spacing={3}>
                    <EconomicFinancialTableWrapper title={lastFinancialDate}>
                        <Stack spacing={2}>
                            <CompanyFinancialPatrimonialYearlyTotals totals={lastFinancialTotals} />
                            <CompanyFinancialResultYearlyTotals totals={lastFinancialTotals} />
                        </Stack>
                    </EconomicFinancialTableWrapper>
                    <EconomicFinancialTableWrapper title={prevFinancialDate}>
                        <Stack spacing={2}>
                            <CompanyFinancialPatrimonialYearlyTotals totals={prevFinancialTotals} />
                            <CompanyFinancialResultYearlyTotals totals={prevFinancialTotals} />
                        </Stack>
                    </EconomicFinancialTableWrapper>
                </Stack>
            :
            <div></div>
    );
}


interface CompanyFileEconomicFinancialDeclarationOfAssetsProps {
    declarationOfAssets?: CompanyLastYearDeclarationOfAssets,
    totals: CompanyDeclarationOfAssetsTotals[]
}

const isCompleteDeclaration = (mainDeclaration: CompanyLastYearDeclarationOfAssets) => {
    return (
        (mainDeclaration[CompanyDeclarationOfAssetsFields.ActiveTotal] !==
            0 ||
            mainDeclaration[CompanyDeclarationOfAssetsFields.PassiveTotal] !==
            0) &&
        mainDeclaration[CompanyDeclarationOfAssetsFields.ActiveTotal] ===
        mainDeclaration[
            CompanyDeclarationOfAssetsFields.NetPatrimonyTotal
            ] +
        mainDeclaration[CompanyDeclarationOfAssetsFields.PassiveTotal]
    );
};

const CompanyFileEconomicFinancialDeclarationOfAssets = ({declarationOfAssets, totals} : CompanyFileEconomicFinancialDeclarationOfAssetsProps) => {
    const hasDeclarationOfAssets = declarationOfAssets && declarationOfAssets[EntityWithIdFields.Id]
    const completeDeclaration = !!declarationOfAssets && isCompleteDeclaration(declarationOfAssets);

    return (
        <Stack>
            {
                (!completeDeclaration) &&
                <Stack spacing={2}>
                    <Typography variant={'body2'} fontWeight={500} ml={2} mt={2}>
                        Manifestación de bienes
                    </Typography>
                    <Alert severity={'warning'}>
                        Para que el legajo se considere completo, el Valor Mercado del
                        Estado de Situación Patrimonial no puede tener todos los valores
                        en 0 (cero).
                    </Alert>
                </Stack>
            }

            {
                hasDeclarationOfAssets ?
                    <EconomicFinancialTableWrapper title={`Manifestación de bienes ${dateFormatter.toShortDate(declarationOfAssets?.[CompanyDeclarationOfAssetsTotalsFields.Date])}`}>
                        <CompanyFinancialDeclarationOfAssetsTotals totals={totals} nameBase={`${CompanyFileEditFormFields.DeclarationOfAssets}`}/>
                    </EconomicFinancialTableWrapper>
                    :
                    <Stack spacing={2}>
                        <Typography variant={'body2'} fontWeight={500} ml={2} mt={2}>
                            Manifestación de bienes
                        </Typography>
                        <Alert severity={'warning'}>
                            Para que el legajo se considere completo, el Valor Mercado del
                            Estado de Situación Patrimonial no puede tener todos los valores
                            en 0 (cero).
                        </Alert>
                    </Stack>
            }
        </Stack>
    )
}


export default CompanyFileEconomicFinancialDataAccordion