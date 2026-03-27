import {createStyles, makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {themeColorDefinition, themeTypographyDefinition} from "../definitions";

export default makeStyles((theme: Theme) =>
    createStyles({
        root: {
            ...themeTypographyDefinition.button2,
            width: 28,
            height: 28,
            borderRadius: 49,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 180ms',
            userSelect: 'none',
            background: themeColorDefinition.UIElements.backgrounds.disabled,
            color: themeColorDefinition.UIElements.texts.lighter,
            boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`
        },
        completed: {
            background: themeColorDefinition.UIElements.backgrounds.brandSubtle,
            color: `${themeColorDefinition.actions.main.default} !important`,
            boxShadow: 'none'
        },
        active: {
            background: themeColorDefinition.actions.main.default,
            color: `${themeColorDefinition.UIElements.altTexts.default} !important`,
            boxShadow: 'none'
        },
    }),
);
