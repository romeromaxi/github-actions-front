import React, { useEffect, useState } from 'react';

import { Grid } from '@mui/material';

import {
  NosisMainDataResponse,
  NosisMainDataResponseFields,
} from 'types/person/personData';

import { HttpOffererRolesInvitation, HttpPersonNosis } from 'http/index';

import AssignNewRoleConfirmData from './AssignNewRoleConfirmData';
import { useAction } from 'hooks/useAction';
import * as yup from 'yup';
import {
  OffererRoleInvitationPost,
  OffererRoleInvitationPostFields,
} from 'types/offerer/rolesData';
import {
  RequiredCuitSchema,
  RequiredMailSchema,
} from 'util/validation/validationSchemas';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { PersonTypes } from 'types/person/personEnums';
import { Alert } from '@mui/lab';
import AssignNewOffererRoleForm from './AssignNewOffererRoleForm';
import {
  PersonConsultantResponseDTO,
  PersonConsultantResponseDTOFields,
} from 'types/person/personNosisData';
import { BaseResponseFields } from 'types/baseEntities';
import DrawerBase from "../../../components/misc/DrawerBase";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {DefaultStylesButton} from "../../../components/buttons/Buttons";
import {useLoaderActions} from "../../../hooks/useLoaderActions";
import {ModuleCodes} from "../../../types/general/generalEnums";

export const AssignNewRoleContext = React.createContext({
  nosisMainData: undefined as NosisMainDataResponse | undefined,
  setNosisMainData: (dataNosis: NosisMainDataResponse | undefined) => {},
  confirmedMainData: false,
  setConfirmedMainData: (isConfirm: boolean) => {},
});

interface AssignNewOffererRoleDrawerProps {
  show: boolean;
  offererId: number;
  onCloseDrawer: () => void;
  onFinishProcess: () => void;
}

function AssignNewOffererRoleDrawer(props: AssignNewOffererRoleDrawerProps) {
  const { snackbarSuccess, snackbarError } =
    useAction();
  
  const { showLoader, hideLoader } = useLoaderActions()

  const [error, setError] = useState<string>();
  const [confirmedMainData, setConfirmedMainData] = useState<boolean>(false);
  const [nosisMainData, setNosisMainData] = useState<NosisMainDataResponse>();
  const [roleInvitation, setRoleInvitation] =
    useState<OffererRoleInvitationPost>();

  const assignNewRoleFormSchema = yup.object().shape({
    [OffererRoleInvitationPostFields.Mail]: RequiredMailSchema,
    [OffererRoleInvitationPostFields.CUIT]: RequiredCuitSchema,
  });

  const methods = useForm<OffererRoleInvitationPost>({
    resolver: yupResolver(assignNewRoleFormSchema),
  });

  const resetForm = () => {
    setNosisMainData(undefined);
    setConfirmedMainData(false);
    setRoleInvitation(undefined);
    setError(undefined);
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

  const onSynchronizeWithNosis = (data: OffererRoleInvitationPost) => {
    setError(undefined);
    setRoleInvitation(undefined);
    showLoader();

    HttpPersonNosis.synchronizeWithNosisMainData(
      data[OffererRoleInvitationPostFields.CUIT], ModuleCodes.UserRegistration
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
            `El CUIT: ${methods.getValues(OffererRoleInvitationPostFields.CUIT)} no existe.`,
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
        roleInvitation[OffererRoleInvitationPostFields.CUIT], ModuleCodes.UserRegistration
      )
        .then((nosisResponse: PersonConsultantResponseDTO) => {
          const personId: number =
            nosisResponse[PersonConsultantResponseDTOFields.PersonId];
          if (personId)
            HttpOffererRolesInvitation.sendInvitation(props.offererId, {
              [OffererRoleInvitationPostFields.PersonId]: personId,
              [OffererRoleInvitationPostFields.Mail]:
                roleInvitation[OffererRoleInvitationPostFields.Mail],
              [OffererRoleInvitationPostFields.CUIT]:
                roleInvitation[OffererRoleInvitationPostFields.CUIT],
              [OffererRoleInvitationPostFields.GroupIds]:
                  roleInvitation[OffererRoleInvitationPostFields.GroupIds],
              [OffererRoleInvitationPostFields.LegalName]:
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
                setNosisMainData(undefined);
                snackbarError('Al parecer hubo un error');
              });
          else {
            hideLoader();
            setNosisMainData(undefined);
            snackbarError('Al parecer hubo un error');
          }
        })
        .catch(() => {
          hideLoader();
          setNosisMainData(undefined);
          snackbarError('Al parecer hubo un error');
        });
    }
  }, [nosisMainData, confirmedMainData, roleInvitation]);

  return (
    <DrawerBase show={props.show}
                onCloseDrawer={onHandleClose}
                title="Asignación nuevo Rol"
                action={!nosisMainData ? <DefaultStylesButton type="submit" form="form-assign-new-offerer-role" endIcon={<KeyboardDoubleArrowRightIcon />}>
                      Enviar
                    </DefaultStylesButton> : <></>
    }
    >
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
                  {`${error} \n Por favor ingréselo nuevamente`}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <form onSubmit={methods.handleSubmit(onSynchronizeWithNosis)} id="form-assign-new-offerer-role">
                <FormProvider {...methods}>
                  <AssignNewOffererRoleForm />
                </FormProvider>
              </form>
            </Grid>

            <Grid item xs={12}>
              <AssignNewRoleConfirmData />
            </Grid>
          </Grid>
        </AssignNewRoleContext.Provider>
    </DrawerBase>
  );
}

export default AssignNewOffererRoleDrawer;
