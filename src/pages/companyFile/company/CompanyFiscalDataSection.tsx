import {
    CompanyDetailFormFields,
    CompanyForm,
    CompanyViewDTO,
    CompanyViewDTOFields
} from "../../../types/company/companyData";
import CompanyLabelWithValueComponent from "./components/CompanyLabelWithValueComponent";
import {Stack, Theme, useMediaQuery} from "@mui/material";
import React from "react";
import {numberFormatter} from "../../../util/formatters/numberFormatter";
import {AsyncSelect, ControlledRadioYesNo, ControlledTextFieldFilled} from "../../../components/forms";
import {Skeleton} from "@mui/lab";
import {useFormContext} from "react-hook-form";
import {CompanyFileEditProfileFormFields} from "../homesEdit/CompanyFileHomeEditProfile";
import {HttpCacheCompany, HttpCachePerson} from "../../../http";


interface CompanyFiscalDataSectionProps {
    company: CompanyForm,
    isPhysical: boolean,
    canEdit?: boolean
}

const CompanyFiscalDataSection = ({company, isPhysical, canEdit} : CompanyFiscalDataSectionProps) => {
    return (
        <Stack spacing={1}>
            <CompanyLabelWithValueComponent label={'Condición IIBB'} value={company[CompanyViewDTOFields.RegisteredAtIIBB] !== null ? company[CompanyViewDTOFields.RegisteredAtIIBB] ? 'Si' : 'No' : '-'} />
            <CompanyLabelWithValueComponent label={'Cierre de ejercicio económico'} value={`${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`} />
            <CompanyLabelWithValueComponent label={'Convenio multilateral'} value={company[CompanyViewDTOFields.HasMultilateralAgreement] !== null ? company[CompanyViewDTOFields.HasMultilateralAgreement] ? 'Si' : 'No' : canEdit ? undefined : '-'} />
            <CompanyLabelWithValueComponent label={'Condición frente al IVA'} value={company[CompanyViewDTOFields.PersonResponsibilityTypeDesc]} />
            <CompanyLabelWithValueComponent label={'Facturación último año'} value={company[CompanyViewDTOFields.BillingAmount] ? `${numberFormatter.toStringWithAmount(company[CompanyViewDTOFields.BillingAmount], '$')}` : company[CompanyViewDTOFields.BillingAmount] == 0 ? '$ 0' : undefined} />
            {isPhysical && (
                <React.Fragment>
                    <CompanyLabelWithValueComponent label={'Autónomo'} value={company[CompanyViewDTOFields.SelfEmployedTypeDesc]} />
                    <CompanyLabelWithValueComponent label={'Monotributista'} value={company[CompanyViewDTOFields.MonotaxTypeDesc]} />
                </React.Fragment>
            )}
        </Stack>
    )
}


interface CompanyFileFiscalDataSectionProps {
    company: CompanyViewDTO,
    isPhysical: boolean
}

export const CompanyFileFiscalDataSection = ({company, isPhysical} : CompanyFileFiscalDataSectionProps) => {
    return (
        <Stack spacing={1}>
            <CompanyLabelWithValueComponent label={'Condición IIBB'} value={company[CompanyViewDTOFields.RegisteredAtIIBB] !== null ? company[CompanyViewDTOFields.RegisteredAtIIBB] ? 'Si' : 'No' : '-'} />
            <CompanyLabelWithValueComponent label={'Cierre de ejercicio económico'} value={`${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`} />
            <CompanyLabelWithValueComponent label={'Convenio multilateral'} value={company[CompanyViewDTOFields.HasMultilateralAgreement] !== null ? company[CompanyViewDTOFields.HasMultilateralAgreement] ? 'Si' : 'No' : '-'} />
            <CompanyLabelWithValueComponent label={'Condición frente al IVA'} value={company[CompanyViewDTOFields.PersonResponsibilityTypeDesc]} />
            <CompanyLabelWithValueComponent label={'Facturación último año'} value={company[CompanyViewDTOFields.BillingAmount] ? `${numberFormatter.toStringWithAmount(company[CompanyViewDTOFields.BillingAmount], '$')}` : company[CompanyViewDTOFields.BillingAmount] == 0 ? '$ 0' : undefined} />
            {isPhysical && (
                <React.Fragment>
                    <CompanyLabelWithValueComponent label={'Autónomo'} value={company[CompanyViewDTOFields.SelfEmployedTypeDesc]} />
                    <CompanyLabelWithValueComponent label={'Monotributista'} value={company[CompanyViewDTOFields.MonotaxTypeDesc]} />
                </React.Fragment>
            )}
        </Stack>
    )
}


