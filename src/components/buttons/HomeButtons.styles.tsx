import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
    createStyles({
        appBarButtonRoot: {
            display: 'flex',
            alignItems: 'center',
            whiteSpace: "normal !important",
            lineHeight: 1.2,
            textWrapMode: "wrap",
            wordBreak: "auto-phrase",
            color: 'black',
            maxWidth: '155px !important',
            textAlign: 'center',
            minHeight: '50px !important',
            paddingX: '0px !important',
            textWrapStyle: 'balance',
            justifyContent: 'center !important'
        },
        appBarButtonMobileRoot: {
            padding: '8px 16px!important',
            color: `${theme.palette.text.primary} !important`
        },
        appBarButtonRootActive: {
            color: `${theme.palette.primary.main} !important`
        },
        appBarMenuRootActive: {
            '& > div > div:first-child': {
                color: `${theme.palette.primary.main} !important`
            }
        },
        appBarMenuOptionActive: {
            color: `${theme.palette.primary.main} !important`,
            '& > .MuiListItemIcon-root': {
                color: `${theme.palette.primary.main} !important`,
            }
        }
    }),
);
