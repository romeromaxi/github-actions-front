import React, { useEffect, useState } from 'react';

import { CardContent, Dialog, Grid } from '@mui/material';

import {
  NosisMainDataResponse,
  NosisMainDataResponseFields,
} from 'types/person/personData';

import { HttpOffererRolesInvitation, HttpPersonNosis } from 'http/index';

import AssignNewRoleForm from './AssignNewRoleForm';
import AssignNewRoleConfirmData from './AssignNewRoleConfirmData';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import { useAction } from 'hooks/useAction';
import * as yup from 'yup';
import {
  RoleInvitationPost,
  RoleInvitationPostFields,
} from 'types/offerer/rolesData';
import {
  RequiredCuitSchema,
  RequiredMailSchema,
  RequiredSelectSchema,
} from 'util/validation/validationSchemas';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { PersonTypes } from 'types/person/personEnums';
import { Alert } from '@mui/lab';
import { BaseResponseFields } from '../../../types/baseEntities';
import {
  PersonConsultantResponseDTO,
  PersonConsultantResponseDTOFields,
} from '../../../types/person/personNosisData';
import { AssignNewRoleContext } from './AssignNewOffererRoleDialog';
import {ModuleCodes} from "../../../types/general/generalEnums";

interface AssignNewRoleDialogProps {
  show: boolean;
  offererId: number;
  onCloseDrawer: () => void;
  onFinishProcess: () => void;
}

function AssignNewRoleDialog(props: AssignNewRoleDialogProps) {
  const { snackbarSuccess, snackbarError, showLoader, hideLoader } =
    useAction();

  const [error, setError] = useState<string>();
  const [confirmedMainData, setConfirmedMainData] = useState<boolean>(false);
  const [nosisMainData, setNosisMainData] = useState<NosisMainDataResponse>();
  const [roleInvitation, setRoleInvitation] = useState<RoleInvitationPost>();

  const assignNewRoleFormSchema = yup.object().shape({
    [RoleInvitationPostFields.UserRelationshipCode]: RequiredSelectSchema,
    [RoleInvitationPostFields.Mail]: RequiredMailSchema,
    [RoleInvitationPostFields.CUIT]: RequiredCuitSchema,
  });

  const methods = useForm<RoleInvitationPost>({
    resolver: yupResolver(assignNewRoleFormSchema),
  });

  const resetForm = () => {
    setNosisMainData(undefined);
    setConfirmedMainData(false);
    setRoleInvitation(undefined);
    methods.reset();
  };

  const onHandleClose = () => {
    props.onCloseDrawer();
    resetForm();
  };

  const onHandleSubmitClose = () => {
    props.onFinishProcess();
    resetForm();
    snackbarSuccess('Se ha enviado la invitación con éxito');
  };

  const onSynchronizeWithNosis = (data: RoleInvitationPost) => {
    setError(undefined);
    setRoleInvitation(undefined);
    showLoader();

    HttpPersonNosis.synchronizeWithNosisMainData(
      data[RoleInvitationPostFields.CUIT], ModuleCodes.UserRegistration
    )
      .then((nosisData) => {
        if (nosisData[NosisMainDataResponseFields.Valid]) {
          if (
            nosisData[NosisMainDataResponseFields.PersonTypeCode] ===
            PersonTypes.Physical
          ) {
            setNosisMainData(nosisData);
            setRoleInvitation(data);
          } else setError(`El CUIT no debe pertenecer a una persona jurídica.`);
        } else
          setError(
            `El CUIT: ${methods.getValues(RoleInvitationPostFields.CUIT)} no existe.`,
          );

        hideLoader();
      })
      .catch(() => {
        hideLoader();
        setError(
          `Al parecer ha ocurrido un error, por favor intente nuevamente.`,
        );
      });
  };

  useEffect(() => {
    if (nosisMainData && confirmedMainData && roleInvitation) {
      showLoader();

      HttpPersonNosis.synchronizeWithNosisAndGetPersonId(
        roleInvitation[RoleInvitationPostFields.CUIT], ModuleCodes.UserRegistration
      )
        .then((nosisResponse: PersonConsultantResponseDTO) => {
          const personId: number =
            nosisResponse[PersonConsultantResponseDTOFields.PersonId];
          if (personId)
            HttpOffererRolesInvitation.sendInvitation(props.offererId, {
              [RoleInvitationPostFields.PersonId]: personId,
              [RoleInvitationPostFields.Mail]:
                roleInvitation[RoleInvitationPostFields.Mail],
              [RoleInvitationPostFields.CUIT]:
                roleInvitation[RoleInvitationPostFields.CUIT],
              [RoleInvitationPostFields.UserRelationshipCode]:
                roleInvitation[RoleInvitationPostFields.UserRelationshipCode],
              [RoleInvitationPostFields.LegalName]:
                nosisMainData[NosisMainDataResponseFields.BusinessName],
            })
              .then((response) => {
                if (response[BaseResponseFields.HasError]) {
                  snackbarError(response[BaseResponseFields.ErrorDescription]);
                  setConfirmedMainData(false);
                } else onHandleSubmitClose();

                hideLoader();
              })
              .catch(() => {
                hideLoader();
                snackbarError('Al parecer hubo un error');
              });
          else {
            hideLoader();
            snackbarError('Al parecer hubo un error');
          }
        })
        .catch(() => {
          hideLoader();
          snackbarError('Al parecer hubo un error');
        });
    }
  }, [nosisMainData, confirmedMainData, roleInvitation]);

  return (
    <Dialog open={props.show} onClose={onHandleClose} maxWidth={'md'} fullWidth>
      <BaseDialogTitle title={'Asignación nuevo Rol'} onClose={onHandleClose} />

      <CardContent>
        <AssignNewRoleContext.Provider
          value={{
            nosisMainData,
            setNosisMainData,
            confirmedMainData,
            setConfirmedMainData,
          }}
        >
          <Grid container spacing={1}>
            {error && (
              <Grid item xs={12}>
                <Alert severity={'error'}>
                  {`${error} \n
                                                Por favor ingréselo nuevamente`}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <form onSubmit={methods.handleSubmit(onSynchronizeWithNosis)}>
                <FormProvider {...methods}>
                  <AssignNewRoleForm />
                </FormProvider>
              </form>
            </Grid>

            <Grid item xs={12}>
              <AssignNewRoleConfirmData />
            </Grid>
          </Grid>
        </AssignNewRoleContext.Provider>
      </CardContent>
    </Dialog>
  );
}

export default AssignNewRoleDialog;
