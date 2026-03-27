import React, { useEffect, useState } from 'react';

import { Alert, Grid, Stack } from '@mui/material';

import RoleCard from './RoleCard';
import RoleCardSkeleton from './RoleCardSkeleton';

import { OffererRole, Role, RoleInvitation } from 'types/offerer/rolesData';

import { HttpOffererRoles } from 'http/offerer/httpOffererRoles';
import { HttpOffererRolesInvitation } from 'http/offerer/httpOffererRolesInvitation';
import { TitlePage } from 'components/text/TitlePage';
import BoxNewEntity from 'components/misc/BoxNewEntity';
import OffererRoleDetail from './OffererRoleDetail';
import OffererRoleCard from './OffererRoleCard';
import AssignNewOffererRoleDrawer from './AssignNewOffererRoleDrawer';

interface OffererRolesProps {
  offererId: number;
}

export const OffererRolesListContext = React.createContext({
  editing: false,
  onEdit: (role: OffererRole) => {},
  reloadRoles: () => {},
});

function OffererRolesList({ offererId }: OffererRolesProps) {
  const [isLoadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [openDialogNew, setOpenDialogNew] = useState<boolean>(false);
  const [roles, setRoles] = useState<OffererRole[]>([]);
  const [rolesInvitations, setRolesInvitations] = useState<RoleInvitation[]>(
    [],
  );
  const [viewRole, setViewRole] = useState<OffererRole>();
  const showList: boolean = !viewRole;

  const searchRolesAndInvitations = () => {
    setLoadingRoles(true);
    onShowList();

    Promise.all([
      HttpOffererRoles.getListByOffererId(offererId),
      HttpOffererRolesInvitation.getPendingInvitations(offererId),
    ]).then((values) => {
      setRoles(values[0]);
      setRolesInvitations(values[1]);
      setLoadingRoles(false);
    });
  };

  useEffect(() => {
    searchRolesAndInvitations();
  }, []);

  const mapRoles = () =>
    roles.map((role) => (
      <Grid item xs={12} md={4}>
        <OffererRoleCard role={role} onReload={searchRolesAndInvitations} />
      </Grid>
    ));

  const mapRolesInvitations = () =>
    rolesInvitations.map((invitation) => (
      <Grid item xs={12} md={6}>
        <RoleCard role={invitation as Role} onReload={() => {}} toBeConfirmed />
      </Grid>
    ));

  const mapRolesLoadings = () =>
    [1, 2, 3].map((x) => (
      <Grid item xs={12}>
        <RoleCardSkeleton />
      </Grid>
    ));

  const onShowList = () => {
    setViewRole(undefined);
    setEditing(false);
  };

  const onHandleEdit = (role: OffererRole) => {
    setEditing(true);
    setViewRole(role);
  };

  return (
    <>
      <Grid container item xs={12} justifyContent="center">
        <Grid item xs={12} mb={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {showList && <TitlePage text="Operadores del Oferente en LUC" />}
          </Stack>
        </Grid>

        {isLoadingRoles ? (
          <Grid container spacing={2} item xs={12} sx={{ marginTop: '5px' }}>
            {mapRolesLoadings()}
          </Grid>
        ) : (
          <OffererRolesListContext.Provider
            value={{
              reloadRoles: searchRolesAndInvitations,
              onEdit: onHandleEdit,
              editing: editing,
            }}
          >
            {viewRole ? (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <OffererRoleDetail role={viewRole} onShowList={onShowList} />
                </Grid>
              </Grid>
            ) : rolesInvitations.length || roles.length ? (
              <Grid container spacing={2} item xs={12}>
                {mapRoles()}
                {mapRolesInvitations()}
                <Grid item xs={4}>
                  <BoxNewEntity
                    title={'Agregar Rol'}
                    subtitle={
                      'Hacé click sobre el botón para agregar un nuevo rol'
                    }
                    onClickNew={() => setOpenDialogNew(true)}
                    horizontal={false}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={12}>
                  <Alert severity={'info'}>
                    No se han encontrado roles cargados
                  </Alert>
                </Grid>
                <Grid item xs={4}>
                  <BoxNewEntity
                    title={'Agregar Rol'}
                    subtitle={
                      'Hacé click sobre el botón para agregar un nuevo rol'
                    }
                    onClickNew={() => setOpenDialogNew(true)}
                    horizontal={false}
                  />
                </Grid>
              </Grid>
            )}
          </OffererRolesListContext.Provider>
        )}
      </Grid>

      <AssignNewOffererRoleDrawer
        show={openDialogNew}
        offererId={offererId}
        onCloseDrawer={() => setOpenDialogNew(false)}
        onFinishProcess={() => {
          setOpenDialogNew(false);
          searchRolesAndInvitations();
        }}
      />
    </>
  );
}

export default OffererRolesList;
