import CompanyLabelWithValueComponent, {
    CompanyLabelWithValueComponentForm
} from "./components/CompanyLabelWithValueComponent";
import {Stack, Theme, useMediaQuery} from "@mui/material";
import React, {useEffect, useState} from "react";
import {CompanyForm, CompanyViewDTOFields} from "../../../types/company/companyData";
import {
    CompanyActivity,
    CompanyActivityFields,
    CompanyActivityView,
    CompanyAfipActivityFields,
    CompanyAfipActivityView
} from "../../../types/company/companyActivityData";
import {HttpCompanyAfipActivity} from "../../../http/company/httpCompanyActivity";
import {Skeleton} from "@mui/lab";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {useFormContext} from "react-hook-form";
import {CompanyFileEditProfileFormFields} from "../homesEdit/CompanyFileHomeEditProfile";
import {ControlledRadioYesNo, ControlledTextFieldFilled} from "../../../components/forms";
import {CompanyFileEditFormFields} from "../../../hooks/contexts/CompanyFileContext";


interface CompanyActivityDataSectionProps {
    company: CompanyForm,
    activity: CompanyActivityView
}


const CompanyActivityDataSection = ({activity} : CompanyActivityDataSectionProps) => {
    const { watch } = useFormContext();
    const afipActivity = watch(CompanyFileEditFormFields.AfipActivity);
    
    return (
        <Stack spacing={1}>
            <CompanyLabelWithValueComponent label={'Sector / Rubro'}
                                            value={afipActivity && `${afipActivity[CompanyAfipActivityFields.AfipSectorDesc]} / ${afipActivity[CompanyAfipActivityFields.AfipAreaDesc]}`}
            />
            <CompanyLabelWithValueComponent label={'Actividad'} value={afipActivity && afipActivity[CompanyAfipActivityFields.AfipActivityDesc]} labelHelper={'Actividad inscripta en ARCA'}/>
            <CompanyLabelWithValueComponent label={'¿Es exportadora?'} value={activity[CompanyActivityFields.IsExporter] !== null ? activity[CompanyActivityFields.IsExporter] ? 'Si' : 'No' : '-'} />
            <CompanyLabelWithValueComponent label={'¿Es empleadora?'} value={activity[CompanyActivityFields.IsEmployer] !== null ? activity[CompanyActivityFields.IsEmployer] ? 'Si' : 'No' : '-'} />
            <CompanyLabelWithValueComponent label={'Descripción'} value={activity[CompanyActivityFields.ActivityDesc]} />
        </Stack>
    )
}

interface CompanyFileActivityDataSectionProps {
    activity: CompanyActivity,
    afipActivity: CompanyAfipActivityView
}

export const CompanyFileActivityDataSection = ({activity, afipActivity} : CompanyFileActivityDataSectionProps) => {
    return (
        <Stack spacing={1}>
            <CompanyLabelWithValueComponent label={'Sector / Rubro'}
                                            value={afipActivity && `${afipActivity[CompanyAfipActivityFields.AfipSectorDesc]} / ${afipActivity[CompanyAfipActivityFields.AfipAreaDesc]}`}
            />
            <CompanyLabelWithValueComponent label={'Actividad'} value={afipActivity && afipActivity[CompanyAfipActivityFields.AfipActivityDesc]} />
            <CompanyLabelWithValueComponent label={'¿Es exportadora?'} value={activity[CompanyActivityFields.IsExporter] !== null ? activity[CompanyActivityFields.IsExporter] ? 'Si' : 'No' : '-'} />
            <CompanyLabelWithValueComponent label={'¿Es empleadora?'} value={activity[CompanyActivityFields.IsEmployer] !== null ? activity[CompanyActivityFields.IsEmployer] ? 'Si' : 'No' : '-'} />
            <CompanyLabelWithValueComponent label={'Descripción'} value={activity[CompanyActivityFields.ActivityDesc]} />
        </Stack>
    )
}


export const CompanyActivityDataSectionEdit = ({company} : CompanyActivityDataSectionProps) => {
    const [afipActivity, setAfipActivity] = useState<CompanyAfipActivityView>();
    const [loadingAct, setLoadingAct] = useState<boolean>(false)
    const methods = useFormContext()
    const baseNameCompany: string = CompanyFileEditProfileFormFields.Company;
    const baseNameActivity: string = CompanyFileEditProfileFormFields.Activity;
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    const isLoading: boolean =
        methods.watch(`${baseNameCompany}.${CompanyViewDTOFields.CUIT}`) ==
        undefined;
    
    const searchMainActivity = () => {
        setLoadingAct(true);
        HttpCompanyAfipActivity.getByCompanyId(company[EntityWithIdFields.Id]).then(
            (listActivities) => {
                setAfipActivity(
                    listActivities.filter(
                        (x) => x[CompanyAfipActivityFields.IsMainActivity],
                    )[0] ?? undefined,
                );
                setLoadingAct(false);
            },
        );
    };

    useEffect(() => {
        searchMainActivity();
    }, [])
    
    
    return (

        <Stack spacing={2}>
            {
                !loadingAct ?
                    <CompanyLabelWithValueComponentForm label={"Sector / Rubro"}
                                                        value={`${afipActivity?.[CompanyAfipActivityFields.AfipSectorDesc]} / ${afipActivity?.[CompanyAfipActivityFields.AfipAreaDesc]}`}
                    />
                    :
                    <Skeleton />
            }
            {
                !loadingAct ?
                    <CompanyLabelWithValueComponentForm label={"Actividad"}
                                                        value={afipActivity?.[CompanyAfipActivityFields.AfipActivityDesc] || ''}
                                                        labelHelper={'Actividad inscripta en ARCA'}
                    />
                    :
                    <Skeleton />
            }
            <Stack direction={isMobileScreenSize ? 'column' : 'row'} alignItems={isMobileScreenSize ? 'flex-start' : 'center'} 
                justifyContent={isMobileScreenSize ? 'flex-start' : 'space-between'} sx={{paddingX: '8px'}} spacing={2}>
                {
                    !isLoading ?
                        <ControlledRadioYesNo
                            label="¿Es exportadora?"
                            control={methods.control}
                            setValue={methods.setValue}
                            name={`${baseNameActivity}.${CompanyActivityFields.IsExporter}`}
                            loadPending
                            row
                        />
                        :
                        <Skeleton />
                }
                {
                    !isLoading ?
                        <ControlledRadioYesNo
                            label="¿Es empleadora?"
                            control={methods.control}
                            setValue={methods.setValue}
                            name={`${baseNameActivity}.${CompanyActivityFields.IsEmployer}`}
                            loadPending
                            row
                        />
                        :
                        <Skeleton />
                }
            </Stack>
            <ControlledTextFieldFilled
                label="Descripción"
                control={methods.control}
                name={`${baseNameActivity}.${CompanyActivityFields.ActivityDesc}`}
                loadPending
                multiline
                rows={3}
                maxRows={6}
                fullWidth
            />
        </Stack>
    )
}


export default CompanyActivityDataSection