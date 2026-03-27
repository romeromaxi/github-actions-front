import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Stack, Theme, Typography, useMediaQuery} from "@mui/material";
import {BaseIconWrapper} from "components/icons/Icons";
import {CaretDown, CaretUp, Files} from "@phosphor-icons/react";
import React, {ReactNode, useContext, useState} from "react";
import {
    CompanyFileCompletenessFields,
    CompanyFileCompletenessView,
    CompanyForm,
    CompanyViewDTOFields
} from "types/company/companyData";
import {stringFormatter} from "util/formatters/stringFormatter";
import CompanyContactDataSection, {CompanyContactDataSectionEdit} from "./CompanyContactDataSection";
import CompanyActivityDataSection, {CompanyActivityDataSectionEdit} from "./CompanyActivityDataSection";
import {CompanyActivityView} from "types/company/companyActivityData";
import CompanyFiscalDataSection, {CompanyFiscalDataSectionEdit} from "./CompanyFiscalDataSection";
import CompanyCertificationsDataSection, {
    CompanyCertificationsDataSectionEdit
} from "./CompanyCertificationsDataSection";
import {CompanyFileEditFormFields} from "hooks/contexts/CompanyFileContext";
import {useFormContext} from "react-hook-form";
import CompanyFileWithPercentage from "../components/CompanyFileWithPercentage";


interface CompanyGeneralDataSectionProps {
    company: CompanyForm;
    activity: CompanyActivityView;
    canEdit?: boolean;
    context: React.Context<any>,
    completenessPercentage?: CompanyFileCompletenessView
}


const CompanyGeneralDataSection = ({ company, activity, canEdit, context, completenessPercentage }: CompanyGeneralDataSectionProps) => {
    const methods = useFormContext();
    const [expanded, setExpanded] = useState<boolean>(false);
    const { editing, setEditing } = useContext(context);
    const isPhysicalPerson: boolean = !!methods.watch(`${CompanyFileEditFormFields.IsPhyisicalPerson}`);
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const onClickEdit = (e: any) => {
        setEditing(true);
        setExpanded(true);
        e.stopPropagation();
    };

    const EditButton = canEdit && !editing && ( <Button onClick={onClickEdit} variant={'outlined'} color={'secondary'} size='small'>Editar</Button> );
    const ExpansionButton = (
        <Box onClick={() => setExpanded(!expanded)} sx={{ cursor: 'pointer'}}>
            <BaseIconWrapper Icon={expanded ? CaretUp : CaretDown} size={'md'} bg={'#F7FAFC'} />
        </Box>
    );

    return (
        <Stack sx={{ padding: '24px', borderRadius: '32px', backgroundColor: 'white', width: '100%', boxSizing: 'border-box' }}>
            <Accordion sx={{ backgroundColor: 'white !important', width: '100%' }} expanded={expanded}>
                <Stack width={1} spacing={2} sx={{ width: '100%', boxSizing: 'border-box' }}>
                    <Stack direction='row' justifyContent='space-between' sx={{ width: '100%' }} onClick={() => setExpanded(!expanded)}>
                        <Stack direction='row' spacing={2}>
                            <BaseIconWrapper Icon={Files} size={'md'} bg={'#F7FAFC'} />
                            <Stack spacing={1}>
                                <Typography variant={'h4'} fontWeight={500}>Legajo de contacto</Typography>
                                <Typography variant={'caption'} color={'text.lighter'}>{company[CompanyViewDTOFields.BusinessName]}</Typography>
                                <Typography variant={'caption'} color={'text.lighter'}>{stringFormatter.formatCuit(company[CompanyViewDTOFields.CUIT])}</Typography>

                                {completenessPercentage && canEdit && !editing && (
                                    <CompanyFileWithPercentage percentage={completenessPercentage[CompanyFileCompletenessFields.FileTypeShortCompletenessPercentage]} />
                                )}
                            </Stack>
                        </Stack>
                        <Stack spacing={2} alignItems={'center'} direction={isMobileScreenSize ? 'column' : 'row'}>
                            {isMobileScreenSize ? 
                                <>
                                    {ExpansionButton}
                                    {EditButton}
                                </>
                            : 
                                <> 
                                    {EditButton}
                                    {ExpansionButton}
                                </>
                            }
                        </Stack>
                    </Stack>
                </Stack>
                
                    <Stack spacing={2} sx={{ width: '100%', mt: 4}}>
                        {editing ? (
                            <>
                                <CompanySubsectionDataWrapper>
                                    <Typography fontWeight={500} variant={'h6'}>Datos de contacto</Typography>
                                    <CompanyContactDataSectionEdit company={company} />
                                </CompanySubsectionDataWrapper>
                                <CompanySubsectionDataWrapper>
                                    <Typography fontWeight={500} variant={'h6'}>Actividad</Typography>
                                    <CompanyActivityDataSectionEdit company={company} activity={activity} />
                                </CompanySubsectionDataWrapper>
                                <CompanySubsectionDataWrapper>
                                    <Typography fontWeight={500} variant={'h6'}>Información Fiscal</Typography>
                                    <CompanyFiscalDataSectionEdit company={company} isPhysical={isPhysicalPerson} />
                                </CompanySubsectionDataWrapper>
                                <CompanySubsectionDataWrapper>
                                    <Typography fontWeight={500} variant={'h6'}>Certificado MiPyME</Typography>
                                    <CompanyCertificationsDataSectionEdit company={company} />
                                </CompanySubsectionDataWrapper>
                            </>
                        ) : (
                            <>
                                <CompanySubsectionDataWrapper>
                                    <Typography fontWeight={500} variant={'h6'}>Datos de contacto</Typography>
                                    <CompanyContactDataSection company={company} canEdit={canEdit} />
                                </CompanySubsectionDataWrapper>
                                <CompanySubsectionDataWrapper>
                                    <Typography fontWeight={500} variant={'h6'}>Actividad</Typography>
                                    <CompanyActivityDataSection company={company} activity={activity} />
                                </CompanySubsectionDataWrapper>
                                <CompanySubsectionDataWrapper>
                                    <Typography fontWeight={500} variant={'h6'}>Información Fiscal</Typography>
                                    <CompanyFiscalDataSection company={company} isPhysical={isPhysicalPerson} canEdit={canEdit} />
                                </CompanySubsectionDataWrapper>
                                <CompanySubsectionDataWrapper>
                                    <Typography fontWeight={500} variant={'h6'}>Certificado MiPyME</Typography>
                                    <CompanyCertificationsDataSection company={company} canEdit={canEdit} />
                                </CompanySubsectionDataWrapper>
                            </>
                        )}
                    </Stack>
                
            </Accordion>
        </Stack>
    );
};

interface CompanySubsectionDataWrapperProps {
    children?: ReactNode
} 

export const CompanySubsectionDataWrapper = ({children} : CompanySubsectionDataWrapperProps) =>  {
    return (
        <Stack sx={{width: '100%', padding: '24px', backgroundColor: 'white', border: '1px solid #EDF2F7', borderRadius: '32px'}} spacing={3}>
            {children}
        </Stack>
    )
}


export default CompanyGeneralDataSection