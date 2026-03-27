import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
    createStyles({
        labelFilled: {
            /*fontSize: '1.05rem !important',
                  marginBottom: '3px',
                  fontWeight: '500 !important',
                  color: `${theme.palette.grey[800]} !important`*/
            ...theme.typography.caption,
            marginBottom: '3px',
            fontWeight: '500 !important',
            color: `${theme.palette.grey[500]} !important`,
        },
        textFilled: {
            backgroundColor: '#F5F8FA !important',
            borderRadius: '0.625rem !important',
            '& input': {
                border: 'none !important',
                fontWeight: '500 !important',
                color: theme.palette.grey[700],
            },
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                {
                    '-webkit-appearance': 'none',
                    margin: 0,
                },
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
            },
        },
        menuItemSelect: {
            padding: '0.75rem 1.25rem !important',
            color: `${theme.palette.grey[700]} !important`,
            '&:hover': {
                color: `${theme.palette.success.main} !important`,
                backgroundColor: '#F4F6FA !important',
                fontWeight: 600,
            },
            '&.Mui-selected': {
                color: `${theme.palette.success.main} !important`,
                backgroundColor: '#F4F6FA !important',
            },
            '&:hover.Mui-selected': {
                color: `${theme.palette.success.main} !important`,
                backgroundColor: '#F4F6FA !important',
            },
        },
    }),
);