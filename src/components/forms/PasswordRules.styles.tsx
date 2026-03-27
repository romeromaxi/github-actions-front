import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
    createStyles({
        ruleItem: {
            fontSize: '12px',
            '& svg': {
                fontSize: '14px'
            }
        },
        ruleItemValid: {
            color: `${theme.palette.success.main} !important`,
            '& *': {
                color: `${theme.palette.success.main} !important`,
            }
        },
    }),
);