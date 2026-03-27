import React, { useContext, useState } from 'react';
import { Stack } from '@mui/material';

import { EditButtonWithData } from 'components/buttons/Buttons';

import { UserProfilePageContext } from 'pages/user/profile/UserProfilePage';
import ChangePasswordDrawer from 'pages/user/changePassword/ChangePasswordDrawer';
import ChangePersonalDataDrawer from '../../PersonalData/ChangePersonalDataDrawer';

import { UserModelViewFields } from 'types/user';
import { PinConfirmationMode } from 'types/user/userAuth-enum';
import {stringFormatter} from "../../../../util/formatters/stringFormatter";
import {userStorage} from "../../../../util/localStorage/userStorage";
import {Module} from "../../../../types/form/login/login-enum";

function UserPersonalModifyData() {
  const { user, setReload } = useContext(UserProfilePageContext);

  const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
  const [pinConfirmation, setPinConfirmation] = useState<PinConfirmationMode>();

  //const onEditMail = () => setPinConfirmation(PinConfirmationMode.Mail);

  const onEditPassword = () => setOpenChangePassword(true);

  const onCloseEditPassword = () => setOpenChangePassword(false);

  const onCloseEditPersonalData = () => setPinConfirmation(undefined);

  const onSubmitEditPersonalData = () => {
    setReload(true);
    setPinConfirmation(undefined);
  };

  const onEditPhoneNumber = () => setPinConfirmation(PinConfirmationMode.Phone);

  const isUserOfferer = userStorage.getUserType() === Module.Offerer

  return (
    <Stack direction="row" justifyContent="space-between" alignItems={'center'}>
      {user && (
        <Stack direction="row" justifyContent="space-between">
          <EditButtonWithData
            label="Contraseña"
            data={'***************'}
            onClick={onEditPassword}
          />
        </Stack>
      )}
      {user && !isUserOfferer && (
        <Stack direction="row" justifyContent="space-between">
          <EditButtonWithData
            label="Teléfono"
            data={stringFormatter.phoneNumberWithAreaCode(
              user[UserModelViewFields.AreaCode] ? user[UserModelViewFields.AreaCode].toString() : undefined,
              user[UserModelViewFields.PhoneNumber] ? user[UserModelViewFields.PhoneNumber].toString() : undefined
            )}
            onClick={onEditPhoneNumber}
          />
        </Stack>
      )}

      <ChangePasswordDrawer
        show={openChangePassword}
        onCloseDrawer={onCloseEditPassword}
        onFinishProcess={onCloseEditPassword}
      />

      <ChangePersonalDataDrawer
        show={!!pinConfirmation}
        onCloseDrawer={onCloseEditPersonalData}
        onFinishProcess={onSubmitEditPersonalData}
        pinMode={pinConfirmation ?? PinConfirmationMode.Phone}
      />
    </Stack>
  );
}

export default UserPersonalModifyData;
