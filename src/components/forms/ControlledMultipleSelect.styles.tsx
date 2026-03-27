import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { themeColorDefinition } from '../../util/themes/definitions';

export default makeStyles((theme: Theme) => ({
    contentMultipleSelect: {
        backgroundColor: 'transparent',
    },
    chips: {
        display: 'flex !important',
        flexWrap: 'wrap',
        gap: '4px',
    },
    chipsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        //padding: '4px 0',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    chip: {
        margin: 2,
    },
    labelFocused: {
        color: `${themeColorDefinition.systemFeedback.success.primary} !important`,
    },
}));