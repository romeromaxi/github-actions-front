import {createStyles, makeStyles} from '@mui/styles';
import {Theme} from "@mui/material/styles";
import {borderDashedSvg} from "util/helpers/borderDashedHelper";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '20px 19px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '240px',
      width: '100%',
      alignContent: 'center',
      backgroundImage: borderDashedSvg(theme.palette.success.dark, 12),
      '& *': {
        cursor: 'pointer !important',
      },
    }
  }),
);