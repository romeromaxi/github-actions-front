import {Divider, Grid, InputAdornment, Stack} from '@mui/material';
import {PersonMailFields} from 'types/person/personReferentialData';
import React, {useEffect, useState} from 'react';
import {FormProvider, useFormContext, useFormState} from 'react-hook-form';
import AddressFormBoxListManager from '../../components/addresses/AddressFormBoxListManager';
import {AsyncSelect, ControlledCheckBox, ControlledTextFieldFilled} from 'components/forms';
import {HttpCachePerson, HttpPersonNosis} from 'http/index';
import {PersonTypes} from 'types/person/personEnums';
import {ControlledDatePicker} from 'components/forms/ControlledDatePicker';
import moment from 'moment';
import PhoneFormBoxList from '../../components/phones/PhoneFormBoxList';
import RelatedPersonRelationshipComponent from './RelatedPersonRelationshipComponent';
import {
    RelationshipEditFormFields,
    RelationshipEditFormType,
} from '../RelatedPersonMultipleRelationshipDetail';
import {RefreshIconButton} from "components/buttons/Buttons";
import {PersonConsultantResponseDTOFields} from "types/person/personNosisData";
import {CivilStateTypeCode, ModuleCodes} from "types/general/generalEnums";
import {Skeleton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import {PersonPersonalDataFields} from "types/person/personData";
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
import {TypographyBase} from "components/misc/TypographyBase";

interface RelatedPersonMultipleRelationshipEditComponentProps {
    legalPerson?: boolean;
    setPersonId: (id?: number) => void;
}

function RelatedPersonMultipleRelationshipEditComponent(
    props: RelatedPersonMultipleRelationshipEditComponentProps,
) {
    const {shouldWarnBeforeSwitch, setShouldWarnBeforeSwitch} =
        useApplicationCommon();
    const [initialShouldWarn, _] = useState<boolean>(shouldWarnBeforeSwitch);
    const methods = useFormContext<RelationshipEditFormType>();
    const {isDirty, isSubmitted} = useFormState({control: methods.control});
    const isPhysicalPerson: boolean =
        methods.watch(
            `${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.PersonTypeCode}`,
        ) === PersonTypes.Physical;

    const [enableFianceForm, setEnableFianceForm] = useState<boolean>(false)
    const [loadingCuit, setLoadingCuit] = useState<boolean>(false)

    useEffect(() => {
        if (isDirty) {
            setShouldWarnBeforeSwitch(isDirty);
        }
    }, [isDirty]);

    useEffect(() => {
        if (isSubmitted && !initialShouldWarn) {
            setShouldWarnBeforeSwitch(false);
        }
    }, [isSubmitted]);

    const watchCuit = methods.watch(`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.FiancePersonCuit}`)
    const cuitName = `${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.FiancePersonCuit}`

    const fianceBusinessName = `${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.FiancePersonBusinessName}`
    const syncCuit = () => {
        setLoadingCuit(true)
        HttpPersonNosis.synchronizeWithNosisAndGetPersonId(watchCuit, ModuleCodes.RelatedEntities).then((r) => {
            props.setPersonId(r[PersonConsultantResponseDTOFields.PersonId])
            // @ts-ignore
            methods.setValue(fianceBusinessName, r[PersonConsultantResponseDTOFields.BusinessName])
            setLoadingCuit(false)
        })
    }

    const cleanCuit = () => {
        if (!!watchCuit) {
            // @ts-ignore
            methods.setValue(cuitName, '')
            // @ts-ignore
            methods.setValue(fianceBusinessName, '')
        }
    }

    const watchCivilState = methods.watch(`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.PersonMarritalStatusCode}`)

    useEffect(() => {
        if (watchCivilState == CivilStateTypeCode.Married) {
            setEnableFianceForm(true)
        } else {
            setEnableFianceForm(false)
            props.setPersonId(undefined)
        }
    }, [watchCivilState]);

    const renderContactInformation = () => (
        <Grid container item xs={12} spacing={3} alignItems={'center'}>
            <Grid item xs={12} md={6}>
                <ControlledTextFieldFilled
                    label={'Mail'}
                    control={methods.control}
                    name={`${[RelationshipEditFormFields.Mail]}.${PersonMailFields.Mail}`}
                    fullWidth
                />
            </Grid>
            {
                isPhysicalPerson &&
                <Grid item xs={12} md={6} mt={2}>
                    <ControlledCheckBox
                        name={`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.IsPolitacllyExposed}`}
                        control={methods.control}
                        label={'¿Es persona expuesta políticamente? (PEP)'}
                    />
                </Grid>
            }
            {
                isPhysicalPerson && enableFianceForm &&
                <Grid item xs={12} container spacing={2} alignItems='center'>
                    <Grid item xs={4}>
                        <ControlledTextFieldFilled control={methods.control}
                                                   name={`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.FiancePersonCuit}`}
                                                   label={'CUIT del Cónyuge'}
                                                   InputProps={!!watchCuit ? {
                                                       endAdornment: (
                                                           <InputAdornment position='end'>
                                                               <div style={{cursor: 'pointer', marginTop: 1}}
                                                                    onClick={cleanCuit}>
                                                                   <CloseIcon fontSize='small'/>
                                                               </div>
                                                           </InputAdornment>
                                                       )
                                                   } : <></>}
                                                   fullWidth
                        />
                    </Grid>
                    <Grid item xs={1} mt={3}>
                        <RefreshIconButton tooltipTitle={'Sincronizar CUIT'}
                                           onClick={syncCuit}
                                           color='primary'
                                           size='large'
                        />
                    </Grid>
                    <Grid item xs={7}>
                        {
                            loadingCuit ?
                                <Skeleton height={'2rem'} sx={{marginTop: '1rem'}}/>
                                :
                                <ControlledTextFieldFilled control={methods.control}
                                                           name={`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.FiancePersonBusinessName}`}
                                                           label={'Nombre del Cónyuge'}
                                                           disabled
                                                           fullWidth
                                />
                        }
                    </Grid>
                </Grid>
            }
            <Grid item xs={12}>
                <Divider/>
            </Grid>

            <Grid item xs={12}>
                <Stack spacing={-1}>
                    <TypographyBase variant={'h6'}>
                        Teléfonos
                    </TypographyBase>
                    <PhoneFormBoxList
                        phoneListName={RelationshipEditFormFields.Phone}
                        notCompanyTab
                    />
                </Stack>
            </Grid>

            <Grid item xs={12}>
            </Grid>
        </Grid>
    );

    const renderPersonalInformation = () => (
        <>
            <Grid item xs={12}>
                <Divider/>
            </Grid>

            <Grid item xs={12}>
                <TypographyBase variant={'h6'}>
                    Información Personal
                </TypographyBase>
            </Grid>

            <Grid item xs={12} md={6}>
                <ControlledTextFieldFilled
                    label={'Tipo de Persona'}
                    control={methods.control}
                    name={`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.PersonTypeDesc}`}
                    disabled
                />
            </Grid>
            {isPhysicalPerson && (
                <>
                    <Grid item xs={12} md={6}>
                        <ControlledTextFieldFilled
                            label={'Nro. de Documento'}
                            control={methods.control}
                            name={`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.DocumentNumber}`}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <ControlledDatePicker
                            label={'Fecha de Nacimiento'}
                            control={methods.control}
                            maxDate={moment().toDate()}
                            name={`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.BirthdayDate}`}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <AsyncSelect
                            label={'Género'}
                            control={methods.control}
                            name={`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.GenderCode}`}
                            loadOptions={HttpCachePerson.getGenderTypes}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <AsyncSelect
                            label={'Estado Civil'}
                            control={methods.control}
                            name={`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.PersonMarritalStatusCode}`}
                            loadOptions={HttpCachePerson.getMaritalStatusTypes}
                        />
                    </Grid>
                </>
            )}
            <Grid item xs={12} md={6}>
                <AsyncSelect
                    label={'Condición Frente IVA'}
                    control={methods.control}
                    name={`${RelationshipEditFormFields.PersonInformation}.${PersonPersonalDataFields.PersonResponsibilityTypeCode}`}
                    loadOptions={HttpCachePerson.getAfipResponsiblityTypes}
                    filled
                />
            </Grid>
        </>
    );

    return (
        <Grid container spacing={3} sx={{marginTop: '-24px !important', marginLeft: '-24px !important'}}>
            {renderPersonalInformation()}

            {renderContactInformation()}

            <Grid container item xs={12}>
                <FormProvider {...methods}>
                    <Stack gap={0.8} width={1}>
                        <Divider />
                        <AddressFormBoxListManager
                            addressFieldName={RelationshipEditFormFields.AddressList}
                            addressPerRow={1}
                            disableFiscalAddress
                        />
                    </Stack>
                </FormProvider>
            </Grid>

            <Grid container item xs={12}>
                <Grid container spacing={3} mb={0.5}>
                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                        <TypographyBase variant={'h6'}>
                            Relaciones
                        </TypographyBase>
                    </Grid>

                    <Grid item xs={12}>
                        <FormProvider {...methods}>
                            <RelatedPersonRelationshipComponent
                                name={RelationshipEditFormFields.SocietyPerson}
                                legalPerson={props.legalPerson} alreadyRendered
                            />
                        </FormProvider>
                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    );
}

export default RelatedPersonMultipleRelationshipEditComponent;
