import React, {useContext, useEffect} from "react";
import {Grid, Skeleton, Stack} from "@mui/material";
import CardEditingWithContext, {CardEditingContext} from "components/cards/CardEditingWithContext";
import {useFormContext} from "react-hook-form";
import {AsyncSelect, ControlledRadioYesNo, ControlledTextFieldFilled} from "components/forms";
import {CompanyDetailFormFields, CompanyFileCompletenessFields, CompanyViewDTOFields} from "types/company/companyData";
import {CompanyFileEditProfileFormFields} from "../homesEdit/CompanyFileHomeEditProfile";
import {HttpCacheCompany, HttpCachePerson} from "http/index";
import {CompanyFileContext, CompanyFileEditFormFields} from "hooks/contexts/CompanyFileContext";
import {NavsTabVerticalContext} from "components/navs/NavsTab";
import CardHeaderTitleWithFieldsPending from "components/cards/CardHeaderTitleWithFieldsPending";
import { CompanyFileSourceType } from "types/company/companyEnums";

function CompanyPersonalInformationFiscalInfo() {
    const { completenessPercentage, cancelEditing, updateCompanyFile, dataSource } = useContext(CompanyFileContext);

    const cardProps: any = {
        title: (
            <CardHeaderTitleWithFieldsPending
                title={"Información Fiscal"}
                missingFields={completenessPercentage?.[CompanyFileCompletenessFields.CompanyFiscalInfoMissingFieldsCount]}
            />
        ),
        onDiscard: cancelEditing,
        onSubmit: updateCompanyFile,
        useAppCommon: true,
        hideHeaderActions: dataSource === CompanyFileSourceType.CompanyFile
    };

    return (
        <Stack>
            <CardEditingWithContext {...cardProps}>
                <CompanyPersonalInformationFiscalInfoChildren />
            </CardEditingWithContext>
        </Stack>
    )
}

function CompanyPersonalInformationFiscalInfoChildren() {
    const { editing, setEditing } = useContext(CardEditingContext);
    const { loadingForm, cancelEditing, updateCompanyFile } = useContext(CompanyFileContext);
    const { setFuncsOnChangeTab } = useContext(NavsTabVerticalContext);
    
    const methods = useFormContext();
    const baseNameCompany: string = CompanyFileEditProfileFormFields.Company;
    const company = methods.watch(baseNameCompany);

    const isLegalPerson: boolean = !methods.watch(`${CompanyFileEditFormFields.IsPhyisicalPerson}`);

    const hasClosingDate: boolean =
        !!company[CompanyViewDTOFields.DayClosing] &&
        !!company[CompanyViewDTOFields.MonthClosing];
    const dateClosing: string = hasClosingDate
        ? `${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`
        : '';

    useEffect(() => {
        setFuncsOnChangeTab({
            onDiscardTab: (hasConfirmation: boolean) => {
                if (hasConfirmation) cancelEditing();
                setEditing(false);
            },
            onConfirmTab: () => {
                updateCompanyFile()
                    .then(() => setEditing(false));
            }
        })
    }, [editing]);
    
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={isLegalPerson ? 4 : 6}>
                {
                    !loadingForm ?
                        <ControlledRadioYesNo label="Condición IIBB"
                                              control={methods.control}
                                              setValue={methods.setValue}
                                              name={`${baseNameCompany}.${CompanyViewDTOFields.RegisteredAtIIBB}`}
                                              loadPending
                                              disabledAsInput
                                              disabled={!editing}
                                              direction="row"
                        />
                        :
                        <Skeleton />
                }
            </Grid>
            
            {
                isLegalPerson && (
                    <Grid item xs={12} md={4}>
                        <ControlledTextFieldFilled label="Cierre de Ejercicio Económico" 
                                                   control={methods.control} 
                                                   placeholder="dd/mm" 
                                                   name={`${baseNameCompany}.${CompanyDetailFormFields.DateClosing}`} 
                                                   helperText="Formato: dd/mm. Por ejemplo 31/12"
                                                   disabled={!editing}
                                                   defaultValue={dateClosing}
                        />
                    </Grid>
                )
            }
            
            <Grid item xs={12} sm={isLegalPerson ? 4 : 6}>
                {
                    !loadingForm ?
                        <ControlledRadioYesNo label="Convenio Multilateral"
                                              control={methods.control}
                                              setValue={methods.setValue}
                                              name={`${baseNameCompany}.${CompanyViewDTOFields.HasMultilateralAgreement}`}
                                              loadPending
                                              disabledAsInput
                                              disabled={!editing}
                                              direction="row"
                        />
                        :
                        <Skeleton />
                }
            </Grid>

            <Grid item xs={12} md={6}>
                <AsyncSelect label="Condición Frente al IVA" 
                             control={methods.control} 
                             name={`${baseNameCompany}.${CompanyViewDTOFields.AfipResponsibilityTypeCode}`} 
                             loadOptions={HttpCachePerson.getAfipResponsiblityTypes}
                             disabled={!editing}
                             loadPending
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <ControlledTextFieldFilled control={methods.control} 
                                           label="Facturación último año" 
                                           name={`${baseNameCompany}.${CompanyViewDTOFields.BillingAmount}`} 
                                           fullWidth 
                                           loadPending 
                                           currency 
                                           textAlign={'right'}
                                           disabled={!editing}
                                           //onFocus={handleFocus}
                />
            </Grid>

            {
                !isLegalPerson && (
                <React.Fragment>
                    <Grid item xs={12} md={6}>
                        <AsyncSelect label="Autónomo" 
                                     control={methods.control} 
                                     name={`${baseNameCompany}.${CompanyViewDTOFields.SelfEmployedTypeCode}`} 
                                     loadOptions={HttpCacheCompany.getSelfEmployedTypes}
                                     disabled={!editing}
                                     loadPending
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AsyncSelect label="Monotributista" 
                                     control={methods.control} 
                                     name={`${baseNameCompany}.${CompanyViewDTOFields.MonotaxTypeCode}`} 
                                     loadOptions={HttpCacheCompany.getMonotaxTypes}
                                     disabled={!editing}
                                     loadPending
                        />
                    </Grid>
                </React.Fragment>
            )}
        </Grid>
    )
}

export default CompanyPersonalInformationFiscalInfo;