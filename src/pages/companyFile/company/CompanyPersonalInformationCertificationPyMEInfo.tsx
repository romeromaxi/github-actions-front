import React, {useContext, useEffect} from "react";
import {useFormContext} from "react-hook-form";
import {Grid, Skeleton, Stack} from "@mui/material";
import CardEditingWithContext, {CardEditingContext} from "components/cards/CardEditingWithContext";
import {CompanyFileContext, CompanyFileEditFormFields} from "hooks/contexts/CompanyFileContext";
import {AsyncSelect, ControlledRadioYesNo} from "components/forms";
import {CompanyFields, CompanyFileCompletenessFields, CompanyViewDTOFields} from "types/company/companyData";
import {CompanyFileEditProfileFormFields} from "../homesEdit/CompanyFileHomeEditProfile";
import {ControlledDatePicker} from "components/forms/ControlledDatePicker";
import {HttpCacheGeneral} from "http/index";
import {NavsTabVerticalContext} from "components/navs/NavsTab";
import CardHeaderTitleWithFieldsPending from "components/cards/CardHeaderTitleWithFieldsPending";
import { CompanyFileSourceType } from "types/company/companyEnums";

function CompanyPersonalInformationCertificationPyMEInfo() {
    const { completenessPercentage, cancelEditing, updateCompanyFile, dataSource } = useContext(CompanyFileContext);

    const cardProps: any = {
        title: (
            <CardHeaderTitleWithFieldsPending
                title={"Certificado MiPyME"}
                missingFields={completenessPercentage?.[CompanyFileCompletenessFields.CompanyPyMECertificationMissingFieldsCount]}
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
                <CompanyPersonalInformationCertificationPyMEInfoChildren />
            </CardEditingWithContext>
        </Stack>
    )
}

function CompanyPersonalInformationCertificationPyMEInfoChildren() {
    const { editing, setEditing } = useContext(CardEditingContext);
    const { loadingForm, cancelEditing, updateCompanyFile } = useContext(CompanyFileContext);
    const { setFuncsOnChangeTab } = useContext(NavsTabVerticalContext);
    
    const methods = useFormContext();
    const baseNameCompany: string = CompanyFileEditProfileFormFields.Company;
    const company = methods.watch(baseNameCompany);
    const isLegalPerson: boolean = !methods.watch(`${CompanyFileEditFormFields.IsPhyisicalPerson}`);

    const hasCertificatePyme = company[CompanyViewDTOFields.HasCertificatePyme]

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
            <Grid item xs={12} sm={6}>
                {
                    !loadingForm ?
                        <ControlledRadioYesNo label="Certificado MiPyME" 
                                              control={methods.control} 
                                              setValue={methods.setValue} 
                                              name={`${baseNameCompany}.${CompanyViewDTOFields.HasCertificatePyme}`} 
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
                    <Grid item xs={12} sm={6}>
                        {
                            !loadingForm ?
                                <ControlledRadioYesNo label="Grupo Económico"
                                                      control={methods.control}
                                                      setValue={methods.setValue}
                                                      name={`${baseNameCompany}.${CompanyViewDTOFields.BelongsEconomicGroup}`}
                                                      loadPending
                                                      disabledAsInput
                                                      disabled={!editing}
                                                      direction="row"
                                />
                                :
                                <Skeleton />
                        }
                    </Grid>
                )
            }
            
            <Grid item xs={12} sm={6}>
                <ControlledDatePicker label="Vigencia" 
                                      control={methods.control} 
                                      name={`${baseNameCompany}.${CompanyViewDTOFields.CertificatePymeDate}`} 
                                      disabled={!hasCertificatePyme || !editing}
                                      loadPending={hasCertificatePyme} 
                                      filled
                />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <AsyncSelect loadOptions={HttpCacheGeneral.getAfipSection} 
                             control={methods.control} 
                             name={`${baseNameCompany}.${CompanyFields.AfipSectionCode}`}
                             disabled={!editing}
                             label={'Categoria MiPyMEs'} 
                             loadPending={hasCertificatePyme} 
                             fullWidth
                />
            </Grid>
        </Grid>
    );
}

export default CompanyPersonalInformationCertificationPyMEInfo;