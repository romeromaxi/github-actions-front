import { makeStyles } from '@mui/styles';

export default makeStyles({
  root: {
    color: '#ABAAAA',
    float: 'right',
  },
  rootLeft: {
    color: '#ABAAAA',
    // float: 'left'
  },
  tagHome: {
    color: '#ABAAAA',
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '20px',
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  tag: {
    color: '#676767',
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '20px',
    textDecoration: 'none',
    textTransform: 'capitalize',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  lastTag: {
    color: '#4784E1',
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '20px',
    textDecoration: 'none',
    textTransform: 'capitalize',
    '&:hover': {
      cursor: 'default',
    },
  },
});
