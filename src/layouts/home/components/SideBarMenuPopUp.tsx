import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

import { Alert, Skeleton } from '@mui/lab';
import { Box, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';

import { HttpCompany } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';

import SideBarMenuPopUpStyles from './SideBarMenuPopUp.styles';
import { LayoutHomeContext } from '../LayoutHome';
import { WarningAmberRounded } from '@mui/icons-material';

export interface SideBarMenuPopUpProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

const isCompanyActive = (company: CompanyViewDTO) =>
  company[CompanyViewDTOFields.AllowCompanyAccess];

const sortCompany = (a: CompanyViewDTO, b: CompanyViewDTO) =>
  a[CompanyViewDTOFields.BusinessName] > b[CompanyViewDTOFields.BusinessName]
    ? 1
    : -1;

export const SideBarMenuPopUpCompany = (props: SideBarMenuPopUpProps) => {
  const classes = SideBarMenuPopUpStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const lstPathLocation = location.pathname?.split('/')?.slice(1) ?? [];
  const isMenuCompany: boolean =
    !!lstPathLocation.length &&
    [
      'mi-cuenta',
      'mis-empresas',
      'mis-solicitudes',
      'mis-presentaciones',
      'bureau',
    ].includes(lstPathLocation[0]);
  const companyIdPath: number =
    lstPathLocation.length >= 2 && isMenuCompany
      ? parseInt(lstPathLocation[1] ?? '0')
      : 0;

  const {
    shouldWarnBeforeSwitch,
    setShouldWarnBeforeSwitch,
    setOnDialogConfirm,
    setShowConfirmDialog,
  } = useContext(LayoutHomeContext);

  const [companies, setCompanies] = useState<CompanyViewDTO[]>();

  const handleClose = () => {
    props.onClose();
  };

  const navigateToCompany = (companyId: number, allowFullAccess: boolean) =>
    allowFullAccess
      ? navigate(`/mis-empresas/${companyId}`)
      : navigate(`/mis-empresas/${companyId}?tab=sentSolicitations`);

  const onClickHandler = (companyId: number, allowFullAccess: boolean) => {
    if (shouldWarnBeforeSwitch) {
      setOnDialogConfirm(
        () => () => navigateToCompany(companyId, allowFullAccess),
      );
      setShowConfirmDialog(true);
    } else {
      navigateToCompany(companyId, allowFullAccess);
    }
  };

  useEffect(() => {
    if (!!props.anchorEl)
      HttpCompany.getCompaniesByUser().then((responseCompanies) =>
        setCompanies(
          responseCompanies.filter(isCompanyActive).sort(sortCompany),
        ),
      );
  }, [props.anchorEl]);

  return (
    <div>
      {/*<DialogAlert open={true}*/}
      {/*             onClose={() => {*/}
      {/*                 props.onClose()*/}
      {/*                 setShowConfirmDialog(false)*/}
      {/*             }}*/}
      {/*             onConfirm={onConfirmTabSwitch}*/}
      {/*             textContent={`Está seguro que desea cambiar de pestaña?`}*/}
      {/*/>*/}
      <Menu
        anchorEl={props.anchorEl}
        open={!!props.anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        PaperProps={{
          className: classes.menuPaper,
        }}
      >
        <Box className={classes.titlePaper}>
          <Typography fontWeight={600} color={'white'}>
            Selecciona alguna de tus empresas
          </Typography>
        </Box>
        <Stack>
          {!!companies ? (
            companies.length ? (
              companies.map((company) => (
                <MenuItem
                  disableRipple
                  key={`sideBarMenuPopUpCompany_${company[EntityWithIdFields.Id]}`}
                >
                  <Box
                    onClick={() =>
                      onClickHandler(
                        company[EntityWithIdFields.Id],
                        company[CompanyViewDTOFields.AllowFullAccess],
                      )
                    }
                    className={clsx(classes.menuOption, {
                      [classes.menuOptionActive]:
                        companyIdPath == company[EntityWithIdFields.Id],
                    })}
                  >
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      {company[CompanyViewDTOFields.BusinessName]}

                      {!company[CompanyViewDTOFields.AllowFullAccess] && (
                        <Tooltip
                          title={
                            company[
                              CompanyViewDTOFields.CompanyUserQueryStateDesc
                            ]
                          }
                        >
                          <WarningAmberRounded
                            sx={{
                              marginTop: '1px !important',
                              color: '#3E98FF',
                            }}
                            fontSize={'small'}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <Alert sx={{ marginTop: 2 }}>No ha cargado ninguna empresa</Alert>
            )
          ) : (
            Array.from(Array(3).keys()).map((item) => (
              <MenuItem
                disableRipple
                key={`sideBarMenuPopUpCompanyLoadingItem_${item}`}
              >
                <Skeleton width={'100%'} />
              </MenuItem>
            ))
          )}
        </Stack>
      </Menu>
    </div>
  );
};
