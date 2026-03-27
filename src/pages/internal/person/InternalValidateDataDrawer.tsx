import React, { Fragment, useEffect, useState } from 'react';
import useAxios from 'hooks/useAxios';
import { useForm } from 'react-hook-form';
import { useAction } from 'hooks/useAction';
import {Chip, Divider, Stack, Typography} from '@mui/material';
import { ControlledTextFieldFilled } from 'components/forms';
import {
  PersonSummaryView,
  PersonSummaryViewFields,
  PersonUpdateValidateState,
  PersonUpdateValidateStateFields,
} from 'types/person/personData';
import { ValidationStatesType } from 'types/person/personEnums';
import { DataWithLabel } from 'components/misc/DataWithLabel';
import PersonValidateStateChip from './PersonValidateStateChip';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { CloseButton, ConfirmButton } from 'components/buttons/Buttons';
import { HttpCompany, HttpFilesCompany, HttpUser } from 'http/index';
import { Document } from 'types/files/filesData';
import FileDocumentDetail, {
  FileDocumentDetailLoading,
} from 'components/files/FileDocumentDetail';
import DrawerBase from "../../../components/misc/DrawerBase";

interface InternalValidateDataDrawerProps {
  open: boolean;
  onClose: () => void;
  person: PersonSummaryView;
  onReload: () => void;
}

const InternalValidateDataDrawer = ({
  open,
  onClose,
  person,
  onReload,
}: InternalValidateDataDrawerProps) => {
  const { fetchData } = useAxios();

  const { control, handleSubmit, reset } = useForm<PersonUpdateValidateState>();
  const { snackbarError } = useAction();
  const [documents, setDocuments] = useState<Document[]>();
  const alreadyValidated =
    person[PersonSummaryViewFields.ValidationStateCode] ===
      ValidationStatesType.Validated ||
    person[PersonSummaryViewFields.ValidationStateCode] ===
      ValidationStatesType.Returned;
  const pendingValidation = person[PersonSummaryViewFields.AllowsResult];
  const loadProcess =
    person[PersonSummaryViewFields.ValidationStateCode] ===
    ValidationStatesType.LoadProcess;

  const handleClose = () => {
    reset(undefined);
    onClose();
  };

  const updateState = (
    data: PersonUpdateValidateState,
    state: ValidationStatesType,
  ) => {
    const submitData: PersonUpdateValidateState = {
      ...data,
      [PersonUpdateValidateStateFields.ValidationStateCode]: state,
    };

    const promiseUpdateState = !!person[PersonSummaryViewFields.CompanyId]
      ? () =>
          HttpCompany.updateState(
            person[PersonSummaryViewFields.CompanyId] || 0,
            submitData,
          )
      : () =>
          HttpUser.updateState(
            person[PersonSummaryViewFields.UserId] || 0,
            submitData,
          );

    fetchData(promiseUpdateState, true).then(() => {
      handleClose();
      onReload();
    });
  };

  const onSubmitReturn = (data: PersonUpdateValidateState) => {
    if (
      !data[PersonUpdateValidateStateFields.ValidationStateObservations] ||
      data[PersonUpdateValidateStateFields.ValidationStateObservations] === ''
    ) {
      snackbarError('Para devolver se debe escribir una observación');
    } else {
      updateState(data, ValidationStatesType.Returned);
    }
  };

  const onSubmitValidate = (data: PersonUpdateValidateState) =>
    updateState(data, ValidationStatesType.Validated);

  const getDocumentsByCompanyId = (companyId: number) => {
    HttpFilesCompany.getIdentityValidationDocuments(companyId)
      .then(setDocuments)
      .catch(() => setDocuments([]));
  };

  const getDocumentsByUserId = (userId: number) => {
    HttpUser.getIdentityValidationDocuments(userId)
      .then(setDocuments)
      .catch(() => setDocuments([]));
  };

  useEffect(() => {
    if (!loadProcess) {
      if (!!person[PersonSummaryViewFields.UserId])
        getDocumentsByUserId(person[PersonSummaryViewFields.UserId] || 0);
      else if (!!person[PersonSummaryViewFields.CompanyId])
        getDocumentsByCompanyId(person[PersonSummaryViewFields.CompanyId] || 0);
    }
  }, [open, person]);

  return (
      <DrawerBase show={open}
                  onCloseDrawer={handleClose}
                  title={`Detalle de ${person[PersonSummaryViewFields.BusinessName]}`}
                  action={
                      pendingValidation ? (
                          <Stack
                              direction={'row'}
                              alignItems={'center'}
                              spacing={1}
                          >
                            <CloseButton onClick={handleSubmit(onSubmitReturn)} variant='outlined' fullWidth>
                              Devolver
                            </CloseButton>
                            <ConfirmButton onClick={handleSubmit(onSubmitValidate)} fullWidth>
                              Validar
                            </ConfirmButton>
                          </Stack>
                      )
                          :
                          <></>
                  }
      >
        <Stack spacing={2}>
          <DataWithLabel
              label={'CUIT'}
              data={
                <Chip
                    color={'info'}
                    label={stringFormatter.formatCuit(
                        person[PersonSummaryViewFields.CUIT],
                    )}
                />
              }
              dataProps={{ justifyItems: 'end' }}
              fullWidth
              rowDirection
          />
          <DataWithLabel
              label={'Estado'}
              data={
                <PersonValidateStateChip
                    label={person[PersonSummaryViewFields.ValidationStateDesc]}
                    code={person[PersonSummaryViewFields.ValidationStateCode]}
                />
              }
              dataProps={{ justifyItems: 'end' }}
              rowDirection
              fullWidth
          />
          <DataWithLabel
              label={'Última actualización'}
              data={dateFormatter.toShortDate(
                  person[PersonSummaryViewFields.ValidationStateDate],
              )}
              dataProps={{ textAlign: 'end' }}
              fullWidth
              rowDirection
          />
          {alreadyValidated && (
              <DataWithLabel
                  label={'Observación'}
                  data={
                      person[PersonSummaryViewFields.ValidationStateObservations] ??
                      '-'
                  }
                  fullWidth
                  rowDirection
                  dataProps={{ textAlign: 'end' }}
              />
          )}

          {!loadProcess && (
              <Fragment>
                {(!documents || !!documents.length) && (
                    <Divider sx={{borderWidth: '0px !important'}}>
                      <Typography color={'black !important'}>Documentación</Typography>
                    </Divider>
                )}

                {documents ? (
                    documents.map((d) => (
                        <FileDocumentDetail document={d} download preview />
                    ))
                ) : (
                    <Fragment>
                      <FileDocumentDetailLoading />
                      <FileDocumentDetailLoading />
                    </Fragment>
                )}
              </Fragment>
          )}

          {pendingValidation && (
              <ControlledTextFieldFilled
                  control={control}
                  name={PersonUpdateValidateStateFields.ValidationStateObservations}
                  multiline
                  rows={4}
                  fullWidth
                  label={'Observación'}
              />
          )}
        </Stack>
      </DrawerBase>
  );
};

export default InternalValidateDataDrawer;
