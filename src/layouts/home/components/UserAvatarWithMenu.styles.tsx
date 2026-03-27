import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { redColorErrorText } from 'util/themes/ThemeItapTec';

export default makeStyles((theme: Theme) =>
  createStyles({
    menuPaper: {
      minWidth: '275px !important',
      width: '275px !important',
      paddingBottom: '0.5rem',
      '& .MuiBox-root': {
        borderRadius: '0.475rem',
        width: '100% !important',
        fontWeight: 500,
        fontSize: '1.075rem !important',
      },
    },
    menuDivider: {
      marginBottom: '0px !important',
    },
    namePersonalData: {
      color: `${theme.palette.grey[900]} !important`,
      whiteSpace: 'pre-wrap',
    },
    containerUser: {
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: '#007aff17',
        paddingLeft: '0.5rem',
        borderRadius: '0.475rem',
      },
    },
  }),
);
