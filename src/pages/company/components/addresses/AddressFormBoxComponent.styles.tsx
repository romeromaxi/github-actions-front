import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { blueColorBase, lightBlueColorLight } from 'util/themes/ThemeItapTec';
import {themeColorDefinition} from "util/themes/definitions";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
        border: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`, 
        borderRadius: '16px', 
        padding: '16px',
    },
    rootButton: {
      borderRadius: '0.475rem',
      border: `1px dashed ${blueColorBase} !important`,
      backgroundColor: lightBlueColorLight,
      padding: '1.5rem !important',
      width: '100% !important',
    },
    address: {
      fontSize: '13px',
      fontStyle: 'italic',
    },
    addressButton: {
      fontSize: '13px',
      fontStyle: 'italic',
      textAlign: 'left',
      whiteSpace: 'nowrap',
      padding: 0,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  }),
);
