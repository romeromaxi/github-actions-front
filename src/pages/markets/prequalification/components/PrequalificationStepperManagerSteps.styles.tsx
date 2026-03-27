import {createStyles, makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {themeColorDefinition} from "../../../../util/themes/definitions";

export default makeStyles((theme: Theme) =>
    createStyles({
        stepContainer: {
            padding: '16px 8px',
            width: '100%',
            borderRadius: '8px',
            backgroundColor: 'transparent'
        },
        stepContainerActive: {
            backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary
        },
        numberStep: {
            height: '32px',
            width: '32px',
            backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary,
            borderRadius: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        numberStepActive: {
            backgroundColor: 'white'
        }
    }),
);