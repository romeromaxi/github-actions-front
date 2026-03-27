import React from 'react';
import { Badge } from '@mui/material';
import { ChatBubbleTwoTone, GamepadTwoTone } from '@mui/icons-material';
import { UserInfoSummaryFields } from 'types/user';
import { useTypedSelector } from 'hooks/useTypedSelector';

function HomeCompanyUserIcon() {
  const { summary } = useTypedSelector((state) => state.userSummary);

  return (
    <Badge
      badgeContent={
        summary ? summary[UserInfoSummaryFields.UnansweredInvitations] : 0
      }
      color="success"
    >
      <GamepadTwoTone />
    </Badge>
  );
}

function NotificationUserIcon() {
  const { summary } = useTypedSelector((state) => state.userSummary);

  return (
    <Badge
      badgeContent={
        summary ? summary[UserInfoSummaryFields.UnreadNotifications] : 0
      }
      color="success"
    >
      <ChatBubbleTwoTone />
    </Badge>
  );
}

export { HomeCompanyUserIcon, NotificationUserIcon };
