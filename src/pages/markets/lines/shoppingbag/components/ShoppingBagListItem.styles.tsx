import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      borderRadius: '16px !important',
      padding: '8px 16px !important',
      width: '100% !important',
      fontSize: '14px !important',
      '& > div > div > .MuiTypography-root': {
        fontWeight: 600,
        fontSize: '14px !important',
      },
      '& > div > div .MuiListItemText-primary': {
        fontWeight: 600,
        fontSize: '14px !important',
      },
      '&:hover': {
        '& > div > div > .MuiTypography-root': {
          fontWeight: 600,
          fontSize: '14px !important',
        },
        '& > div > div .MuiListItemText-primary': {
          fontWeight: 600,
          fontSize: '14px !important',
        },
      },
    },
      
    listItemActive: {
      borderRadius: '16px !important',
      backgroundColor: "transparent !important",
      '& > div > div > .MuiTypography-root': {
        fontWeight: 600,
        fontSize: '14px !important'
      },
      '& > div > div .MuiListItemText-primary': {
        fontWeight: 600,
        fontSize: '14px !important'
      },
    },
    listItemDisabled: {
      cursor: 'not-allowed !important',
      opacity: 0.65,
      fontSize: '14px !important',
      '&:hover': {
        color: `black !important`,
        fontSize: '14px !important',
        '& > div > div > .MuiTypography-root': {
          fontWeight: 400,
          fontSize: '14px !important',
        },
        '& > div > div .MuiListItemText-primary': {
          fontWeight: 400,
          fontSize: '14px !important',
        },
      },
    },
  }),
);
