import React from 'react';
import { Avatar, Tooltip } from '@mui/material';
import {
  OffererWorkTeamView,
  OffererWorkTeamViewFields,
} from 'types/offerer/offererSolicitationData';
import OffererWorkTeamAvatarStyles from './OffererWorkTeamAvatar.styles';

interface OffererWorkTeamAvatarProps {
  workTeam: OffererWorkTeamView;
}

function OffererWorkTeamAvatar({ workTeam }: OffererWorkTeamAvatarProps) {
  const classes = OffererWorkTeamAvatarStyles();
  const workTeamName = workTeam[OffererWorkTeamViewFields.Name];

  function workTeamNameToColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(
      Math.abs(((Math.sin(hash) * 10000) % 1) * 16777216),
    ).toString(16);
    return '#' + Array(6 - color.length + 1).join('0') + color;
  }

  const avatarName = workTeamName
    .split(' ')
    .map((word) => word[0])
    .join('');

  return (
    <Tooltip title={workTeamName}>
      <Avatar
        className={classes.avatar}
        sx={{ bgcolor: workTeamNameToColor(workTeamName) }}
      >
        {avatarName}
      </Avatar>
    </Tooltip>
  );
}

export default OffererWorkTeamAvatar;
