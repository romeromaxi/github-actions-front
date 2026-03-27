import { makeStyles } from '@mui/styles';
import { SxProps } from '@mui/material';

export default makeStyles({
  companyAvatar: {
    width: '110px',
    height: '110px',
  },
});

export const headerProps: SxProps = {
  marginBottom: '-8px',
  textTransform: 'uppercase',
  clipPath:
    'polygon(0% 15%, 0 0, 15% 0%, 85% 0%, 100% 0, 100% 15%, 100% 85%, 100% 100%, 99% 84%, 1% 84%, 0 100%, 0% 85%)',
};
