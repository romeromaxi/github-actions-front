import {Grid, InputAdornment, Skeleton} from '@mui/material';
import { CompanyPersonRelationshipFields } from 'types/company/companySocietyData';
import { PersonMailFields } from 'types/person/personReferentialData';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useFormContext, useFormState } from 'react-hook-form';
import {
  RelationshipEditFormFields,
  RelationshipEditFormType,
} from '../RelatedPersonDetail';
import { CompanyRelatedPersonBaseListContext } from '../CompanyRelatedPersonBaseList';
import AddressFormBoxListManager from '../../components/addresses/AddressFormBoxListManager';
import {AsyncSelect, ControlledCheckBox, ControlledTextFieldFilled} from 'components/forms';
import {HttpCacheCompany, HttpCachePerson, HttpPersonNosis} from 'http/index';
import { CompanyPersonPersonalDataFields } from 'types/company/companyPersonReferentialData';
import { PersonTypes } from 'types/person/personEnums';
import { ControlledDatePicker } from 'components/forms/ControlledDatePicker';
import moment from 'moment';
import PhoneFormBoxList from '../../components/phones/PhoneFormBoxList';
import { LayoutHomeContext } from '../../../../layouts/home/LayoutHome';
import {RefreshIconButton} from "../../../../components/buttons/Buttons";
import {PersonConsultantResponseDTOFields} from "../../../../types/person/personNosisData";
import {CivilStateTypeCode, ModuleCodes} from "../../../../types/general/generalEnums";
import CloseIcon from "@mui/icons-material/Close";
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";

interface RelatedPersonEditComponentProps {
  hasParticipation: boolean;
  setPersonId: (id?: number) => void
}

