import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    boxContainer: {
      borderWidth: '1px',
      borderStyle: 'dashed',
      borderColor: theme.palette.grey[300],
      borderRadius: '0.475rem',
      padding: '0.75rem 1rem !important',
    },
    boxLoading: {
      maxWidth: '125px',
    },
  }),
);
