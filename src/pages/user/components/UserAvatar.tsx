import React from 'react';
import { Avatar } from '@mui/material';
import { userStorage } from 'util/localStorage/userStorage';

function UserAvatar() {
  const user = userStorage.get();

  function stringAvatar(name: string) {
    return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  return (
    <Avatar
      {...stringAvatar(`${user?.fullName}`)}
      sx={{
        width: 76,
        height: 76,
        fontSize: '26px',
        color: 'primary.contrastText',
        bgcolor: 'primary.main',
      }}
    />
  );
}

export default UserAvatar;
