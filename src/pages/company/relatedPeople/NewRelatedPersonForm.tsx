import React, { useContext, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import { Alert, Grid } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { DefaultStylesButton } from 'components/buttons/Buttons';
import { DisclaimerNosis } from 'components/text/DisclaimerNosis';
import { AsyncSelect } from 'components/forms';

import { PersonConsultantResponseDTOFields } from 'types/person/personNosisData';
import { PersonRelationshipTypeClassification } from 'types/company/companyEnums';
import {
  CompanyPersonRelationshipFields,
  CompanyPersonRelationshipInsert,
} from 'types/company/companySocietyData';

import { HttpCacheCompany, HttpPerson, HttpPersonNosis } from 'http/index';
import {
  RequiredCuitSchema,
  RequiredPercentSchema,
  RequiredSchema,
  RequiredSelectSchema,
  RequiredStringSchema,
} from 'util/validation/validationSchemas';
import { NewRelatedPersonContext } from './NewRelatedPersonDialog';
import { ControlledTextFieldFilled } from '../../../components/forms';
import {ModuleCodes} from "../../../types/general/generalEnums";

interface NewRelatedPersonFormProps {
  relationshipTypeClassification: PersonRelationshipTypeClassification;
}

function NewRelatedPersonForm(props: NewRelatedPersonFormProps) {
  const {
    personData,
    setPersonData,
    setPersonRelationship,
    setLoading,
    setPersonFiscalAddress,
  } = useContext(NewRelatedPersonContext);

  const [error, setError] = useState<string>();
  const hasParticipation: boolean =
    props.relationshipTypeClassification ===
    PersonRelationshipTypeClassification.Society;
  const disabledInputs: boolean = !!personData;

  const NewPersonTypeFormSchema = yup.object().shape({
    [CompanyPersonRelationshipFields.PersonRelationshipTypeCode]:
      RequiredSelectSchema,
    [CompanyPersonRelationshipFields.ParticipationPercent]: hasParticipation
      ? RequiredPercentSchema
      : yup.mixed(),
    [CompanyPersonRelationshipFields.CUIT]: RequiredCuitSchema,
  });

  const { control, handleSubmit, getValues } =
    useForm<CompanyPersonRelationshipInsert>({
      resolver: yupResolver(NewPersonTypeFormSchema),
    });

  const onHandleSubmit = (data: CompanyPersonRelationshipInsert) => {
    setLoading(true);
    setError(undefined);

    HttpPersonNosis.synchronizeWithNosisAndGetPersonId(
      data[CompanyPersonRelationshipFields.CUIT], ModuleCodes.RelatedEntities
    )
      .then((personConsultantResponse) => {
        if (personConsultantResponse[PersonConsultantResponseDTOFields.Valid]) {
          HttpPerson.getById(
            personConsultantResponse[
              PersonConsultantResponseDTOFields.PersonId
            ],
          ).then((person) => {
            setLoading(false);
            setPersonData(person);
            setPersonFiscalAddress(
              personConsultantResponse[
                PersonConsultantResponseDTOFields.FiscalAddress
              ],
            );
            setPersonRelationship({
              ...data,
              [CompanyPersonRelationshipFields.PersonId]:
                personConsultantResponse[
                  PersonConsultantResponseDTOFields.PersonId
                ],
            });
          });
        } else {
          setLoading(false);
          setError(
            `El CUIT: ${getValues(CompanyPersonRelationshipFields.CUIT)} no existe. Por favor ingréselo nuevamente.`,
          );
        }
      })
      .catch(() => {
        setLoading(false);
        setError(
          'Al parecer ha ocurrido un error, por favor intente nuevamente.',
        );
      });
  };

  const loadRelationshipTypes = () => {
    return HttpCacheCompany.getRelationshipTypesByClassification(
      props.relationshipTypeClassification,
    );
  };

  return (
    <form onSubmit={handleSubmit(onHandleSubmit)}>
      <Grid container spacing={1}>
        {error && !personData && (
          <Grid item xs={12}>
            <Alert severity={'error'}>{error}</Alert>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <AsyncSelect
            loadOptions={loadRelationshipTypes}
            control={control}
            label="Relación"
            name={CompanyPersonRelationshipFields.PersonRelationshipTypeCode}
            disabled={disabledInputs}
            fullWidth
          />
        </Grid>

        {hasParticipation && (
          <Grid item xs={12} sm={6}>
            <ControlledTextFieldFilled
              label={'% Participación'}
              control={control}
              name={CompanyPersonRelationshipFields.ParticipationPercent}
              fullWidth
              disabled={disabledInputs}
              currency
              currencyPrefix={''}
              currencySuffix={'%'}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <ControlledTextFieldFilled
            label="CUIT"
            control={control}
            name={CompanyPersonRelationshipFields.CUIT}
            fullWidth
            disabled={disabledInputs}
          />
        </Grid>

        <Grid item xs={12}>
          <DisclaimerNosis opacity={disabledInputs} />
        </Grid>

        <Grid item xs={12} textAlign={'end'}>
          {!personData && (
            <DefaultStylesButton
              type="submit"
              endIcon={<KeyboardDoubleArrowRightIcon />}
            >
              Enviar
            </DefaultStylesButton>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default NewRelatedPersonForm;
