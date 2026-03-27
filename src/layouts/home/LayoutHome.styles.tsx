import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { blueColorBase, whiteColor } from 'util/themes/ThemeItapTec';

const menuOpenWidth: number = 325;
const sideBarBaseWidth: number = 100;
const thresholdIconButton: number = 18;

export default makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: 'white !important',
      paddingLeft: `${sideBarBaseWidth}px !important`,
    },
    appBarShift: {
      paddingLeft: `${menuOpenWidth}px !important`,
      transition: theme.transitions.create(['padding'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    appBarMediumWindow: {
      paddingLeft: `0px !important`,
    },
    sideBarBase: {
      width: `${sideBarBaseWidth}px`,
      backgroundColor: `${whiteColor} !important`,
    },
    boxSideBarResponsive: {
      width: `${sideBarBaseWidth}px`,
      backgroundColor: `${whiteColor} !important`,
    },
    containerBase: {
      minHeight: '900px !important',
      paddingTop: `25px !important`,
    },
    container: {
      paddingLeft: `130px !important`,
      transition: theme.transitions.create(['padding'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    containerPerson: {
        paddingLeft: `130px !important`,
        transition: theme.transitions.create(['padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    containerPaddingBottom: {
        paddingBottom: `15px !important`,
    },
    containerShift: {
      paddingLeft: `330px !important`,
      transition: theme.transitions.create(['padding'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    imageLogo: {
      height: '35px',
      width: '62px',
    },
    iconButton: {
      zIndex: '1201 !important',
      bottom: '16px !important',
      left: `${sideBarBaseWidth - thresholdIconButton}px !important`,
      transition: theme.transitions.create('left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    iconButtonShift: {
      left: `${menuOpenWidth - thresholdIconButton}px !important`,
      transition: theme.transitions.create('left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    iconMenu: {
      height: '23px !important',
      width: '23px !important',
    },
    menuContainer: {
      marginLeft: `${sideBarBaseWidth + 20}px !important`,
    },
    menuOpen: {
      zIndex: '1199 !important',
      width: menuOpenWidth,
    },
    menuClose: {
      overflowX: 'hidden',
      '&:hover': {
        width: menuOpenWidth,
      },
    },
    listMenuItem: {
      maxWidth: '41.65px !important',
      maxHeight: '41.65px !important',
      borderRadius: '0.475rem !important',
      justifyContent: 'center !important',
      color: `${theme.palette.primary.main} !important`,
      '&:hover': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        color: `${theme.palette.primary.main} !important`,
      },
      '& svg': {
        fontSize: '2rem !important',
      },
    },
    listSubmenuItem: {
      marginLeft: '36px !important',
      paddingTop: '5px !important',
      paddingBottom: '5px !important',
      marginTop: '-5px !important',
    },
    listMenuItemSmall: {
      maxWidth: '35px !important',
      maxHeight: '35px !important',
      borderRadius: '0.475rem !important',
      justifyContent: 'center !important',
      color: `${theme.palette.primary.main} !important`,
      '&:hover': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        color: `${theme.palette.primary.main} !important`,
      },
      '& svg': {
        fontSize: '1.75rem !important',
      },
    },
    listMenuItemActive: {
      backgroundColor: `${theme.palette.grey[300]} !important`,
    },
    listMenuItemDisabled: {
      color: `${theme.palette.grey[700]} !important`,
      '&:hover': {
        cursor: 'not-allowed !important',
      },
    },
  }),
);
