import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    popup: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.22)',
      display: 'flex',
      justifyContent: 'center',
      zIndex: 1,
      color: 'black',
      alignItems: 'center',
    },
    innerPopup: {
      position: 'relative',
      padding: '32px',
      width: '100%',
      maxWidth: '720px',
      borderRadius: '8px',
      backgroundColor: 'white',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      zIndex: 1,
      color: 'black',
      alignItems: 'center',
    },
  }),
);
