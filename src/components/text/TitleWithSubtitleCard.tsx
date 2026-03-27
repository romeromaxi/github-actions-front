import React from 'react';
import { Stack, Typography } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography/Typography';

interface TitleWithSubtitleCardProps {
  title: string;
  subtitle: string;
  subtitleProps?: TypographyProps;
  themed?: boolean;
}

function TitleWithSubtitleCard(props: TitleWithSubtitleCardProps) {
  return (
    <Stack spacing={1}>
      <Typography
        fontSize={'1.2rem'}
        fontWeight={600}
        color={props.themed ? 'primary' : 'dark'}
      >
        {props.title}
      </Typography>

      <Typography
        fontWeight={500}
        color={'text.disabled'}
        {...props.subtitleProps}
      >
        {props.subtitle}
      </Typography>
    </Stack>
  );
}

export default TitleWithSubtitleCard;
