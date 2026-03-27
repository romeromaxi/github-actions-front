import {createStyles, makeStyles} from '@mui/styles';
import {Theme} from "@mui/material/styles";
import { themeColorDefinition } from 'util/themes/definitions';
import {borderDashedSvg} from "util/helpers/borderDashedHelper";

export default makeStyles((theme: Theme) =>
    createStyles({
        containerRoot: {
            padding: '16px',
            borderRadius: '16px',
            width: '100% !important'
        },
        containerSent: {
            border: `1px solid ${themeColorDefinition.UIElements.borders.tertiary}`
        },
        containerPending: {
            backgroundImage: borderDashedSvg(theme.palette.warning.main, 16)
        }
    })
);
