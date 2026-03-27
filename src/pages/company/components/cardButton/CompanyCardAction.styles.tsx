import {createStyles, makeStyles} from '@mui/styles';
import {Theme} from "@mui/material/styles";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: 'box-shadow 0.2s ease',
      '&:hover': {
        boxShadow: 'inset 0 0 0 1px #ECECEC, 0px 8px 16px -2px rgba(27, 33, 44, 0.12) !important',
      },
    },
  }),
);
