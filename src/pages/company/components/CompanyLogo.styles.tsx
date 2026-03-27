import { makeStyles } from '@mui/styles';

const heighLogo: string = '200px';

export default makeStyles({
  contentLogo: {
    zIndex: 2,
    height: heighLogo,
    backgroundSize: '100% 100%',
  },
  contentCircularProgress: {
    zIndex: 2,
    height: heighLogo,
    textAlign: 'center',
    backgroundColor: '#E0DEDE',
    backgroundSize: '100% 100%',
  },
  circularProgress: {
    color: '#b8b8b8',
  },
});
