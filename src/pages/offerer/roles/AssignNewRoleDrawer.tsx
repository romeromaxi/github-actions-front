import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import { Grid, Stack, Typography } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import DrawerBase from 'components/misc/DrawerBase';
import { LoaderBlockUI } from 'components/loader';
import { DefaultStylesButton } from 'components/buttons/Buttons';
import { DataWithLabelPrimary } from 'components/misc/DataWithLabel';

import {
  RoleInvitationPost,
  RoleInvitationPostFields,
} from '../../../types/offerer/rolesData';
import {
  NosisMainDataResponse,
  NosisMainDataResponseFields,
} from 'types/person/personData';

import {
  RequiredMailSchema,
  RequiredSelectSchema,
} from 'util/validation/validationSchemas';

import AssignNewRoleAfipData from './AssignNewRoleAfipData';
import AssignNewRoleConfirmData from './AssignNewRoleConfirmData';
import AssignNewRoleForm from './AssignNewRoleForm';

import AssignNewRoleDrawerStyles, {
  DescriptionConfirmedMainDataProps,
} from './AssignNewRoleDrawer.styles';
import { HttpOffererRolesInvitation } from 'http/offerer/httpOffererRolesInvitation';

interface AssignNewRoleDrawerProps {
  show: boolean;
  offererId: number;
  onCloseDrawer: () => void;
  onFinishProcess: () => void;
}

export const AssignNewRoleContext = React.createContext({
  setLoading: (loading: boolean) => {},
  nosisMainData: {} as NosisMainDataResponse | undefined,
  setNosisMainData: (dataNosis: NosisMainDataResponse | undefined) => {},
  confirmedMainData: false,
  setConfirmedMainData: (isConfirm: boolean) => {},
});

function AssignNewRoleDrawer(props: AssignNewRoleDrawerProps) {
  const classes = AssignNewRoleDrawerStyles();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [confirmedMainData, setConfirmedMainData] = useState<boolean>(false);
  const [nosisMainData, setNosisMainData] = useState<NosisMainDataResponse>();

  const assignNewRoleFormSchema = yup.object().shape({
    [RoleInvitationPostFields.UserRelationshipCode]: RequiredSelectSchema,
    [RoleInvitationPostFields.Mail]: RequiredMailSchema,
  });

  const methods = useForm<RoleInvitationPost>({
    resolver: yupResolver(assignNewRoleFormSchema),
  });

  const onHandleClose = () => {
    props.onCloseDrawer();
    setNosisMainData(undefined);
    setConfirmedMainData(false);
    methods.reset();
  };

  const onHandleSubmitClose = () => {
    props.onFinishProcess();
    setNosisMainData(undefined);
    setConfirmedMainData(false);
    methods.reset();
  };

  const onHandleSubmit = (data: RoleInvitationPost) => {
    if (nosisMainData) {
      setLoading(true);

      HttpOffererRolesInvitation.sendInvitation(props.offererId, {
        [RoleInvitationPostFields.Mail]: data[RoleInvitationPostFields.Mail],
        [RoleInvitationPostFields.CUIT]:
          nosisMainData[NosisMainDataResponseFields.Identification],
        [RoleInvitationPostFields.UserRelationshipCode]:
          data[RoleInvitationPostFields.UserRelationshipCode],
        [RoleInvitationPostFields.LegalName]:
          nosisMainData[NosisMainDataResponseFields.BusinessName],
        /*  
                    [RoleFields.CompanyId]: props.companyId,
                    [RoleFields.Mail]: data[RoleFields.Mail],
                    [RoleFields.CUIT]: nosisMainData[NosisMainDataResponseFields.Identification],
                    [RoleFields.UserRelationshipCode]: data[RoleFields.UserRelationshipCode],
                    [RoleFields.LegalName]: nosisMainData[NosisMainDataResponseFields.BusinessName],
                    [RoleFields.LastName]: nosisMainData[NosisMainDataResponseFields.LastName],
                    [RoleFields.Name]: nosisMainData[NosisMainDataResponseFields.FirstName],
                    [RoleFields.PersonTypeCode]: nosisMainData[NosisMainDataResponseFields.PersonTypeCode],
                    [RoleFields.Gender]: nosisMainData[NosisMainDataResponseFields.Gender] */
      })
        .then(() => {
          setLoading(false);
          onHandleSubmitClose();
        })
        .catch(() => {
          setLoading(true);
        });
    }
  };

  return (
    <DrawerBase show={props.show} title="Roles" onCloseDrawer={onHandleClose}>
      {!!nosisMainData && confirmedMainData && (
        <Grid
          container
          spacing={2}
          item
          xs={12}
          className={classes.descriptionConfirms}
        >
          <Grid item xs={12} mt={-1}>
            <DataWithLabelPrimary
              label="CUIT confirmado"
              data={nosisMainData[NosisMainDataResponseFields.Identification]}
              rowDirection
              labelProps={DescriptionConfirmedMainDataProps}
              dataProps={DescriptionConfirmedMainDataProps}
            />
          </Grid>
          <Grid item xs={12} mt={-1}>
            <DataWithLabelPrimary
              label="Nombre"
              data={`${nosisMainData[NosisMainDataResponseFields.LastName]}, ${nosisMainData[NosisMainDataResponseFields.FirstName]}`}
              rowDirection
              labelProps={DescriptionConfirmedMainDataProps}
              dataProps={DescriptionConfirmedMainDataProps}
            />
          </Grid>
        </Grid>
      )}

      <Typography variant="h4" className={classes.descriptionAsignationRole}>
        Asignación de Nuevo Rol:
      </Typography>

      <Stack direction="column" justifyContent="flex-start" alignItems="center">
        <AssignNewRoleContext.Provider
          value={{
            setLoading,
            nosisMainData,
            setNosisMainData,
            confirmedMainData,
            setConfirmedMainData,
          }}
        >
          {!confirmedMainData && (
            <>
              <AssignNewRoleAfipData />

              <AssignNewRoleConfirmData />
            </>
          )}
        </AssignNewRoleContext.Provider>
      </Stack>

      <FormProvider {...methods}>
        <form
          id="assignNewRoleDrawer-form"
          onSubmit={methods.handleSubmit(onHandleSubmit)}
          className={classes.form}
        >
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            {confirmedMainData && <AssignNewRoleForm />}
            {!!nosisMainData && confirmedMainData && (
              <DefaultStylesButton
                type={'submit'}
                form="assignNewRoleDrawer-form"
                endIcon={<KeyboardDoubleArrowRightIcon />}
              >
                Enviar Aviso
              </DefaultStylesButton>
            )}
          </Stack>
        </form>
      </FormProvider>

      {isLoading && <LoaderBlockUI />}
    </DrawerBase>
  );
}

export default AssignNewRoleDrawer;
