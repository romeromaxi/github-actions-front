import { Card, CardContent, CardHeader, Collapse, Stack } from '@mui/material';
import { UserModelView, UserModelViewFields } from '../../../../types/user';
import { ValidationStatesType } from '../../../../types/person/personEnums';
import PersonValidateStateChip from '../../../internal/person/PersonValidateStateChip';
import {
  DefaultStylesButton,
  ExpandIconButton,
} from '../../../../components/buttons/Buttons';
import React, { Fragment, useState } from 'react';
import UserPersonValidateDetail from './UserPersonValidateDetail';
import ValidateUserIdentityDialog from "../../components/ValidateUserIdentityDialog";

interface UserPersonValidateCardProps {
  user: UserModelView;
  onSubmit: () => void;
}

function UserPersonValidateCard({
  user,
  onSubmit,
}: UserPersonValidateCardProps) {
  const [expand, setExpand] = useState<boolean>(false);
  const [showValidateDialog, setShowValidateDialog] = useState<boolean>(false);

  const openValidateDialog = () => setShowValidateDialog(true);

  const closeValidateDialog = () => setShowValidateDialog(false);

  const renderActionValidate = () => {
    const userState =
      user?.[UserModelViewFields.ValidationIdentityStatusCode] || 0;
    const showButton = [
      ValidationStatesType.LoadProcess,
      ValidationStatesType.Returned,
    ].includes(userState);

    return (
      <Stack mt={0.4} direction={'row'} alignItems={'center'} spacing={1.5}>
        {userState !== ValidationStatesType.LoadProcess && (
          <PersonValidateStateChip
            code={userState}
            label={
              user?.[UserModelViewFields.ValidationIdentityStatusDesc] || ''
            }
          />
        )}
        {showButton && (
          <DefaultStylesButton onClick={openValidateDialog} size={'small'}>
            Valida ahora
          </DefaultStylesButton>
        )}

        {!!userState && userState !== ValidationStatesType.LoadProcess && (
          <ExpandIconButton
            onClick={() => setExpand(!expand)}
            initialExpanded={'expandMore'}
            tooltipTitle={expand ? 'Contraer' : 'Expandir'}
          />
        )}
      </Stack>
    );
  };

  return (
    <Fragment>
      <Card>
        <CardHeader
          title={'Validación de Identidad'}
          action={renderActionValidate()}
        />

        {user && (
          <Collapse in={expand}>
            <CardContent>
              <UserPersonValidateDetail user={user} />
            </CardContent>
          </Collapse>
        )}
      </Card>

      <ValidateUserIdentityDialog
        open={showValidateDialog}
        onClose={closeValidateDialog}
        onReload={onSubmit}
      />
    </Fragment>
  );
}

export default UserPersonValidateCard;
