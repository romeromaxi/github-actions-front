import { makeStyles } from '@mui/styles';

export default makeStyles({
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 248, 250, 0.75)',
    borderBottom: '1px solid #eff2f5',
    padding: 12,
  },
  itemsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eff2f5',
  },
  scores: {
    textDecoration: 'none',
  },
});
