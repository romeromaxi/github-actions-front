import {createStyles, makeStyles} from '@mui/styles';
import {Theme} from "@mui/material/styles";
import {borderDashedSvg} from "util/helpers/borderDashedHelper";

export default makeStyles((theme: Theme) =>
    createStyles({
      root: {
        padding: '16px',
        borderRadius: '12px',
        cursor: 'pointer',
        height: '-webkit-fill-available',  
        width: '100%',
        display: 'grid',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        backgroundImage: borderDashedSvg(theme.palette.success.dark, 12),
        '&:hover': {
          transform: 'translateY(-2px)',
        },
        '& *': {
          cursor: 'pointer !important',
        },
      },
    }),
);