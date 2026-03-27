import React, { useEffect, useState } from 'react';

import { CardContent, Dialog, Grid } from '@mui/material';

import { LoaderBlockUI } from 'components/loader';

import { PersonView } from 'types/person/personData';
import { PersonRelationshipTypeClassification } from 'types/company/companyEnums';
import {
  CompanyPersonRelationshipFields,
  CompanyPersonRelationshipInsert,
} from 'types/company/companySocietyData';

import { HttpCompanyPersonAddress } from 'http/index';
import { HttpCompanyRelationship } from 'http/company/httpCompanyRelationship';

import { BaseResponseFields } from 'types/baseEntities';
import { EntityAddressInsert } from 'types/general/generalReferentialData';

import NewRelatedPersonForm from './NewRelatedPersonForm';
import NewRelatedPersonConfirmData from './NewRelatedPersonConfirmData';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import { useAction } from 'hooks/useAction';

interface NewRelatedPersonDialogProps {
  show: boolean;
  title: string;
  companyId: number;
  relationshipTypeClassification: PersonRelationshipTypeClassification;
  onCloseDrawer: () => void;
  onFinishProcess: (personId: number, relationshipCode: number) => void;
}

export const NewRelatedPersonContext = React.createContext({
  setLoading: (loading: boolean) => {},
  personData: {} as PersonView | undefined,
  setPersonData: (person: PersonView | undefined) => {},
  personRelationship: {} as CompanyPersonRelationshipInsert | undefined,
  setPersonRelationship: (
    relationship: CompanyPersonRelationshipInsert | undefined,
  ) => {},
  confirmedPersonData: false,
  setConfirmedPersonData: (isConfirm: boolean) => {},
  setPersonFiscalAddress: (fiscalAddress: EntityAddressInsert) => {},
});

function NewRelatedPersonDialog(props: NewRelatedPersonDialogProps) {
  const { snackbarSuccess, snackbarError } = useAction();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [confirmedPersonData, setConfirmedPersonData] =
    useState<boolean>(false);

  const [personData, setPersonData] = useState<PersonView>();
  const [personRelationship, setPersonRelationship] =
    useState<CompanyPersonRelationshipInsert>();
  const [personFiscalAddress, setPersonFiscalAddress] =
    useState<EntityAddressInsert>();

  const resetForm = () => {
    setPersonData(undefined);
    setPersonRelationship(undefined);
    setConfirmedPersonData(false);
  };

  const onHandleClose = () => {
    props.onCloseDrawer();
    resetForm();
  };

  const onHandleSubmitClose = (personId: number, relationshipCode: number) => {
    props.onFinishProcess(personId, relationshipCode);
    resetForm();

    snackbarSuccess('La relación se ha creado con éxito');
  };

  useEffect(() => {
    if (personRelationship && confirmedPersonData) {
      setLoading(true);
      HttpCompanyRelationship.insertRelationship(
        props.companyId,
        personRelationship,
      )
        .then((response) => {
          if (response[BaseResponseFields.HasError]) {
            setLoading(false);
            setPersonData(undefined);
            setConfirmedPersonData(false);

            snackbarError(response[BaseResponseFields.ErrorDescription]);
          } else {
            if (personFiscalAddress)
              HttpCompanyPersonAddress.insert(
                props.companyId,
                personRelationship[CompanyPersonRelationshipFields.PersonId],
                personFiscalAddress,
              ).then(() => {
                setLoading(false);
                onHandleSubmitClose(
                  personRelationship[CompanyPersonRelationshipFields.PersonId],
                  personRelationship[
                    CompanyPersonRelationshipFields.PersonRelationshipTypeCode
                  ],
                );
              });
            else {
              setLoading(false);
              onHandleSubmitClose(
                personRelationship[CompanyPersonRelationshipFields.PersonId],
                personRelationship[
                  CompanyPersonRelationshipFields.PersonRelationshipTypeCode
                ],
              );
            }
          }
        })
        .catch(() => {
          setLoading(true);
        });
    }
  }, [personRelationship, confirmedPersonData, personFiscalAddress]);

  return (
    <Dialog open={props.show} onClose={onHandleClose} maxWidth={'md'} fullWidth>
      <BaseDialogTitle title={props.title} onClose={onHandleClose} />

      <CardContent>
        <NewRelatedPersonContext.Provider
          value={{
            setLoading,
            personData,
            setPersonData,
            personRelationship,
            setPersonRelationship,
            confirmedPersonData,
            setConfirmedPersonData,
            setPersonFiscalAddress,
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {props.show && (
                <>
                  <NewRelatedPersonForm
                    relationshipTypeClassification={
                      props.relationshipTypeClassification
                    }
                  />

                  <NewRelatedPersonConfirmData />
                </>
              )}
            </Grid>
          </Grid>
        </NewRelatedPersonContext.Provider>
      </CardContent>

      {isLoading && <LoaderBlockUI />}
    </Dialog>
  );
}

export default NewRelatedPersonDialog;
