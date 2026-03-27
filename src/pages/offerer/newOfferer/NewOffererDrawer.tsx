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
  NosisMainDataResponse,
  NosisMainDataResponseFields,
} from 'types/person/personData';

import {
  RequiredMailSchema,
  RequiredPhoneSchema,
  RequiredSchema,
  RequiredSelectSchema,
} from 'util/validation/validationSchemas';

import NewOffererAfipData from './NewOffererAfipData';
import NewOffererConfirmData from './NewOffererConfirmData';

import NewOffererUserAfipData from './NewOffererUserAfipData';
import NewOffererUserConfirmData from './NewOffererUserConfirmData';

import NewOffererForm from './NewOffererForm';

import NewOffererDrawerStyles, {
  DescriptionConfirmedMainDataProps,
} from './NewOffererDrawer.styles';
import { HttpPersonNosis } from 'http/index';
import {
  PersonOffererConsultantDTO,
  PersonOffererConsultantResponseDTO,
  PersonOffererConsultantResponseDTOFields,
} from 'types/person/personNosisData';
import { useAction } from 'hooks/useAction';
import { HttpOffererLogo } from '../../../http/offerer/httpOffererLogo';

interface NewOffererDrawerProps {
  show: boolean;
  onCloseDrawer: () => void;
  onFinishProcess: () => void;
}

interface NewOffererFormData {
  [PersonOffererConsultantDTO.Mail]: string;
  [PersonOffererConsultantDTO.Telephone]: string;
  [PersonOffererConsultantDTO.PersonClassificationCode]: number;
  [PersonOffererConsultantDTO.LogInName]: string;
  [PersonOffererConsultantDTO.BusinessTradeName]: string;
  [PersonOffererConsultantDTO.Logo]: File;
}

export const NewOffererContext = React.createContext({
  setLoading: (loading: boolean) => {},
  nosisMainData: {} as NosisMainDataResponse | undefined,
  setNosisMainData: (dataNosis: NosisMainDataResponse | undefined) => {},
  confirmedMainData: false,
  setConfirmedMainData: (isConfirm: boolean) => {},

  nosisUserData: {} as NosisMainDataResponse | undefined,
  setNosisUserData: (dataNosis: NosisMainDataResponse | undefined) => {},
  confirmedUserData: false,
  setConfirmedUserData: (isConfirm: boolean) => {},
});

