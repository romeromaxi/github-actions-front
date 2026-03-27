import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Dialog,
  DialogContent,
  Button,
} from '@mui/material';
import { Info, CaretRight, UsersThree } from 'phosphor-react';
import { BackButton } from 'components/buttons/Buttons';
import RoleCard from './RoleCard';
import { Role, RoleFields, RoleInvitation } from 'types/company/rolesData';
import { HttpCompanyRolesInvitation } from 'http/company/httpCompanyRolesInvitation';
import RoleDetail from './RoleDetail';
import AssignNewRoleDrawer from './AssignNewRoleDrawer';
import { useAction } from 'hooks/useAction';
import { useLocation, useNavigate } from 'react-router-dom';
import CompanyInvitationListPage from '../invitations/CompanyInvitationListPage';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { PersonTypes } from 'types/person/personEnums';
import { EntityWithIdAndDescriptionAndDetail, EntityWithIdFields } from '../../../types/baseEntities';
import { BaseIconWrapper, WrapperIcons } from '../../../components/icons/Icons';
import BoxListNewEntity from '../../../components/misc/BoxListNewEntity';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import { CompanyPersonRelationshipFields } from '../../../types/company/companySocietyData';
import { TypographyBase } from '../../../components/misc/TypographyBase';
import { Skeleton } from '@mui/lab';
import { HttpCacheCompany, HttpCompanyRoles } from '../../../http';
import { InfoIcon } from "lucide-react";
import {themeTypographyDefinition} from "../../../util/themes/definitions";

export const RolesListContext = React.createContext({
  editing: false,
  onEdit: (role: Role) => {},
  reloadRoles: () => {},
});

interface CompanyRolesListProps {
  company: CompanyViewDTO;
}

