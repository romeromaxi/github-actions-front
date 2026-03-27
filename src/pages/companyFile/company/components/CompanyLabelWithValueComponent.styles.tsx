import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
    createStyles({
        default: {
            backgroundColor: '#F7FAFC'
        },
        disabled: {
            backgroundColor: '#FAFAFA',
            color: theme.palette.action.disabled,
        }
    })
);