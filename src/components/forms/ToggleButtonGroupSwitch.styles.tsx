import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import {themeColorDefinition} from "util/themes/definitions";

export default makeStyles((theme: Theme) => ({
    container: {
        display: 'flex',
        backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary,
        borderRadius: '20px',
        padding: '4px',
        transition: 'transform 0.3s ease',
    },
    button: {
        flex: 1,
        border: 'none',
        borderRadius: '20px',
        backgroundColor: 'transparent',
        fontWeight: 'normal',
        cursor: 'pointer',
        padding: '8px 16px',
        transition: 'all 0.3s ease',
        color: themeColorDefinition.UIElements.texts.lighter,
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: '#e5e7eb',
        },
        '& > span:hover': {
            cursor: 'pointer',
        },
        '&.selected': {
            backgroundColor: 'white',
            color: themeColorDefinition.UIElements.texts.default,
        }
    }
}));