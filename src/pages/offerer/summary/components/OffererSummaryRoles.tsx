import {
  Stack,
  Typography,
} from '@mui/material';
import {
  AddButton,
  ButtonIconDropdown,
  MenuItemDropdown,
} from '../../../../components/buttons/Buttons';
import React, { useState } from 'react';
import { HttpOffererRoles } from '../../../../http';
import {
  OffererRole,
  OffererRoleFields,
  RoleFields,
} from '../../../../types/offerer/rolesData';
import { ITableColumn, TableList } from '../../../../components/table';
import { stringFormatter } from '../../../../util/formatters/stringFormatter';
import { EditTwoTone } from '@mui/icons-material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AssignNewOffererRoleDrawer from '../../roles/AssignNewOffererRoleDrawer';
import useAxios from '../../../../hooks/useAxios';
import { useAction } from '../../../../hooks/useAction';
import { DialogAlert } from '../../../../components/dialog';
import OffererRoleDetail from '../../roles/OffererRoleDetail';

interface OffererSummaryRolesProps {
  offererId: number;
  roles?: OffererRole[];
  onReload: () => void;
}

const OffererSummaryRoles = ({
  offererId,
  roles,
  onReload,
}: OffererSummaryRolesProps) => {
  const [openNew, setOpenNew] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const { fetchData } = useAxios();
  const [selectedRole, setSelectedRole] = useState<OffererRole>();
  const { snackbarSuccess } = useAction();
  const onShowConfirmDelete = (role: OffererRole) => {
    setSelectedRole(role);
    setShowConfirmDelete(true);
  };

  const onCancelDelete = () => {
    setSelectedRole(undefined);
    setShowConfirmDelete(false);
  };

  const onConfirmDelete = () => {
    if (selectedRole) {
      fetchData(
        () =>
          HttpOffererRoles.delete(
            offererId,
            selectedRole[OffererRoleFields.UserId],
          ),
        true,
      ).then(() => {
        snackbarSuccess('¡El operador se ha eliminado con éxito!');
        setShowConfirmDelete(false);
        onReload();
      });
    }
  };

  const onShowEdit = (role: OffererRole) => {
    setEditing(true);
    setSelectedRole(role);
  };
  const onCancelEdit = () => {
    setEditing(false);
    setSelectedRole(undefined);
  };

  const handleSaveRole = () => {
    onCancelEdit();
    onReload();
  };

  const cols: ITableColumn[] = [
    {
      label: 'Nombre y apellido',
      value: OffererRoleFields.Name,
      width: '27%',
      onRenderCell: (row: OffererRole) => (
        <Typography>{`${row[OffererRoleFields.Name]} ${row[OffererRoleFields.LastName]}`}</Typography>
      ),
    },
    {
      label: 'CUIT',
      value: OffererRoleFields.CUIT,
      onRenderCell: (row: OffererRole) => (
        <Typography>
          {stringFormatter.formatCuit(row[OffererRoleFields.CUIT])}
        </Typography>
      ),
    },
    {
      label: '# Roles',
      value: OffererRoleFields.GroupIds,
      onRenderCell: (row: OffererRole) => (
        <Typography>{row[OffererRoleFields.GroupIds].length}</Typography>
      ),
    },
    {
      label: '# Equipos',
      value: OffererRoleFields.WorkTeamIds,
      onRenderCell: (row: OffererRole) => (
        <Typography>{row[OffererRoleFields.WorkTeamIds].length}</Typography>
      ),
    },
    {
      label: '',
      value: '',
      onRenderCell: (row: OffererRole) => {
        let itemsDropdown: MenuItemDropdown[] = [];

        itemsDropdown.push({
          label: 'Editar',
          icon: <EditTwoTone fontSize={'small'} />,
          onClick: () => onShowEdit(row),
        });
        itemsDropdown.push({
          label: 'Eliminar',
          icon: <DeleteTwoToneIcon fontSize={'small'} />,
          onClick: () => onShowConfirmDelete(row),
        });

        return (
          <ButtonIconDropdown
            label={''}
            items={itemsDropdown}
            color={'inherit'}
            size={'small'}
          />
        );
      },
    },
  ];

  return (
    <Stack spacing={2}>
      <TableList<OffererRole> entityList={roles} 
                              title={'Usuarios'}
                              columns={cols} 
                              error={false} 
                              isLoading={!roles} 
                              action={(
                                  <AddButton size={'small'} 
                                             onClick={() => setOpenNew(true)}>
                                    Nuevo
                                  </AddButton>
                              )}
      />

      <AssignNewOffererRoleDrawer
        show={openNew}
        offererId={offererId}
        onCloseDrawer={() => setOpenNew(false)}
        onFinishProcess={() => {
          setOpenNew(false);
          onReload();
        }}
      />
      {selectedRole && (
        <DialogAlert
          open={showConfirmDelete}
          onClose={onCancelDelete}
          onConfirm={onConfirmDelete}
          textContent={`¿Estás seguro que deseás eliminar al usuario ${selectedRole[RoleFields.LegalName]}?`}
        />
      )}
      {selectedRole && editing && (
        <OffererRoleDetail
          role={selectedRole}
          onShowList={onCancelEdit}
          onSave={handleSaveRole}
        />
      )}
    </Stack>
  );
};

export default OffererSummaryRoles;
