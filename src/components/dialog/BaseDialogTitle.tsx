import React, { ReactNode } from 'react';
import {
  DialogTitle,
  DialogTitleProps,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {WrapperIcons} from "../icons/Icons";
import { X } from '@phosphor-icons/react';
import {TypographyBase} from "../misc/TypographyBase";

export interface BaseDialogTitleProps extends Omit<DialogTitleProps, 'title'> {
  onClose: () => void;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  action?: ReactNode;
}

function BaseDialogTitle({
  onClose,
  title,
  subtitle,
  action,
  ...rest
}: BaseDialogTitleProps) {
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DialogTitle {...rest}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Stack spacing={1.5}>
          <Typography
            variant={isMobileScreenSize ? 'h5' : 'h4'}
            fontWeight={500}
            sx={{ overflowWrap: 'anywhere' }}
          >
            {title}
          </Typography>
          {
            subtitle &&
              <TypographyBase variant={isMobileScreenSize ? 'body3' : 'body2'}
                              color={'text.lighter'}
              >
                {subtitle}
              </TypographyBase>
          }
        </Stack>

        <Stack direction={'row'} spacing={2} alignItems="center">
          {action && action}
          <IconButton variant={'minPadding'} color="default" onClick={onClose}>
            <WrapperIcons Icon={X} size={'md'} />
          </IconButton>
        </Stack>
      </Stack>
    </DialogTitle>
  );
}

export default BaseDialogTitle;
