import { Stack } from '@mui/material';
import {
  AddButton,
  ButtonIconDropdown,
  MenuItemDropdown,
} from '../../../../components/buttons/Buttons';
import React, { useState } from 'react';
import { HttpOffererWorkTeams } from '../../../../http/offerer/httpOffererWorkTeams';
import {
  OffererWorkTeamView,
  OffererWorkTeamViewFields,
} from '../../../../types/offerer/offererSolicitationData';
import { ITableColumn, TableList } from '../../../../components/table';
import { EditTwoTone } from '@mui/icons-material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import OffererWorkTeamDialog from '../../workTeams/OffererWorkTeamDialog';
import { DialogAlert } from '../../../../components/dialog';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import useAxios from '../../../../hooks/useAxios';
import { useAction } from '../../../../hooks/useAction';
import {HomeOffererLineSecObjects, OffererButtonSecObjects, SecurityComponents} from "../../../../types/security";
import {SafetyComponent} from "../../../../components/security";

interface OffererSummaryWorkTeamsProps {
  offererId: number;
  workTeams?: OffererWorkTeamView[];
  onReload: () => void;
}

const OffererSummaryWorkTeams = ({
  offererId,
  workTeams,
  onReload,
}: OffererSummaryWorkTeamsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedWorkTeam, setSelectedWorkTeam] =
    useState<OffererWorkTeamView>();
  const [deleteTeam, setDeleteTeam] = useState<boolean>(false);
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedWorkTeam(undefined);
  };

  const handleEditWorkTeam = (team: OffererWorkTeamView) => {
    setSelectedWorkTeam(team);
    setOpen(true);
  };

  const handleDeleteWorkTeam = (team: OffererWorkTeamView) => {
    setDeleteTeam(true);
    setSelectedWorkTeam(team);
  };

  const handleCloseDelete = () => {
    setDeleteTeam(false);
    setSelectedWorkTeam(undefined);
  };

  const onDeleteTeam = () => {
    if (selectedWorkTeam) {
      fetchData(
        () =>
          HttpOffererWorkTeams.deleteWorkTeam(
            offererId,
            selectedWorkTeam[EntityWithIdFields.Id],
          ),
        true,
      )
        .then(() => {
          snackbarSuccess('El equipo de trabajo se eliminó correctamente');
          onReload();
        })
        .finally(() => handleCloseDelete());
    }
  };

  const cols: ITableColumn[] = [
    { label: 'Denominación', value: OffererWorkTeamViewFields.Name, textAlign: 'left' },
    { label: '# Usuarios', value: OffererWorkTeamViewFields.UsersQuantity },
    { label: '# Líneas', value: OffererWorkTeamViewFields.ProductLineQuantity },
    {
      label: '',
      value: '',
      onRenderCell: (row: OffererWorkTeamView) => {
        let itemsDropdown: MenuItemDropdown[] = [];

        itemsDropdown.push({
          label: 'Editar',
          icon: <EditTwoTone fontSize={'small'} />,
          onClick: () => handleEditWorkTeam(row),
        });
        itemsDropdown.push({
          label: 'Eliminar',
          icon: <DeleteTwoToneIcon fontSize={'small'} />,
          onClick: () => handleDeleteWorkTeam(row),
        });

        return (
          <ButtonIconDropdown
            label={'Acciones'}
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
      <TableList<OffererWorkTeamView> title={'Equipos de Trabajo'} 
                                      entityList={workTeams}
                                      columns={cols} 
                                      isLoading={!workTeams} 
                                      error={false}
                                      action={(
                                          <SafetyComponent
                                              componentName={SecurityComponents.OffererRolesList}
                                              objectName={OffererButtonSecObjects.OffererButtonNewWorkTeam}
                                          >
                                              <AddButton size={'small'} 
                                                         onClick={() => setOpen(true)}>
                                                  Nuevo
                                              </AddButton>
                                          </SafetyComponent>
                                      )}
      />
      
      <OffererWorkTeamDialog
        open={open}
        onClose={handleCloseDialog}
        workTeam={selectedWorkTeam}
        onReload={onReload}
        offererId={offererId}
      />
      <DialogAlert
        onClose={handleCloseDelete}
        open={deleteTeam}
        title={'Eliminar equipo de trabajo'}
        textContent={
          '¿Estás seguro que deseás eliminar este equipo de trabajo?\n' +
          'Tenga en cuenta que de haber líneas o solicitudes que pertenecen a este equipo van a quedar sin asignación'
        }
        onConfirm={onDeleteTeam}
      />
    </Stack>
  );
};

export default OffererSummaryWorkTeams;
