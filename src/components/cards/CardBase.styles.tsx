import { makeStyles } from '@mui/styles';

export default makeStyles({
  card: {
    boxShadow: 'none',
    borderRadius: '0px',
  },
  cardWithShadow: {
    boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
  },
});
