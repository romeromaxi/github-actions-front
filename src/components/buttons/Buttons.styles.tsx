import { createStyles, makeStyles } from '@mui/styles';
import { TypographyProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      gap: '12px',
      padding: '10px',
      borderRadius: '8px',
    },
    darkGreyButton: {
      backgroundColor: '#676767',
      color: '#FFFFFF',
      '&:hover': {
        textDecoration: 'none',
        backgroundColor: '#FFFFFF',
        boxShadow:
          '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);',
        color: '#676767',
      },
    },
    greenButton: {
      backgroundColor: '#FFFFFF',
      color: '#2AA2AA',
      '&:hover': {
        textDecoration: 'none',
        backgroundColor: '#2AA2AA',
        boxShadow:
          '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);',
        color: '#FFFFFF',
      },
    },
    bannerButton: {
      fontSize: '0.8125rem !important',
      borderRadius: '3px !important',
      /*'&:hover': {
            backgroundColor: "#FFC107 !important",
            boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);',
            color: '#111 !important'
        }*/
    },
    bannerButtonSelected: {
      fontSize: '0.8125rem !important',
      borderRadius: '3px !important',
      backgroundColor: '#EFEFEF !important',
      color: '#111 !important',
      '&:hover': {
        backgroundColor: '#c60a19 !important',
        boxShadow:
          '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);',
        color: '#FFF !important',
      },
    },
    doneButton: {
      backgroundColor: '#2AA2AA',
      color: '#FFFFFF',
      '&:hover': {
        textDecoration: 'none',
        backgroundColor: '#2AA2AA',
        boxShadow:
          '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);',
        color: '#00EFFF',
      },
    },
    homeButton: {
      // color: 'white',
      borderRadius: 0,
    },
    homeButtonBorder: {
      borderRight: '2px solid white',
      paddingRight: '10px',
    },
    homeButtonIcon: {
      fontSize: '40px',
    },
    homeButtonLabel: {
      fontStyle: 'normal',
      fontSize: '11px',
      lineHeight: '16px',
      letterSpacing: '1px',
    },
    homeButtonLabelActive: {
      color: '#04D4BB',
    },
    homeButtonPopper: {
      minWidth: '170px',
    },
    inputHidden: {
      '& > div > div > .MuiInputBase-input, .MuiOutlinedInput-notchedOutline, .MuiInput-underline':
        {
          display: 'none !important',
        },
    },
    iconFileButton: {
      backgroundColor: '#F5F5F5 !important',
      '&:hover': {
        backgroundColor: '#929191 !important',
        color: 'white',
      },
    },
    iconLoadingButton: {
      height: '40px',
      maxWidth: '40px !important',
      minWidth: '40px !important',
    },
    menuPaperAll: {
        minWidth: '275px !important',
        width: '275px !important',
        paddingBottom: '0.5rem',
        '& .MuiBox-root': {
            padding: '0.6rem .9rem',
            marginBottom: '-10px',
            borderRadius: '0.475rem',
            width: '100% !important',
            fontWeight: 500,
            fontSize: '1.075rem !important',
            color: theme.palette.grey[800],
            '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: `${theme.palette.grey[100]} !important`,
            },
        },
    },  
    menuPaper: {
      minWidth: '125px !important',
      paddingBottom: '0.5rem',
      '& .MuiBox-root': {
        marginBlockEnd: 'auto',
        borderRadius: '0.475rem',
        width: '100% !important',
        fontWeight: 500,
        fontSize: '1.075rem !important',
      },
      /*'&  > ul > li:first-child .MuiBox-root': {
        '&:hover': {
          cursor: 'default !important',
          backgroundColor: `transparent !important`,
        },
      },*/
    },
    menuDivider: {
      marginBottom: '0px !important',
    },
    iconButton: {
      borderRadius: '50% !important',
      //border: '1px solid lightblue !important',
      padding: '5.8px !important',
      //color: `${theme.palette.primary.main} !important`,
      //'&:hover': {
      //  backgroundColor: 'lightblue !important',
      //},
      '&:disabled': {
        border: '1px solid #00000042 !important',
        '&:hover': {
          backgroundColor: 'transparent !important',
        },
      },
    },
    iconButtonFilled: {
      borderRadius: '50% !important',
      backgroundColor: 'lightblue !important',
      border: '1px solid lightblue !important',
      padding: '5.8px !important',
      color: 'white !important',
      '&:hover': {
        backgroundColor: 'darkblue !important',
        color: 'white !important',
      },
    },
    outlinedButton: {
      color: `${theme.palette.primary.main} !important`,
      border: `1px solid #BDBDBD !important`,
    },
  }),
);

export const EditButtonLabelProps: TypographyProps = {
  color: '#676767 !important',
};

export const EditButtonDataProps: TypographyProps = {
  marginTop: '0.5px',
  marginBottom: '-2px',
  color: '#4784E1',
};
