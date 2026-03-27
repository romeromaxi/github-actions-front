import { makeStyles } from '@mui/styles';

export default makeStyles({
  avatar: {
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      zIndex: 9999,
      cursor: 'pointer',
    },
  },
});
