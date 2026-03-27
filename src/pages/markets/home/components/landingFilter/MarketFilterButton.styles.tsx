import { makeStyles } from '@mui/styles';

export default makeStyles({
  root: {
    overflow: 'hidden',
  },
  rootDisabled: {
    backgroundColor: 'black !important',
    opacity: 0.5,
  },
  boxHover: {
    '&:hover': {
      color: '#fff',
      ':--moz-transform': 'scale(1.0)',
      ':--o-transform': 'scale(1.0)',
      ':--webkit-transform': 'scale(1.0)',
      ':--ms-transform': 'scale(1.0)',
      transform: 'scale(1.0)',
    },
  },
  boxNotAllowed: {
    '&:hover': {
      cursor: 'not-allowed',
    },
  },
});
