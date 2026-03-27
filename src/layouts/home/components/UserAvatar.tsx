import React from 'react';
import {Badge} from '@mui/material';
import { userStorage } from 'util/localStorage/userStorage';
import UserAvatarStyles from './UserAvatar.styles';
import {Avatar} from "components/avatar/Avatar";
import {WrapperIcons} from "components/icons/Icons";
import {CaretDown} from "@phosphor-icons/react";

interface UserAvatarProps {
    hasMenu?: boolean
}

function UserAvatar({ hasMenu = false }: UserAvatarProps) {
  const classes = UserAvatarStyles();
  const initialsName = userStorage.getInitialsName();

  const avatarComponent =
      <Avatar size={'md'} className={classes.avatar}>
          {initialsName}
      </Avatar>;
    
  if (!hasMenu) return avatarComponent;  
    
  return (
      <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
             badgeContent={<WrapperIcons Icon={CaretDown} size={'xs'} />}
             overlap={'circular'}
             color={'default'}
      >
          {avatarComponent}
      </Badge>
  );
}

export default UserAvatar;