function RelatedPersonEditComponent({
  hasParticipation, setPersonId
}: RelatedPersonEditComponentProps) {
  const { shouldWarnBeforeSwitch, setShouldWarnBeforeSwitch } =
    useApplicationCommon();
  const [initialShouldWarn, _] = useState<boolean>(shouldWarnBeforeSwitch);

  const { relationshipClassification } = useContext(
    CompanyRelatedPersonBaseListContext,
  );
  const methods = useFormContext<RelationshipEditFormType>();
  const { isDirty, isSubmitted } = useFormState({ control: methods.control });
  const isPhysicalPerson: boolean =
    methods.watch(
      `${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.PersonTypeCode}`,
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

  const loadRelationshipTypes = () => {
    return HttpCacheCompany.getRelationshipTypesByClassification(
      relationshipClassification,
    );
  };
  
  const watchCuit = methods.watch(`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.FiancePersonCuit}`)
  
  const cuitName = `${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.FiancePersonCuit}`
  
  const fianceBusinessName = `${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.FiancePersonBusinessName}`
  
  const syncCuit = () => {
    setLoadingCuit(true)
    HttpPersonNosis.synchronizeWithNosisAndGetPersonId(watchCuit, ModuleCodes.RelatedEntities).then((r) => {
      setPersonId(r[PersonConsultantResponseDTOFields.PersonId])
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

  const watchCivilState = methods.watch(`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.PersonMarritalStatusCode}`)
  
  useEffect(() => {
    if (watchCivilState === CivilStateTypeCode.Married) {
      setEnableFianceForm(true)
    } else {
      setEnableFianceForm(false)
      setPersonId(undefined)
      // @ts-ignore
      methods.setValue(cuitName, '')
      // @ts-ignore
      methods.setValue(fianceBusinessName, '')
    }
  }, [watchCivilState]);

  const renderContactInformation = () => (
    <Grid container item xs={12} spacing={1} alignItems={'center'}>
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
            <ControlledCheckBox label={'¿Es persona expuesta políticamente? (PEP)'}
                                name={`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.IsPolitacllyExposed}`}
                                control={methods.control}
            />
          </Grid>
        }
        {
          isPhysicalPerson && enableFianceForm &&
          <Grid item xs={12} container spacing={2} alignItems='center'>
            <Grid item xs={4}>
              <ControlledTextFieldFilled control={methods.control}
                                         name={`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.FiancePersonCuit}`}
                                         label={'CUIT del Cónyuge'}
                                         InputProps={ !!watchCuit ? {
                                           endAdornment: (
                                               <InputAdornment position='end'>
                                                 <div style={{cursor: 'pointer', marginTop: 1}} onClick={cleanCuit}>
                                                   <CloseIcon fontSize='small' />
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
              />
            </Grid>
            <Grid item xs={7}>
              {
                loadingCuit ?
                    <Skeleton height={'2rem'} sx={{ marginTop: '1rem'}} />
                    :
                    <ControlledTextFieldFilled control={methods.control}
                                               name={`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.FiancePersonBusinessName}`}
                                               label={'Nombre del Cónyuge'}
                                               disabled
                                               fullWidth
                    />
              }
            </Grid>
          </Grid>
        }
      <Grid item xs={12}>
        <PhoneFormBoxList
          phoneListName={RelationshipEditFormFields.Phone}
          notCompanyTab
        />
      </Grid>
    </Grid>
  );

  const renderRelationshipInformation = () => (
    <Grid container item xs={12} spacing={1}>
      <Grid item xs={12} md={6}>
        <AsyncSelect
          loadOptions={loadRelationshipTypes}
          control={methods.control}
          label="Relación"
          name={`${RelationshipEditFormFields.SocietyPerson}.${CompanyPersonRelationshipFields.PersonRelationshipTypeCode}`}
          fullWidth
          filled
        />
      </Grid>
      {hasParticipation && (
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label={'% Participación'}
            control={methods.control}
            name={`${RelationshipEditFormFields.SocietyPerson}.${CompanyPersonRelationshipFields.ParticipationPercent}`}
            currency
            currencyPrefix={''}
            currencySuffix={'%'}
            fullWidth
          />
        </Grid>
      )}
    </Grid>
  );

  const renderPersonalInformation = () => (
    <>
      <Grid item xs={12} md={6}>
        <ControlledTextFieldFilled
          label={'Tipo de Persona'}
          control={methods.control}
          name={`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.PersonTypeDesc}`}
          disabled
        />
      </Grid>
      {isPhysicalPerson && (
        <>
          <Grid item xs={12} md={6}>
            <ControlledTextFieldFilled
              label={'Nro. de Documento'}
              control={methods.control}
              name={`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.DocumentNumber}`}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ControlledDatePicker
              label={'Fecha de Nacimiento'}
              control={methods.control}
              maxDate={moment().toDate()}
              name={`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.BirthdayDate}`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AsyncSelect
              label={'Género'}
              control={methods.control}
              name={`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.GenderCode}`}
              loadOptions={HttpCachePerson.getGenderTypes}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AsyncSelect
              label={'Estado Civil'}
              control={methods.control}
              name={`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.PersonMarritalStatusCode}`}
              loadOptions={HttpCachePerson.getMaritalStatusTypes}
            />
          </Grid>
        </>
      )}
      <Grid item xs={12} md={6}>
        <AsyncSelect
          label={'Condición Frente IVA'}
          control={methods.control}
          name={`${RelationshipEditFormFields.PersonInformation}.${CompanyPersonPersonalDataFields.PersonResponsibilityTypeCode}`}
          loadOptions={HttpCachePerson.getAfipResponsiblityTypes}
        />
      </Grid>
    </>
  );

  return (
    <Grid container spacing={1}>
      {renderRelationshipInformation()}

      {renderPersonalInformation()}

      {renderContactInformation()}

      <Grid container item xs={12}>
        <FormProvider {...methods}>
          <AddressFormBoxListManager
            addressFieldName={RelationshipEditFormFields.AddressList}
            addressPerRow={1}
            disableFiscalAddress
          />
        </FormProvider>
      </Grid>
    </Grid>
  );
}

export default RelatedPersonEditComponent;
