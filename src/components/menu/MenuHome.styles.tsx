import {createStyles, makeStyles} from '@mui/styles';
import {Theme} from "@mui/material/styles";

export default makeStyles((theme: Theme) => 
    createStyles({
      appBar: {
        /* Auto layout */
        //height: '102px',
        left: '0px',
        top: '0px',
        // backgroundColor: "#FFFFFF",
        borderRadius: '0px 0px 16px 16px', 
        background: 'rgba(255, 255, 255, 0.6) !important',
        boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.2);', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 5,
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
        '& *': {
          fontFamily: `${theme.typography.fontFamily} !important`,
        },
      },
      appBarBlur: {
        backdropFilter: 'blur(31.05px) !important',
      },
      appBarActive: {
        background: 'rgba(255, 255, 255) !important',
      },
      
      toolBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px',

        position: 'static',
        width: '1272px',
        height: '64px',
        left: '120px',
        top: '20px',

        /* Inside auto layout */

        flex: 'none',
        order: '0',
        flexGrow: '0',
        margin: '0px 0px',
      },
      frameMenu: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px',

        position: 'static',
        width: 745,
        height: 64,
        left: 0,
        top: 0,

        /* Inside auto layout */

        flex: 'none',
        order: 0,
        flexGrow: 0,
        margin: '0px 0px',
      },
      frameLogo: {
        width: '145px',
        height: '64px',
        /* Inside auto layout */
        flex: 'none',
        order: 0,
        flexGrow: 0,
      },
      frameLinks: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '0px',
        gap: '12px',

        width: '545px',
        height: '48px',

        /* Inside auto layout */

        flex: 'none',
        order: '1',
        flexGrow: '0',
        color: '#515151',
      },
      frameButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0px',
        gap: '12px',

        height: '48px',

        /* Inside auto layout */

        flex: 'none',
        order: '1',
        flexGrow: '0',
      },
      selectedAppBarButton: {
        fontWeight: '500 !important',
        color: `${theme.palette.primary.main} !important`,
      }
    })
);
