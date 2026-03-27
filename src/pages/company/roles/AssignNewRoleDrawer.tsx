import React, { useEffect, useState } from 'react';

import {CardContent, Stack} from '@mui/material';

import {
  NosisMainDataResponse,
  NosisMainDataResponseFields,
} from 'types/person/personData';

import { HttpCompanyRolesInvitation, HttpPersonNosis } from 'http/index';

import AssignNewRoleForm from './AssignNewRoleForm';
import AssignNewRoleConfirmData from './AssignNewRoleConfirmData';
import { useAction } from 'hooks/useAction';
import * as yup from 'yup';
import {
  RoleInvitationPost,
  RoleInvitationPostFields,
} from 'types/company/rolesData';
import {
  RequiredCuitSchema,
  RequiredMailSchema,
  RequiredSelectSchema,
} from 'util/validation/validationSchemas';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { PersonTypes } from 'types/person/personEnums';
import { Alert } from '@mui/lab';
import { BaseResponseFields } from 'types/baseEntities';
import {personFormatter} from "util/formatters/personFormatter";
import DrawerBase from "../../../components/misc/DrawerBase";
import {DefaultStylesButton} from "../../../components/buttons/Buttons";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {ModuleCodes} from "../../../types/general/generalEnums";

interface AssignNewRoleDrawerProps {
  show: boolean;
  companyId: number;
  onCloseDrawer: () => void;
  onFinishProcess: () => void;
  companyPersonType: PersonTypes;
}

export const AssignNewRoleContext = React.createContext({
  nosisMainData: {} as NosisMainDataResponse | undefined,
  setNosisMainData: (dataNosis: NosisMainDataResponse | undefined) => {},
  confirmedMainData: false,
  setConfirmedMainData: (isConfirm: boolean) => {},
});

function AssignNewRoleDrawer(props: AssignNewRoleDrawerProps) {
  const { snackbarSuccess, snackbarError, showLoader, hideLoader } =
    useAction();

  const [error, setError] = useState<string>();
  const [confirmedMainData, setConfirmedMainData] = useState<boolean>(false);
  const [nosisMainData, setNosisMainData] = useState<NosisMainDataResponse>();
  const [roleInvitation, setRoleInvitation] = useState<RoleInvitationPost>();

  const assignNewRoleFormSchema = yup.object().shape({
    [RoleInvitationPostFields.UserRelationshipCode]: RequiredSelectSchema,
    [RoleInvitationPostFields.UserBondTypeCode]: yup.number().nullable(),
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
      data[RoleInvitationPostFields.CUIT], ModuleCodes.RelatedEntities
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

      HttpCompanyRolesInvitation.sendInvitation(props.companyId, {
        [RoleInvitationPostFields.Mail]:
          roleInvitation[RoleInvitationPostFields.Mail],
        [RoleInvitationPostFields.CUIT]:
          roleInvitation[RoleInvitationPostFields.CUIT],
        [RoleInvitationPostFields.UserRelationshipCode]:
          roleInvitation[RoleInvitationPostFields.UserRelationshipCode],
        [RoleInvitationPostFields.LegalName]:
            personFormatter.getNameFromNosisData(nosisMainData),
        [RoleInvitationPostFields.UserBondTypeCode]:
          roleInvitation[RoleInvitationPostFields.UserBondTypeCode],
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
    }
  }, [nosisMainData, confirmedMainData, roleInvitation]);

  return (
    <DrawerBase show={props.show}
                onCloseDrawer={onHandleClose}
                title={'Nuevo Usuario'}
                action={
                  !nosisMainData ? (
                  <DefaultStylesButton endIcon={<KeyboardDoubleArrowRightIcon />}
                                       onClick={methods.handleSubmit(onSynchronizeWithNosis)}
                  >
                    Enviar
                  </DefaultStylesButton>) :
                      <></>
                }
    >
      <CardContent sx={{mt: 2}}>
        <AssignNewRoleContext.Provider
          value={{
            nosisMainData,
            setNosisMainData,
            confirmedMainData,
            setConfirmedMainData,
          }}
        >
          <Stack spacing={1}>
            {error && (
                <Alert severity={'error'}>
                  {`${error} \n
                                                Por favor ingréselo nuevamente`}
                </Alert>
            )}
            <FormProvider {...methods}>
              <AssignNewRoleForm personType={props.companyPersonType} />
            </FormProvider>
            <AssignNewRoleConfirmData />
          </Stack>
        </AssignNewRoleContext.Provider>
      </CardContent>
    </DrawerBase>
  );
}

export default AssignNewRoleDrawer;
