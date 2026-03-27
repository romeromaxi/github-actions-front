import React, {useContext, useEffect, useMemo} from "react";
import {useFormContext} from "react-hook-form";
import {Grid, Skeleton, Stack} from "@mui/material";
import CardEditingWithContext, {CardEditingContext} from "components/cards/CardEditingWithContext";
import {
    CompanyActivityFields,
    CompanyAfipActivityFields,
} from "types/company/companyActivityData";
import {CompanyFileEditProfileFormFields} from "../homesEdit/CompanyFileHomeEditProfile";
import {TextFieldBase} from "components/forms/TextFieldBase";
import {ControlledRadioYesNo, ControlledTextFieldFilled} from "components/forms";
import {CompanyFileContext, CompanyFileEditFormFields} from "hooks/contexts/CompanyFileContext";
import {NavsTabVerticalContext} from "components/navs/NavsTab";
import CardHeaderTitleWithFieldsPending from "components/cards/CardHeaderTitleWithFieldsPending";
import {CompanyFileCompletenessFields} from "types/company/companyData";
import { CompanyFileSourceType } from "types/company/companyEnums";

function CompanyPersonalInformationActivityInfo() {
    const { completenessPercentage, cancelEditing, updateCompanyFile, dataSource } = useContext(CompanyFileContext);

    const cardProps: any = {
        title: (
            <CardHeaderTitleWithFieldsPending
                title={"Actividad"}
                missingFields={completenessPercentage?.[CompanyFileCompletenessFields.CompanyActivityMissingFieldsCount]}
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
                <CompanyPersonalInformationActivityInfoChildren />
            </CardEditingWithContext>
        </Stack>
    )
}

function CompanyPersonalInformationActivityInfoChildren () {
    const { editing, setEditing } = useContext(CardEditingContext);
    const { loading, loadingForm, cancelEditing, updateCompanyFile } = useContext(CompanyFileContext);
    const { setFuncsOnChangeTab } = useContext(NavsTabVerticalContext);

    const methods = useFormContext();
    const baseNameActivity: string = CompanyFileEditProfileFormFields.Activity;

    const afipActivity = methods.watch(CompanyFileEditFormFields.AfipActivity);
    const loadingAct = useMemo(() => (loading || loadingForm), [loading, loadingForm]);


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
                {
                    !loadingAct ?
                        <TextFieldBase label={'Sector / Rubro'}
                                       value={`${afipActivity?.[CompanyAfipActivityFields.AfipSectorDesc]} / ${afipActivity?.[CompanyAfipActivityFields.AfipAreaDesc]}`} 
                                       disabled
                        />
                        :
                        <Skeleton />
                }
            </Grid>
            <Grid item xs={12}>
                {
                    !loadingAct ?
                        <TextFieldBase label={'Actividad'}
                                       value={afipActivity?.[CompanyAfipActivityFields.AfipActivityDesc] || ''}
                                       disabled
                        />
                        :
                        <Skeleton />
                }
            </Grid>
            
            <Grid item xs={12} sm={6}>
                {
                    !loadingForm ?
                        <ControlledRadioYesNo label="¿Es exportadora?"
                                              control={methods.control}
                                              setValue={methods.setValue}
                                              name={`${baseNameActivity}.${CompanyActivityFields.IsExporter}`}
                                              loadPending
                                              disabledAsInput
                                              disabled={!editing}
                                              direction="row"
                        />
                        :
                        <Skeleton />
                }
            </Grid>

            <Grid item xs={12} sm={6}>
                {
                    !loadingForm ?
                        <ControlledRadioYesNo label="¿Es empleadora?"
                                              control={methods.control}
                                              setValue={methods.setValue}
                                              name={`${baseNameActivity}.${CompanyActivityFields.IsEmployer}`}
                                              loadPending
                                              disabledAsInput
                                              disabled={!editing}
                                              direction="row"
                        />
                        :
                        <Skeleton />
                }
            </Grid>
            
            <Grid item xs={12}>
                <ControlledTextFieldFilled label="Descripción" 
                                           control={methods.control} 
                                           name={`${baseNameActivity}.${CompanyActivityFields.ActivityDesc}`} 
                                           loadPending 
                                           multiline 
                                           rows={3} 
                                           maxRows={6}
                                           disabled={!editing}
                                           fullWidth
                />
            </Grid>
        </Grid>
    )
}

export default CompanyPersonalInformationActivityInfo;