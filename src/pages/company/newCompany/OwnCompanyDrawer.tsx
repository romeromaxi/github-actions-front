import React, { useEffect, useState } from 'react';
import { UserModelView, UserModelViewFields } from 'types/user';
import { HttpCompanyRoles, HttpPersonNosis, HttpUser } from 'http/index';
import DrawerBase from 'components/misc/DrawerBase';
import { SubTitle } from 'components/text/SubTitle';
import { Stack, Typography } from '@mui/material';
import NewCompanyForm from './NewCompanyForm';
import { useAction } from 'hooks/useAction';
import NewCompanyDrawerStyles from './NewCompanyDrawer.styles';
import { PersonCompanyConsultantResponseDTOFields } from 'types/person/personNosisData';
import { Disclaimer } from 'components/text/Disclaimer';
import { stringFormatter } from 'util/formatters/stringFormatter';
import {ModuleCodes} from "../../../types/general/generalEnums";

interface OwnCompanyDrawerProps {
  show: boolean;
  onCloseDrawer: () => void;
}

const OwnCompanyDrawer = (props: OwnCompanyDrawerProps) => {
  const { snackbarSuccess, snackbarError, showLoader, hideLoader } =
    useAction();
  const classes = NewCompanyDrawerStyles();
  const [userDetails, setUserDetails] = useState<UserModelView>();
  const [companyId, setCompanyId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.show) {
      showLoader();
      setLoading(true);
      HttpUser.getUserDataLogged().then((r) => {
        setUserDetails(r);
        HttpPersonNosis.synchronizeCompany(r[UserModelViewFields.CUIT], '', ModuleCodes.CompanyRegistration)
          .then((response) => {
            if (response[PersonCompanyConsultantResponseDTOFields.Valid]) {
              if (
                !response[
                  PersonCompanyConsultantResponseDTOFields.ActiveCompany
                ] ||
                !response[
                  PersonCompanyConsultantResponseDTOFields.ExistingCompany
                ]
              ) {
                setCompanyId(
                  response[PersonCompanyConsultantResponseDTOFields.CompanyId],
                );
              } else {
                snackbarError(
                  `La empresa con CUIT: ${stringFormatter.formatCuit(r[UserModelViewFields.CUIT])} ya fue dada de alta.`,
                );
                onHandleClose();
              }
            } else {
              snackbarError(
                `Al parecer tuvimos un error. Por favor intentá nuevamente en unos minutos`,
              );
            }
          })
          .finally(() => {
            hideLoader();
            setLoading(false);
          });
      });
    }
  }, [props.show]);

  const onHandleSubmitClose = () => {
    showLoader();
    HttpCompanyRoles.setUserAsAfipResponsible(companyId)
      .then(() => {
        if (window.location.toString().includes('mi-cuenta'))
          window.location.href = `/mis-empresas/${companyId}`;
        else window.location.reload();

        onHandleClose();
        snackbarSuccess(
          `Su repositorio ${userDetails?.[UserModelViewFields.UserName]} ha sido creado con éxito`,
        );
      })
      .catch(() => {
        snackbarError(
          'Al parecer tuvimos un error al crear su repositorio. Por favor, intente en unos minutos',
        );
      })
      .finally(() => hideLoader());
  };

  const onHandleClose = () => {
    props.onCloseDrawer();
    setCompanyId(undefined);
    setUserDetails(undefined);
  };

  return loading ? (
    <div />
  ) : (
    <DrawerBase
      show={props.show}
      title="Agregar Mi Repositorio"
      onCloseDrawer={onHandleClose}
    >
      <SubTitle text={'Cargar repositorio de'} />

      {userDetails && (
        <Typography className={classes.companyName}>
          {userDetails[UserModelViewFields.UserName]}
        </Typography>
      )}

      {userDetails && (
        <Typography className={classes.companyCuit}>
          {`CUIT: ${stringFormatter.formatCuit(userDetails[UserModelViewFields.CUIT])}`}
        </Typography>
      )}

      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        mt={2}
      >
        <Disclaimer text="¿Estás seguro de que querés crear esta cuenta?" />
        <NewCompanyForm
          onSubmitted={onHandleSubmitClose}
          companyId={companyId ?? 0}
          userDetails={userDetails}
        />
      </Stack>
    </DrawerBase>
  );
};

export default OwnCompanyDrawer;