function RoleTypesDialog({ open, onClose, roleTypes }) {
  return (

<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
<DialogContent>
  <Grid container spacing={2}>
    {roleTypes.map((roleType) => (
      <Grid item xs={12} sm={6} md={4} key={roleType.id}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Info color="#2e7d32" size={16} /> 
              <Typography
                variant="h6"
                color="success.dark"
                fontWeight="bold"
                gutterBottom
                sx={{ marginLeft: 1 }}
              >
                {roleType.descripcion}
              </Typography>
            </Stack>
            <Typography variant="subtitle1" color="text.secondary" sx={{ marginTop: 1 }}>
              {roleType.detalle}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</DialogContent>
</Dialog>

  );
}

function CompanyRolesList({ company }: CompanyRolesListProps) {
  const [isLoadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [openDialogNew, setOpenDialogNew] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [viewRole, setViewRole] = useState<Role>();
  const [rolesInvitations, setRolesInvitations] = useState<RoleInvitation[]>([]);
  const [openRoleTypesDialog, setOpenRoleTypesDialog] = useState<boolean>(false);
  const [roleTypes, setRoleTypes] = useState<EntityWithIdAndDescriptionAndDetail[]>([]);

  const companyId = company[EntityWithIdFields.Id];
  const { setTitle } = useAction();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { prevPathname?: string };

  const getTitle = () => {
    if (state && state.prevPathname) {
      const prevPathname = state.prevPathname;
      if (prevPathname.includes('mis-solicitudes')) {
        return 'Mis Solicitudes';
      } else if (prevPathname.includes('mis-empresas')) {
        return 'Mi Empresa';
      }
    }

    return 'Volver';
  };

  const searchRolesAndInvitations = () => {
    setLoadingRoles(true);
    onShowList();

    Promise.all([
      HttpCompanyRoles.getListByCompanyId(companyId),
      HttpCompanyRolesInvitation.getPendingInvitations(companyId),
    ]).then((values) => {
      setRoles(values[0]);
      setRolesInvitations(values[1]);
      setLoadingRoles(false);
    });
  };

  const fetchRoleTypes = () => {
    HttpCacheCompany.getRolesTypesDetails()
        .then(setRoleTypes);
  };

  const renderActions = () => (
    <BackButton
      size={'small'}
      onClick={() => {
        navigate(-1);
      }}
      color={'inherit'}
    >
      {getTitle()}
    </BackButton>
  );

  const setTitleRolePage = (
    companyBusinessName: string | undefined = undefined,
  ) => {
    const title = companyBusinessName
      ? `Roles de ${companyBusinessName}`
      : 'Roles';
    setTitle(
      title,
      renderActions(),
      'Espacio exclusivo para gestionar los operadores de tu PyME en LUC',
    );
  };

  useEffect(() => {
    searchRolesAndInvitations();
    fetchRoleTypes();
  }, []);

  useEffect(() => {
    setTitleRolePage();
  }, []);

  const onShowList = () => {
    setViewRole(undefined);
    setEditing(false);
  };

  const onHandleEdit = (role: Role) => {
    setEditing(true);
    setViewRole(role);
  };

  const mapRoles = () =>
    roles.map((role) => <RoleCard role={role} />);

  const mapRolesInvitations = () =>
    rolesInvitations.map((invitation) => (
      <RoleCard role={invitation as Role} toBeConfirmed />
    ));

  const mapRolesLoadings = () =>
    Array.from(Array(4).keys()).map(() => (
      <Card>
        <CardContent>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Stack spacing={1} width={1}>
              <Skeleton sx={{ width: '40% !important' }} />
              <Skeleton sx={{ width: '25% !important' }} />
            </Stack>
            <Skeleton sx={{ width: '100px !important' }} />
          </Stack>
        </CardContent>
      </Card>
    ));

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <BaseIconWrapper Icon={UsersThree} size={'md'} bg={'#F7FAFC'} />
            <TypographyBase variant={'h4'} fontWeight={500} onClick={!viewRole ? undefined : onShowList}>
              Gestión de Usuarios
            </TypographyBase>
            {
              !!viewRole &&
              <WrapperIcons Icon={CaretRight} size={'md'} />
            }
            {
              !!viewRole &&
              <Stack>
                <Typography variant={'h4'} fontWeight={500}>{viewRole[RoleFields.LegalName]}</Typography>
                <Typography variant={'caption'} color={'text.lighter'}>{stringFormatter.formatCuit(viewRole?.[CompanyPersonRelationshipFields.CUIT] ?? '')}</Typography>
              </Stack>
            }

            <Button color={'info'}
                    variant={'contained'} 
                    onClick={() => setOpenRoleTypesDialog(true)}
                    id={'company-roles-question-btn'}
                    startIcon={<InfoIcon />} 
                    sx={{
                        ...themeTypographyDefinition.button3,
                        fontWeight: 400,
                    }}
            >
                ¿Qué rol puede tener un usuario?
            </Button>


          </Stack>
        </CardContent>
      </Card>

      {isLoadingRoles ? (
        mapRolesLoadings()
      ) : (
        <RolesListContext.Provider
          value={{
            reloadRoles: searchRolesAndInvitations,
            onEdit: onHandleEdit,
            editing: editing,
          }}
        >
          {viewRole ? (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <RoleDetail
                  role={viewRole}
                  companyPersonType={
                    company?.[CompanyViewDTOFields.PersonTypeCode] ||
                    PersonTypes.Physical
                  }
                />
              </Grid>
            </Grid>
          ) : rolesInvitations.length || roles.length ? (
            <Stack spacing={2}>
              {mapRoles()}
              {mapRolesInvitations()}
              <Box sx={{ width: '100%' }}>
                <BoxListNewEntity
                  title={'Agregar nuevo Rol'}
                  onClickNew={() => setOpenDialogNew(true)}
                />
              </Box>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Alert severity={'info'}>
                No se han encontrado roles cargados
              </Alert>
              <BoxListNewEntity
                title={'Agregar nuevo Usuario'}
                onClickNew={() => setOpenDialogNew(true)}
              />
            </Stack>
          )}
        </RolesListContext.Provider>
      )}

      <Grid item xs={12} mt={1} />
      {!viewRole && (
        <CompanyInvitationListPage
          companyId={companyId}
          onReloadAccept={searchRolesAndInvitations}
        />
      )}

      <AssignNewRoleDrawer
        show={openDialogNew}
        companyId={companyId}
        onCloseDrawer={() => setOpenDialogNew(false)}
        onFinishProcess={() => {
          setOpenDialogNew(false);
          searchRolesAndInvitations();
        }}
        companyPersonType={
          company?.[CompanyViewDTOFields.PersonTypeCode] || PersonTypes.Physical
        }
      />

      <RoleTypesDialog
        open={openRoleTypesDialog}
        onClose={() => setOpenRoleTypesDialog(false)}
        roleTypes={roleTypes}
      />
    </Stack>
  );
}

export default CompanyRolesList;