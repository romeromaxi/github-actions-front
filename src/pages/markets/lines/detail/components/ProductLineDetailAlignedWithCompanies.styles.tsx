import {createStyles, makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {themeColorDefinition, themeTypographyDefinition} from "util/themes/definitions";

export default makeStyles((theme: Theme) =>
    createStyles({
        container: {
            padding: '16px 12px',
            borderRadius: '12px',
            border: `1px solid ${themeColorDefinition.UIElements.borders.primary}`,
            backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary,
        },
        description: {
            fontSize: `${themeTypographyDefinition.label.fontSize} !important`
        }
    }),
);