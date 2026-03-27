import {CompanyFields, CompanyForm, CompanyViewDTO, CompanyViewDTOFields} from "../../../types/company/companyData";
import CompanyLabelWithValueComponent from "./components/CompanyLabelWithValueComponent";
import {Stack, Theme, useMediaQuery} from "@mui/material";
import React from "react";
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import {useFormContext} from "react-hook-form";
import {CompanyFileEditProfileFormFields} from "../homesEdit/CompanyFileHomeEditProfile";
import {AsyncSelect, ControlledRadioYesNo} from "../../../components/forms";
import {Skeleton} from "@mui/lab";
import {ControlledDatePicker} from "../../../components/forms/ControlledDatePicker";
import {HttpCacheGeneral} from "../../../http";
import {PersonTypes} from "../../../types/person/personEnums";


interface CompanyCertificationsDataSectionProps {
    company: CompanyForm,
    canEdit?: boolean
}


const CompanyCertificationsDataSection = ({company, canEdit} : CompanyCertificationsDataSectionProps) => {
    const hasCertificatePyme = company[CompanyViewDTOFields.HasCertificatePyme]
    
    const certificatePymeDate = !hasCertificatePyme
        ? '-'
        : dateFormatter.toShortDate(
            company[CompanyViewDTOFields.CertificatePymeDate],
        ) === '-'
            ? ''
            : dateFormatter.toShortDate(
                company[CompanyViewDTOFields.CertificatePymeDate],
            );
    
    return (
        <Stack spacing={1}>
            <CompanyLabelWithValueComponent label={'Certificado MiPyME'} value={hasCertificatePyme !== null ? hasCertificatePyme ? 'Si' : 'No' : canEdit ? undefined : '-'} />
            <CompanyLabelWithValueComponent label={'Vigencia'} value={certificatePymeDate} />
            <CompanyLabelWithValueComponent label={'Categoría MiPyME'} value={hasCertificatePyme ? company[CompanyViewDTOFields.AfipSectionDesc] : '-'} />
            <CompanyLabelWithValueComponent label={'Grupo económico'} value={company[CompanyViewDTOFields.BelongsEconomicGroup] !== null ? company[CompanyViewDTOFields.BelongsEconomicGroup] ? 'Si' : 'No' : '-'} />
        </Stack>
    )
}


interface CompanyFileCertificationsDataSectionProps {
    company: CompanyViewDTO,
    canEdit?: boolean
}

export const CompanyFileCertificationsDataSection = ({company, canEdit} : CompanyFileCertificationsDataSectionProps) => {
    const hasCertificatePyme = company[CompanyViewDTOFields.HasCertificatePyme]

    const certificatePymeDate = !hasCertificatePyme
        ? '-'
        : dateFormatter.toShortDate(
            company[CompanyViewDTOFields.CertificatePymeDate],
        ) === '-'
            ? ''
            : dateFormatter.toShortDate(
                company[CompanyViewDTOFields.CertificatePymeDate],
            );

    return (
        <Stack spacing={1}>
            <CompanyLabelWithValueComponent label={'Certificado MiPyME'} value={hasCertificatePyme !== null ? hasCertificatePyme ? 'Si' : 'No' : canEdit ? undefined : '-'} />
            <CompanyLabelWithValueComponent label={'Vigencia'} value={certificatePymeDate} />
            <CompanyLabelWithValueComponent label={'Categoría MiPyME'} value={hasCertificatePyme ? company[CompanyViewDTOFields.AfipSectionDesc] : '-'} />
            <CompanyLabelWithValueComponent label={'Grupo económico'} value={company[CompanyViewDTOFields.BelongsEconomicGroup] !== null ? company[CompanyViewDTOFields.BelongsEconomicGroup] ? 'Si' : 'No' : '-'} />
        </Stack>
    )
}


export const CompanyCertificationsDataSectionEdit = ({company} : CompanyCertificationsDataSectionProps) => {
    const methods = useFormContext()
    const baseNameCompany: string = CompanyFileEditProfileFormFields.Company;
    const isLoading: boolean =
        methods.watch(`${baseNameCompany}.${CompanyViewDTOFields.CUIT}`) ==
        undefined;
    
    const hasCertificatePyme = company[CompanyViewDTOFields.HasCertificatePyme]
    const isLegalPerson: boolean = company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal;
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    return (
        <Stack spacing={2}>
            <Stack spacing={2} direction={isMobileScreenSize ? 'column' : 'row'} alignItems={isMobileScreenSize ? 'flex-start' : 'center'} justifyContent={isMobileScreenSize ? 'flex-start' : 'space-between'}>
                {!isLoading ? (
                    <ControlledRadioYesNo
                        label="Certificado MiPyME"
                        control={methods.control}
                        setValue={methods.setValue}
                        name={`${baseNameCompany}.${CompanyViewDTOFields.HasCertificatePyme}`}
                        loadPending
                        row
                    />
                ) : (
                    <Skeleton />
                )}
                {isLegalPerson && (
                    !isLoading ? (
                        <ControlledRadioYesNo
                            label="Grupo Económico"
                            control={methods.control}
                            setValue={methods.setValue}
                            name={`${baseNameCompany}.${CompanyViewDTOFields.BelongsEconomicGroup}`}
                            row
                        />
                    ) : (
                        <Skeleton />
                    )
                )}
                <ControlledDatePicker
                    label="Vigencia"
                    control={methods.control}
                    name={`${baseNameCompany}.${CompanyViewDTOFields.CertificatePymeDate}`}
                    disabled={!hasCertificatePyme}
                    loadPending={hasCertificatePyme}
                    filled
                />
            </Stack>
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <AsyncSelect
                    loadOptions={HttpCacheGeneral.getAfipSection}
                    control={methods.control}
                    name={`${baseNameCompany}.${CompanyFields.AfipSectionCode}`}
                    label={'Categoria MiPyMEs'}
                    loadPending={hasCertificatePyme}
                    fullWidth
                />
            </Stack>
        </Stack>
    )
}


export default CompanyCertificationsDataSection