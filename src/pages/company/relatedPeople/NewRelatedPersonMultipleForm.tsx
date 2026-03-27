import React, {useContext, useState} from 'react';
import * as yup from 'yup';
import {FormProvider, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup/dist/yup';

import {Alert, Box, Button, Stack} from '@mui/material';

import {PersonConsultantResponseDTOFields} from 'types/person/personNosisData';

import {HttpPerson, HttpPersonNosis} from 'http/index';
import {
    REQUIRED_FIELD_MESSAGE,
    RequiredCuitSchema,
    RequiredPercentSchema,
    RequiredStringSchema,
} from 'util/validation/validationSchemas';
import {ControlledTextFieldFilled} from 'components/forms';
import RelatedPersonRelationshipComponent from './components/RelatedPersonRelationshipComponent';
import {EntityAddressInsert} from "../../../types/general/generalReferentialData";
import {
    PersonFields, PersonRelationshipFields, PersonRelationshipFormFields, PersonRelationshipInsert,
    PersonRelationshipInsertFormType, PersonView
} from "../../../types/person/personData";
import {NewConfirmationCuit} from "../../../components/text/ConfirmationCuit";
import {WrapperIcons} from "../../../components/icons/Icons";
import {X} from "@phosphor-icons/react";
import {DisclaimerNosis} from "../../../components/text/DisclaimerNosis";
import {PersonAddressFields} from "../../../types/person/personReferentialData";
import {useLoaderActions} from "../../../hooks/useLoaderActions";
import {RelatedPersonContext} from "../../../hooks/contexts/RelatedPersonContext";
import {ModuleCodes} from "../../../types/general/generalEnums";

interface NewRelatedPersonMultipleFormProps {
  legalPerson?: boolean;
  onChangeDisable: () => void;
  onSubmit: (id: number) => void
}


enum NewCuitRelatedPersonFormFields {
    CUIT = 'cuit'
}

interface NewCuitRelatedPersonForm {
    [NewCuitRelatedPersonFormFields.CUIT]: string
}

function NewRelatedPersonMultipleForm(
  props: NewRelatedPersonMultipleFormProps,
) {
    const { handleNew } = useContext(RelatedPersonContext);
    const [confirmedPersonData, setConfirmedPersonData] = useState<boolean>(false);
    const [personData, setPersonData] = useState<PersonView>();
  const { showLoader, hideLoader } = useLoaderActions();
  const [error, setError] = useState<string>();
  const [personId, setPersonId] = useState<number>()
  const [personFiscalAddress, setPersonFiscalAddress] =
    useState<EntityAddressInsert>();
  const NewPersonTypeFormSchema = yup
    .object()
    .test(
      PersonRelationshipFields.ParticipationPercent,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (
          !props.legalPerson ||
          !obj[PersonRelationshipFormFields.IsMember]
        )
          return true;

        let errorDesc;
        try {
          await RequiredPercentSchema.validate(
            obj[PersonRelationshipFields.ParticipationPercent],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${PersonRelationshipFields.ParticipationPercent}`,
          );

        return true;
      },
    )
    .test(
      PersonRelationshipFields.PositionSpouseDesc,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (
          props.legalPerson ||
          !obj[PersonRelationshipFormFields.IsSpouse]
        )
          return true;

        let errorDesc;
        try {
          await RequiredStringSchema.validate(
            obj[PersonRelationshipFields.PositionSpouseDesc],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${PersonRelationshipFields.PositionSpouseDesc}`,
          );

        return true;
      },
    )
    .test(
      PersonRelationshipFields.PositionAuthorityDesc,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (!obj[PersonRelationshipFormFields.IsAuthority]) return true;

        let errorDesc;
        try {
          await RequiredStringSchema.validate(
            obj[PersonRelationshipFields.PositionAuthorityDesc],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${PersonRelationshipFields.PositionAuthorityDesc}`,
          );

        return true;
      },
    )
    .test(
      PersonRelationshipFields.PositionEmployeeDesc,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (!obj[PersonRelationshipFormFields.IsEmployee]) return true;

        let errorDesc;
        try {
          await RequiredStringSchema.validate(
            obj[PersonRelationshipFields.PositionEmployeeDesc],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${PersonRelationshipFields.PositionEmployeeDesc}`,
          );

        return true;
      },
    )
    .test(
      PersonRelationshipFields.PositionOthersDesc,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (!obj[PersonRelationshipFormFields.IsOther]) return true;

        let errorDesc;
        try {
          await RequiredStringSchema.validate(
            obj[PersonRelationshipFields.PositionOthersDesc],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${PersonRelationshipFields.PositionOthersDesc}`,
          );

        return true;
      },
    );
  
  const NewCuitSchema =  yup
      .object()
      .shape({
          [PersonRelationshipFields.CUIT]: RequiredCuitSchema,
      })

  const methods = useForm<PersonRelationshipInsertFormType>({
    resolver: yupResolver(NewPersonTypeFormSchema),
  });
  
  const { control, watch, handleSubmit } = useForm<NewCuitRelatedPersonForm>({
      resolver: yupResolver(NewCuitSchema)
  })

    const watchCuit = watch(NewCuitRelatedPersonFormFields.CUIT)
    const onHandleSubmitCuit = (data: NewCuitRelatedPersonForm) => {
        showLoader();
        setError(undefined);
        setPersonData(undefined)
        

        HttpPersonNosis.synchronizeWithNosisAndGetPersonId(
            data[PersonRelationshipFields.CUIT], ModuleCodes.RelatedEntities
        )
            .then((personConsultantResponse) => {
                if (personConsultantResponse[PersonConsultantResponseDTOFields.Valid]) {
                    props.onChangeDisable()
                    setPersonId(personConsultantResponse[PersonConsultantResponseDTOFields.PersonId])
                    HttpPerson.getById(
                        personConsultantResponse[
                            PersonConsultantResponseDTOFields.PersonId
                            ],
                    ).then((person) => {
                        hideLoader();
                        setPersonData(person);
                        setConfirmedPersonData(true);
                        
                        const hasFiscalAddress = 
                            !!personConsultantResponse[PersonConsultantResponseDTOFields.FiscalAddress] &&
                            !!personConsultantResponse[PersonConsultantResponseDTOFields.FiscalAddress][PersonAddressFields.StreetWithNumber];
                        
                        setPersonFiscalAddress(hasFiscalAddress ? 
                            personConsultantResponse[PersonConsultantResponseDTOFields.FiscalAddress] :
                            undefined
                        );
                    });
                } else {
                    hideLoader();
                    setError(
                        `El CUIT: ${watchCuit} no existe. Por favor ingréselo nuevamente.`,
                    );
                }
            })
            .catch(() => {
                hideLoader();
                setError(
                    'Al parecer ha ocurrido un error, por favor intente nuevamente.',
                );
            });
    };
  
  const onHandleSubmitAll = (data: PersonRelationshipInsert) => {
      if (personId) {
          const personRelationship: PersonRelationshipInsert = {
              ...data,
              [PersonRelationshipFields.PersonId]: personId
          }
    
          handleNew(personRelationship, personFiscalAddress, () => props.onSubmit(personId))
      }
  }
  
  const onCloseForm = () => {
      setPersonData(undefined)
      setConfirmedPersonData(false)
      methods.reset(undefined)
      props.onChangeDisable()
  }
  
  const onHandleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      methods.handleSubmit(onHandleSubmitAll)(e)
  }
  
  return (
    <form onSubmit={onHandleFormSubmit} id={'form-new-related-person'}>
        <Stack spacing={2} sx={{width: '98%'}}>
            {error && !personData && (
                <Alert severity={'error'}>{error}</Alert>
            )}
            <DisclaimerNosis opacity={!!personData} />
                <ControlledTextFieldFilled
                    label="CUIT"
                    control={control}
                    name={NewCuitRelatedPersonFormFields.CUIT}
                    fullWidth
                    InputProps={{
                        sx: {borderRadius: '100px !important'},
                        endAdornment:
                            confirmedPersonData ?
                                <Box onClick={onCloseForm} sx={{'&:hover': {cursor: 'pointer'}}}>
                                    <WrapperIcons Icon={X} size={'sm'}/>
                                </Box>
                                :
                                <Button variant={'contained'}
                                        color={'primary'}
                                        onClick={handleSubmit(onHandleSubmitCuit)}
                                        size={'small'}
                                        disabled={!watchCuit || watchCuit === ''}
                                        sx={{borderRadius: '100px'}}
                                >
                                    Validar
                                </Button>
                    }}
                />
            {confirmedPersonData && personData &&
                <NewConfirmationCuit
                    cuit={personData[PersonFields.CUIT]}
                    legalName={personData[PersonFields.LegalName]}
                />
            }
            {confirmedPersonData &&
                <FormProvider {...methods}>
                    <RelatedPersonRelationshipComponent
                        legalPerson={props.legalPerson}
                        disabledInputs={!personData}
                    />
                </FormProvider>
            }
        </Stack>
    </form>
  );
}


export default NewRelatedPersonMultipleForm