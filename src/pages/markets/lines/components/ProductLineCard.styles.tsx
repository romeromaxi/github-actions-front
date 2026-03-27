import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import {themeColorDefinition, themeShadowDefinition} from "util/themes/definitions";

export default makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '16px !important',
            borderRadius: '24px !important',
            minHeight: '300px',
            
            
            //minWidth: '303px',
            //maxWidth: '303px',
            //maxHeight: '418px',
            //boxShadow: `inset 0 0 0 2px ${themeColorDefinition.UIElements.borders.secondary}, 0 0 0 0 rgba(0, 0, 0, 0) !important`,
            
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            position: 'relative',
            '&:hover': {
                boxShadow: `inset 0 0 0 2px ${themeColorDefinition.UIElements.borders.secondary}, ${themeShadowDefinition.md.boxShadow} !important`,
                transition: 'boxShadow 0.3s ease',
            }
        },
        withBorder: {
            boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.tertiary} !important`,
        },
        link: {
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit !important',
            cursor: 'pointer'
        },
        chipRecommended: {
            backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary,
            borderRadius: '0em 0em 1em 1em',
            margin: '0 auto'
        }
    }),
);
