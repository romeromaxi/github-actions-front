import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: '0.475rem',
      border: `1px dashed ${theme.palette.grey[300]} !important`,
      padding: '1.5rem !important',
    },
  }),
);
