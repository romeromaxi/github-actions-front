import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
/*77838f */
const DropzoneFieldStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropzoneBox: {
      height: '100%',
      minHeight: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      cursor: 'pointer',
      color: '#77838F',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderColor: '#009578',
      borderRadius: '10px',
    },
    border: {
      borderColor: '#E7EAF3',
      backgroundColor: '#F8FAFD',
    },
    borderDrag: {
      borderColor: '#9BCDFF',
      backgroundColor: '#E7F6FD',
      color: '#1976D2',
    },
    borderDrag2: {
      borderColor: '#1976d2',
      backgroundColor: '#E7F6FD',
      color: '#1976d2',
    },
    borderError: {
      borderColor: theme.palette.error.light,
    },
  }),
);

export default DropzoneFieldStyles;
