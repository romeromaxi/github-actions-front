import React, {useContext, useEffect} from "react";
import {Grid, Skeleton, Stack} from "@mui/material";
import CardEditingWithContext, {CardEditingContext} from "components/cards/CardEditingWithContext";
import {useFormContext} from "react-hook-form";
import {CompanyFileContext, CompanyFileEditFormFields} from "hooks/contexts/CompanyFileContext";
import {ControlledRadioYesNo, ControlledTextFieldFilled} from "components/forms";
import {CompanyFields, CompanyFileCompletenessFields, CompanyViewDTOFields} from "types/company/companyData";
import {CompanyFileEditProfileFormFields} from "../homesEdit/CompanyFileHomeEditProfile";
import {ControlledDatePicker} from "components/forms/ControlledDatePicker";
import CompanyPersonalInformationAddressManager from "./personalInformation/CompanyPersonalInformationAddressManager";
import CompanyPersonalInformationPhoneManager from "./personalInformation/CompanyPersonalInformationPhoneManager";
import {NavsTabVerticalContext} from "components/navs/NavsTab";
import CardHeaderTitleWithFieldsPending from "components/cards/CardHeaderTitleWithFieldsPending";
import { CompanyFileSourceType } from "types/company/companyEnums";

function CompanyPersonalInformationContactInfo() {
    const { completenessPercentage, cancelEditing, updateCompanyFile, dataSource } = useContext(CompanyFileContext);

    const cardProps: any = {
        title: (
            <CardHeaderTitleWithFieldsPending
                title={"Datos de Contacto"}
                missingFields={completenessPercentage?.[CompanyFileCompletenessFields.CompanyContactDataMissingFieldsCount]}
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
                <CompanyPersonalInformationContactInfoChildren />
            </CardEditingWithContext>
        </Stack>
    )
}

function CompanyPersonalInformationContactInfoChildren() {
    const { editing, setEditing } = useContext(CardEditingContext);
    const { loadingForm, cancelEditing, updateCompanyFile } = useContext(CompanyFileContext);
    const { setFuncsOnChangeTab } = useContext(NavsTabVerticalContext);

    const methods = useFormContext();
    const baseNameCompany: string = CompanyFileEditProfileFormFields.Company;
    const isLegalPerson: boolean = !methods.watch(`${CompanyFileEditFormFields.IsPhyisicalPerson}`);

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
            <Grid item xs={12}>
                <CompanyPersonalInformationAddressManager editing={editing}
                                                          baseNameCompany={baseNameCompany}
                />
            </Grid>
            <Grid item xs={12}>
                <CompanyPersonalInformationPhoneManager editing={editing}
                                                        baseNameCompany={baseNameCompany}
                />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <ControlledTextFieldFilled control={methods.control} 
                                           label={'Mail'} 
                                           name={`${baseNameCompany}.${CompanyFields.Mail}`}
                                           disabled={!editing}
                                           fullWidth
                                           loadPending
                />
            </Grid>
            
            {
                !isLegalPerson && (
                    <Grid item xs={12} sm={6}>
                        <ControlledDatePicker control={methods.control} 
                                              label={'Fecha de nacimiento'} 
                                              name={`${baseNameCompany}.${CompanyFields.BirthdayDate}`}
                                              disabled={!editing}
                                              loadPending 
                                              filled
                        />
                    </Grid>
                )
            }
            
            <Grid item xs={12} sm={6}>
                <ControlledTextFieldFilled control={methods.control} 
                                           label={'Sitio Web'} 
                                           name={`${baseNameCompany}.${CompanyFields.Web}`}
                                           disabled={!editing}
                                           fullWidth
                />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <ControlledTextFieldFilled control={methods.control} 
                                           label={'Red Social'} 
                                           name={`${baseNameCompany}.${CompanyFields.SocialNetwork}`}
                                           disabled={!editing}
                                           fullWidth
                />
            </Grid>        
            
            <Grid item xs={12} sm={6}>
                {
                    !loadingForm ?
                        <ControlledRadioYesNo label="¿Es liderada por mujeres?" 
                                              control={methods.control} 
                                              setValue={methods.setValue} 
                                              name={`${baseNameCompany}.${CompanyFields.IsLeadByWoman}`} 
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
                !isLegalPerson &&
                    <Grid item xs={12} sm={6}>
                        {
                            !loadingForm ?
                                <ControlledRadioYesNo name={`${baseNameCompany}.${CompanyViewDTOFields.IsPoliticallyExposed}`} 
                                                      control={methods.control} 
                                                      setValue={methods.setValue} 
                                                      label={'Persona políticamente expuesta (PEP)'}
                                                      disabled={!editing}
                                                      disabledAsInput
                                                      direction="row"
                                />
                                :
                                <Skeleton />
                        }
                    </Grid>
            }
            
            {
                isLegalPerson &&
                <Grid item xs={12} sm={6}>
                    {
                        !loadingForm ?
                            <ControlledRadioYesNo name={`${baseNameCompany}.${CompanyViewDTOFields.HasSocialImpact}`}
                                                  control={methods.control}
                                                  setValue={methods.setValue}
                                                  label={'Tiene Impacto Social'}
                                                  disabled={!editing}
                                                  disabledAsInput
                                                  direction="row"
                            />
                            :
                            <Skeleton />
                    }
                </Grid>
            }
            
        </Grid>
    );
}

export default CompanyPersonalInformationContactInfo;