import {createStyles, makeStyles} from '@mui/styles';
import {Theme} from "@mui/material/styles";
import {themeColorDefinition} from "util/themes/definitions";

export default makeStyles((theme: Theme) =>
    createStyles({
        rootContainer: {
            padding: '12px',
            borderRadius: '10px',
            boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.texts.tertiary}`,
            cursor: 'pointer',
            '& *': {
                cursor: 'pointer !important',
            }
        },
        containerSelected: {
            boxShadow: `inset 0 0 0 1px ${theme.palette.success.main} !important`,
        },
    })
);
