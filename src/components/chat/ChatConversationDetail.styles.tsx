import { makeStyles } from '@mui/styles';

export default makeStyles({
  main: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    padding: '0 24px 24px 24px',
    backgroundColor: '#FFFFFF',

    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#d0d0d0',
      borderRadius: '4px',
    },
  },

  messagesContainer: {
    position: 'relative',
    zIndex: 1,
    paddingTop: '24px',
  },

  inputBlock: {
    position: 'relative',
    zIndex: 4,
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '16px 16px 0px 24px',
    minHeight: 64,
  },
});