export const CompanyFiscalDataSectionEdit = ({company, isPhysical} : CompanyFiscalDataSectionProps) => {
    const methods = useFormContext()
    const baseNameCompany: string = CompanyFileEditProfileFormFields.Company;
    
    const hasClosingDate: boolean =
        !!company[CompanyViewDTOFields.DayClosing] &&
        !!company[CompanyViewDTOFields.MonthClosing];
    const dateClosing: string = hasClosingDate
        ? `${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`
        : '';
        
    const isLoading: boolean =
        methods.watch(`${baseNameCompany}.${CompanyViewDTOFields.CUIT}`) ==
        undefined;
    
    const handleFocus = (e: any) => e.target.select();
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isLargeScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down(1440));
    
    return (
        <Stack spacing={2}>
            <Stack spacing={2} direction={isMobileScreenSize ? 'column' : 'row'} alignItems={isMobileScreenSize ? 'flex-start' : 'center'} 
                justifyContent={isMobileScreenSize ? 'flex-start' : 'space-between'}
            >
                {!isLoading ? (
                    <ControlledRadioYesNo
                        label="Condición IIBB"
                        control={methods.control}
                        setValue={methods.setValue}
                        name={`${baseNameCompany}.${CompanyViewDTOFields.RegisteredAtIIBB}`}
                        loadPending
                        row
                    />
                ) : (
                    <Skeleton />
                )}
                {!isLoading ? (
                    <ControlledRadioYesNo
                        label="Convenio Multilateral"
                        control={methods.control}
                        setValue={methods.setValue}
                        name={`${baseNameCompany}.${CompanyViewDTOFields.HasMultilateralAgreement}`}
                        loadPending
                        row
                    />
                ) : (
                    <Skeleton />
                )}
            </Stack>
            <Stack direction={isLargeScreenSize ? 'column' : 'row'} alignItems={'center'} spacing={2}>
                {
                    !isPhysical &&
                    <ControlledTextFieldFilled
                        label="Cierre de Ejercicio Económico"
                        control={methods.control}
                        placeholder="dd/mm"
                        name={`${baseNameCompany}.${CompanyDetailFormFields.DateClosing}`}
                        helperText="Formato: dd/mm. Por ejemplo 31/12"
                        defaultValue={dateClosing}
                    />
                }
                <AsyncSelect label="Condición Frente al IVA"
                                control={methods.control}
                                name={`${baseNameCompany}.${CompanyViewDTOFields.AfipResponsibilityTypeCode}`}
                                loadOptions={HttpCachePerson.getAfipResponsiblityTypes}
                                loadPending
                />
                {isPhysical &&
                    <ControlledTextFieldFilled
                        control={methods.control}
                        label="Facturación último año"
                        name={`${baseNameCompany}.${CompanyViewDTOFields.BillingAmount}`}
                        fullWidth
                        loadPending
                        currency
                        textAlign={'right'}
                        onFocus={handleFocus}
                    />
                }
            </Stack>
            {!isPhysical &&
                <ControlledTextFieldFilled
                    control={methods.control}
                    label="Facturación último año"
                    name={`${baseNameCompany}.${CompanyViewDTOFields.BillingAmount}`}
                    fullWidth
                    loadPending
                    currency
                    textAlign={'right'}
                    onFocus={handleFocus}
                />
            }

            {
                isPhysical &&
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <AsyncSelect label="Autónomo"
                                        control={methods.control}
                                        name={`${baseNameCompany}.${CompanyViewDTOFields.SelfEmployedTypeCode}`}
                                        loadOptions={HttpCacheCompany.getSelfEmployedTypes}
                                        loadPending
                        />
                        <AsyncSelect label="Monotributista"
                                        control={methods.control}
                                        name={`${baseNameCompany}.${CompanyViewDTOFields.MonotaxTypeCode}`}
                                        loadOptions={HttpCacheCompany.getMonotaxTypes}
                                        loadPending
                        />
                    </Stack>
            }
        </Stack>
    )
}


export default CompanyFiscalDataSection