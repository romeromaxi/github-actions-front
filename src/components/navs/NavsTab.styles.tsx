import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    navsDivider: {
      marginBottom: '12px',
      borderColor: '#676767',
    },
    buttonActive: {
      backgroundColor: '#4784E1',
      color: '#FFFFFF',
    },
    containerNavHorizontal: {
      borderBottom: 1,
    },
    menuPaperSubMenu: {
      minWidth: '275px !important',
      paddingBottom: '0.5rem',
      '& .MuiBox-root': {
        padding: '0.6rem .9rem',
        marginBottom: '-10px',
        borderRadius: '0.475rem',
        width: '100% !important',
        fontWeight: 500,
        fontSize: '1.075rem !important',
        color: theme.palette.grey[600],
        '&:hover': {
          color: theme.palette.success.main,
          backgroundColor: `#F4F6FA !important`,
        },
      },
      '&  > ul > li:first-child .MuiBox-root': {
        '&:hover': {
          cursor: 'default !important',
          backgroundColor: `transparent !important`,
        },
      },
    },
    menuActive: {
      '& .MuiBox-root': {
        color: theme.palette.success.main,
        backgroundColor: `#F4F6FA !important`,
      },
    },
    tabHiddenDefault: {
      visibility: 'hidden',
      width: '0 !important',
      minWidth: '0 !important',
      maxWidth: '0 !important',
      height: '0 !important',
      minHeight: '0 !important',
      padding: '0 !important',
      margin: '0 !important'
    }
  }),
);
