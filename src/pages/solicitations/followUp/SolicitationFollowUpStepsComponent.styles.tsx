import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import {themeColorDefinition} from "util/themes/definitions";

export default makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: '16px',
            padding: '24px',
            height: '-webkit-fill-available',
            width: '-webkit-fill-available'
        },
        currentStep: {
            // @ts-ignore
            boxShadow: `inset 0 0 0 2px ${theme.palette.accent.dark}`,
            backgroundColor: '#E8EEF9 !important',
            '& *': {
                // @ts-ignore
                color: `${theme.palette.accent.dark} !important`,
            }
        },
        currentInProgressStep: {
            backgroundColor: '#3677ED !important',
            backgroundImage: 'url(/images/allies-texture.png)',
            '& *': {
                color: themeColorDefinition.UIElements.altTexts.default
            }
        },
        completeStep: {
            boxShadow: `inset 0 0 0 2px ${theme.palette.success.main}`,
            '& *': {
                color: '#006A39 !important'
            }
        },
        successResultStep: {
            backgroundColor: theme.palette.primary.dark,
            backgroundImage: 'url(/images/allies-texture.png)',
            '& *': {
                color: themeColorDefinition.UIElements.altTexts.default
            }
        },
        failureResultStep: {
            boxShadow: `inset 0 0 0 1px #720800`,
            backgroundColor: '#FDF6F6 !important',
            '& *': {
                color: '#720800'
            }
        }
    }),
);