function NewOffererDrawer(props: NewOffererDrawerProps) {
  const { snackbarWarning } = useAction();
  const classes = NewOffererDrawerStyles();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [confirmedMainData, setConfirmedMainData] = useState<boolean>(false);
  const [nosisMainData, setNosisMainData] = useState<NosisMainDataResponse>();
  const [confirmedUserData, setConfirmedUserData] = useState<boolean>(false);
  const [nosisUserData, setNosisUserData] = useState<NosisMainDataResponse>();

  const newOffererFormSchema = yup.object().shape({
    [PersonOffererConsultantDTO.Mail]: RequiredMailSchema,
    [PersonOffererConsultantDTO.Telephone]: RequiredPhoneSchema,
    [PersonOffererConsultantDTO.LogInName]: RequiredSchema,
    [PersonOffererConsultantDTO.PersonClassificationCode]: RequiredSelectSchema,
    [PersonOffererConsultantDTO.Logo]: RequiredSchema,
  });

  const methods = useForm<NewOffererFormData>({
    resolver: yupResolver(newOffererFormSchema),
  });

  const onHandleClose = () => {
    props.onCloseDrawer();
    setNosisMainData(undefined);
    setConfirmedMainData(false);
    setNosisUserData(undefined);
    setConfirmedUserData(false);
    methods.reset();
  };

  const onHandleSubmitClose = () => {
    props.onFinishProcess();
    setNosisMainData(undefined);
    setConfirmedMainData(false);
    setNosisUserData(undefined);
    setConfirmedUserData(false);
    methods.reset();
  };

  const onHandleSubmit = (data: NewOffererFormData) => {
    if (nosisMainData && nosisUserData) {
      setLoading(true);

      HttpPersonNosis.synchronizeOfferer(
        nosisMainData[NosisMainDataResponseFields.Identification],
        nosisUserData[NosisMainDataResponseFields.Identification],
        data[PersonOffererConsultantDTO.PersonClassificationCode],
        data[PersonOffererConsultantDTO.Mail],
        data[PersonOffererConsultantDTO.Telephone],
        data[PersonOffererConsultantDTO.LogInName],
        data[PersonOffererConsultantDTO.BusinessTradeName]
      )
        .then((offererResponse: PersonOffererConsultantResponseDTO) => {
          if (offererResponse[PersonOffererConsultantResponseDTOFields.Valid]) {
            if (methods.getValues(PersonOffererConsultantDTO.Logo)) {
              HttpOffererLogo.update(
                offererResponse[
                  PersonOffererConsultantResponseDTOFields.OffererId
                ],
                methods.getValues(PersonOffererConsultantDTO.Logo),
              )
                .then(() => {
                  onHandleSubmitClose();
                })
                .catch(() => {
                  onHandleSubmitClose();
                });
            }
          } else
            snackbarWarning(
              offererResponse[
                PersonOffererConsultantResponseDTOFields.DescriptionState
              ],
            );

          setLoading(false);
        })
        .catch(() => {
          setLoading(true);
        });
    }
  };

  return (
    <DrawerBase
      show={props.show}
      title="Oferente"
      onCloseDrawer={onHandleClose}
    >
      {!!nosisMainData &&
        confirmedMainData &&
        nosisUserData &&
        confirmedUserData && (
          <Grid
            container
            spacing={2}
            item
            xs={12}
            className={classes.descriptionConfirms}
          >
            <Grid item xs={12} mt={-1}>
              <DataWithLabelPrimary
                label="CUIT Oferente confirmado"
                data={nosisMainData[NosisMainDataResponseFields.Identification]}
                rowDirection
                labelProps={DescriptionConfirmedMainDataProps}
                dataProps={DescriptionConfirmedMainDataProps}
              />
            </Grid>
            <Grid item xs={12} mt={-1}>
              <DataWithLabelPrimary
                label="Razón Social"
                data={`${nosisMainData[NosisMainDataResponseFields.BusinessName]}`}
                rowDirection
                labelProps={DescriptionConfirmedMainDataProps}
                dataProps={DescriptionConfirmedMainDataProps}
              />
            </Grid>

            <Grid item xs={12} mt={-1}>
              <DataWithLabelPrimary
                label="CUIT Responsable confirmado"
                data={nosisUserData[NosisMainDataResponseFields.Identification]}
                rowDirection
                labelProps={DescriptionConfirmedMainDataProps}
                dataProps={DescriptionConfirmedMainDataProps}
              />
            </Grid>
            <Grid item xs={12} mt={-1}>
              <DataWithLabelPrimary
                label="Nombre"
                data={`${nosisUserData[NosisMainDataResponseFields.LastName]}, ${nosisUserData[NosisMainDataResponseFields.FirstName]}`}
                rowDirection
                labelProps={DescriptionConfirmedMainDataProps}
                dataProps={DescriptionConfirmedMainDataProps}
              />
            </Grid>
          </Grid>
        )}

      {!confirmedMainData && !confirmedUserData && (
        <>
          <Typography
            variant="h4"
            className={classes.descriptionAsignationRole}
          >
            Nuevo Oferente:
          </Typography>
        </>
      )}

      {confirmedMainData && !confirmedUserData && (
        <>
          <Typography
            variant="h4"
            className={classes.descriptionAsignationRole}
          >
            CUIT Responsable:
          </Typography>
        </>
      )}

      <Stack direction="column" justifyContent="flex-start" alignItems="center">
        <NewOffererContext.Provider
          value={{
            setLoading,
            nosisMainData,
            setNosisMainData,
            confirmedMainData,
            setConfirmedMainData,
            nosisUserData,
            setNosisUserData,
            confirmedUserData,
            setConfirmedUserData,
          }}
        >
          {!confirmedMainData && !confirmedUserData && (
            <>
              <NewOffererAfipData />

              <NewOffererConfirmData />
            </>
          )}
        </NewOffererContext.Provider>
        <NewOffererContext.Provider
          value={{
            setLoading,
            nosisMainData,
            setNosisMainData,
            confirmedMainData,
            setConfirmedMainData,
            nosisUserData,
            setNosisUserData,
            confirmedUserData,
            setConfirmedUserData,
          }}
        >
          {confirmedMainData && !confirmedUserData && (
            <>
              <NewOffererUserAfipData />

              <NewOffererUserConfirmData />
            </>
          )}
        </NewOffererContext.Provider>
      </Stack>

      <FormProvider {...methods}>
        <form
          id="newOffererDrawer-form"
          onSubmit={methods.handleSubmit(onHandleSubmit)}
          className={classes.form}
        >
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            {confirmedMainData && confirmedUserData && <NewOffererForm />}
            {!!nosisMainData &&
              confirmedMainData &&
              !!nosisUserData &&
              confirmedUserData && (
                <DefaultStylesButton
                  type={'submit'}
                  form="newOffererDrawer-form"
                  endIcon={<KeyboardDoubleArrowRightIcon />}
                >
                  Cargar Oferente
                </DefaultStylesButton>
              )}
          </Stack>
        </form>
      </FormProvider>

      {isLoading && <LoaderBlockUI />}
    </DrawerBase>
  );
}

export default NewOffererDrawer;
