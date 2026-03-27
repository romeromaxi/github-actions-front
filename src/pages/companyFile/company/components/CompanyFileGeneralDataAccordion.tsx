
import React, {useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography} from "@mui/material";
import {BaseIconWrapper} from "../../../../components/icons/Icons";
import {CaretDown, CaretUp, Files} from "@phosphor-icons/react";
import {CompanyViewDTOFields} from "../../../../types/company/companyData";
import {stringFormatter} from "../../../../util/formatters/stringFormatter";
import {CompanyFileContactDataSection} from "../CompanyContactDataSection";
import {CompanyFileActivityDataSection} from "../CompanyActivityDataSection";
import {CompanyFileFiscalDataSection} from "../CompanyFiscalDataSection";
import {
    CompanyFileCertificationsDataSection
} from "../CompanyCertificationsDataSection";
import {CompanySubsectionDataWrapper} from "../CompanyGeneralDataSection";
import {PersonTypes} from "../../../../types/person/personEnums";
import {CompanyFilePublic, CompanyFilePublicFields} from "../../../../types/companyFile/companyFileData";
import {CompanyAfipActivityFields} from "../../../../types/company/companyActivityData";


interface CompanyFileGeneralDataAccordionProps {
    companyFile: CompanyFilePublic;
}


const CompanyFileGeneralDataAccordion = ({companyFile} : CompanyFileGeneralDataAccordionProps) => {
    const company = companyFile[CompanyFilePublicFields.Company]
    const activity = companyFile[CompanyFilePublicFields.CompanySummary]
    const afipActivity = companyFile[CompanyFilePublicFields.CompanyAfipActivities].find(
        (r) => r[CompanyAfipActivityFields.IsMainActivity]
    ) || companyFile[CompanyFilePublicFields.CompanyAfipActivities][0]
    const addresses = companyFile[CompanyFilePublicFields.CompanyAddressess]
    const [expanded, setExpanded] = useState<boolean>(false)

    const isPhysicalPerson: boolean = company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical

    return (
        <Stack sx={{padding: '24px', borderRadius: '32px', backgroundColor: 'white'}}>
            <Accordion sx={{ backgroundColor: 'white !important' }} expanded={expanded}>
                <AccordionSummary>
                    <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}} onClick={() => setExpanded(!expanded)}>
                        <Stack direction='row' spacing={2}>
                            <BaseIconWrapper Icon={Files} size={'md'} bg={'#F7FAFC'} />
                            <Stack spacing={1}>
                                <Typography variant={'h4'} fontWeight={500}>Legajo de contacto</Typography>
                                <Typography variant={'caption'} color={'text.lighter'}>{company[CompanyViewDTOFields.BusinessName]}</Typography>
                                <Typography variant={'caption'} color={'text.lighter'}>{stringFormatter.formatCuit(company[CompanyViewDTOFields.CUIT])}</Typography>
                            </Stack>
                        </Stack>
                        <Box onClick={() => setExpanded(!expanded)}>
                            <BaseIconWrapper Icon={expanded ? CaretUp : CaretDown} size={'md'} bg={'#F7FAFC'} />
                        </Box>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2} sx={{width: '100%'}}>
                        <CompanySubsectionDataWrapper>
                            <Typography fontWeight={500} variant={'h6'}>Datos de contacto</Typography>
                            <CompanyFileContactDataSection company={company} addresses={addresses}/>
                        </CompanySubsectionDataWrapper>
                        <CompanySubsectionDataWrapper>
                            <Typography fontWeight={500} variant={'h6'}>Actividad</Typography>
                            <CompanyFileActivityDataSection activity={activity} afipActivity={afipActivity}/>
                        </CompanySubsectionDataWrapper>
                        <CompanySubsectionDataWrapper>
                            <Typography fontWeight={500} variant={'h6'}>Información Fiscal</Typography>
                            <CompanyFileFiscalDataSection company={company} isPhysical={isPhysicalPerson}/>
                        </CompanySubsectionDataWrapper>
                        <CompanySubsectionDataWrapper>
                            <Typography fontWeight={500} variant={'h6'}>Certificado MiPyME</Typography>
                            <CompanyFileCertificationsDataSection company={company} />
                        </CompanySubsectionDataWrapper>
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Stack>
    )
}


export default CompanyFileGeneralDataAccordion