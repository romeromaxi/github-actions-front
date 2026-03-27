import React from 'react';
import { Stack, Typography } from '@mui/material';
import { userStorage } from '../../util/localStorage/userStorage';

import MessageIcon from '@mui/icons-material/Message';

function UserWelcome() {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography>Hola: {userStorage.getFullName()}</Typography>
      <MessageIcon />
    </Stack>
  );
}

export default UserWelcome;
