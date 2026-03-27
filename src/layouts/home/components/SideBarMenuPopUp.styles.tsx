import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    menuPaper: {
      minWidth: '350px !important',
      width: '350px !important',
      paddingBottom: '0.5rem',
      '&  > ul ': {
        paddingTop: '0 !important',
      },
    },
    titlePaper: {
      height: '45px',
      display: 'grid',
      textAlign: 'center',
      alignContent: 'center',
      backgroundColor: theme.palette.primary.main,
    },
    menuOption: {
      padding: '0.6rem .9rem',
      marginBottom: '-10px',
      borderRadius: '0.475rem',
      width: '100% !important',
      fontWeight: 500,
      fontSize: '1.075rem !important',
      color: theme.palette.grey[800],
      textWrap: 'balance',
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: `${theme.palette.grey[100]} !important`,
      },
    },
    menuOptionActive: {
      color: theme.palette.primary.main,
      backgroundColor: `${theme.palette.grey[100]} !important`,
    },
  }),
);
