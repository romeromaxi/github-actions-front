import React, { useContext, useState } from 'react';
import { Button, Card, CardContent, Chip, Stack, Tooltip } from '@mui/material';

import { Role, RoleFields } from 'types/offerer/rolesData';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { DeleteTwoTone, EditTwoTone } from '@mui/icons-material';
import TitleWithSubtitleCard from 'components/text/TitleWithSubtitleCard';
import { HttpOffererRoles } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import { DialogAlert } from 'components/dialog';
import { useAction } from 'hooks/useAction';
import { RolesListContext } from '../../company/roles/CompanyRolesList';

interface RoleCardProps {
  role: Role;
  toBeConfirmed?: boolean;
  onReload: () => void;
}

export const RoleCardContext = React.createContext({
  role: {} as Role,
  toBeConfirmed: false,
});

function RoleCard({ role, toBeConfirmed, onReload }: RoleCardProps) {
  const { showLoader, hideLoader } = useAction();
  const { reloadRoles, onEdit } = useContext(RolesListContext);

  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  const renderTitle = () => {
    let subtitle: string = role[RoleFields.UserRelationshipDesc];
    let subtitleProps = undefined;

    if (toBeConfirmed) {
      subtitle = 'En espera de confirmación por el usuario';
      subtitleProps = { fontStyle: 'italic', fontSize: '0.9rem' };
    }

    return (
      <TitleWithSubtitleCard
        title={role[RoleFields.LegalName]}
        subtitle={subtitle}
        subtitleProps={subtitleProps}
      />
    );
  };

  const onHandleEdit = () => onEdit(role);

  const onShowConfirmDelete = () => setShowConfirmDelete(true);

  const onCancelDelete = () => setShowConfirmDelete(false);

  const onConfirmDelete = () => {
    showLoader();
    HttpOffererRoles.delete(
      role[RoleFields.OffererId],
      role[EntityWithIdFields.Id],
    ).then(() => {
      setShowConfirmDelete(false);
      hideLoader();
      reloadRoles();
    });
  };

  return (
    <RoleCardContext.Provider
      value={{ role, toBeConfirmed: toBeConfirmed ?? false }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%' }}>
          <Stack
            justifyContent={'space-between'}
            sx={{ height: '100%' }}
            spacing={3}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              {renderTitle()}
              <Tooltip arrow title="CUIT" placement="top">
                <Chip
                  color="info"
                  size="small"
                  label={stringFormatter.formatCuit(role[RoleFields.CUIT])}
                />
              </Tooltip>

              {/*<IconButton onClick={onHandleDetail}>
                                    <SearchRounded />
                                </IconButton>*/}
            </Stack>

            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              mt={1}
            >
              <Button
                variant={'contained'}
                size={'small'}
                color={'inherit'}
                onClick={onHandleEdit}
                startIcon={<EditTwoTone />}
                disabled={toBeConfirmed}
              >
                Editar
              </Button>
              <Button
                variant={'outlined'}
                size={'small'}
                color={'error'}
                onClick={onShowConfirmDelete}
                startIcon={<DeleteTwoTone />}
                disabled={toBeConfirmed}
              >
                Eliminar
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <DialogAlert
        open={showConfirmDelete}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        textContent={`¿Estás seguro que deseás eliminar al usuario ${role[RoleFields.LegalName]}?`}
      />
    </RoleCardContext.Provider>
  );
}

export default RoleCard;
