import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: '0.475rem',
      border: `1px dashed ${theme.palette.grey[300]} !important`,
      padding: '1.75rem !important',
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: '3rem',
        color: theme.palette.text.disabled,
      },
      '&:hover': {
        border: `1px dashed ${theme.palette.primary.main} !important`,
        backgroundColor: `${theme.palette.primary.light} !important`,
        '& .MuiSvgIcon-root': {
          color: `${theme.palette.primary.main} !important`,
        },
      },
    },
    active: {
      border: `1px dashed ${theme.palette.primary.main} !important`,
      backgroundColor: `${theme.palette.primary.light} !important`,
      '& .MuiSvgIcon-root': {
        color: `${theme.palette.primary.main} !important`,
      },
    },
    boxDisabled: {
      opacity: '0.8',
      pointerEvents: 'none',
    },
  }),
);
