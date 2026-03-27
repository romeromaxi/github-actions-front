import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      color: `${theme.palette.primary.contrastText} !important`,
      backgroundColor: `${theme.palette.primary.main} !important`,
    },
    avatarInverted: {
      color: `${theme.palette.secondary.contrastText} !important`,
      backgroundColor: `${theme.palette.secondary.main} !important`,
    },
  }),
);
