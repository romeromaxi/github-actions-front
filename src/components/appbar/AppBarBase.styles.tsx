import {createStyles, makeStyles} from '@mui/styles';
import {Theme} from "@mui/material/styles";

export default makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            left: '0px',
            top: '0px',
            borderRadius: '0px 0px 16px 16px',
            background: 'rgba(255, 255, 255, 0.6) !important',
            boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.2) !important',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0,
        },
        appBarBlur: {
            backdropFilter: 'blur(31.05px) !important',
        },
        appBarActive: {
            background: 'rgba(255, 255, 255) !important',
        },
    })
);
