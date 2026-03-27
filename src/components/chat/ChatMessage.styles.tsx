import {makeStyles} from '@mui/styles';

export default makeStyles({
    sentHeader: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 1,
    },
    receivedHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '5px',
    },

    sentHeaderTypography: {
        marginRight: 13,
        paddingRight: 8,
    },
    receivedHeaderTypography: {
        marginLeft: 2,
        paddingLeft: 3,
    },
    sentContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginRight: 2,
    },
    receivedContainer: {
        display: 'flex',
    },

    messageTypographyBase: {
        padding: '1rem 1.25rem',
        borderRadius: '.475rem',
        fontWeight: '400 !important',
        fontSize: 16,
        width: '650px',
        lineHeight: '24px',
        position: 'relative',
        wordWrap: 'break-word',
        wordBreak: 'break-all',
        overflowWrap: 'anywhere',
        backgroundColor: '#F2F2F2',
    },
    sentTypography: {
        alignSelf: 'flex-end',
        padding: '12px',
        borderRadius: '12px',
    },
    receivedTypography: {
        marginBottom: '12px',
        padding: '12px',
        gap: '10px',
        borderRadius: '12px'
    },
    receivedUnreadMessage: {
        border: '2px solid #309D6A',
        boxShadow: '0px 0px 8px rgba(48, 157, 106, 0.4)'
    },
});
