import { makeStyles } from '@mui/styles';
import { TypographyProps } from '@mui/material';

export default makeStyles({
  confirmationCUIT: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '23px',
    lineHeight: '29px',
    color: '#494949',
  },
  description: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '17px',
    lineHeight: '20px',
    textAlign: 'center',
    color: '#929292',
  },
  descriptionCUIT: {
    color: '#4784E1',
  },
});

export const MainDataToConfirmedLabelProps: TypographyProps = {
  fontWeight: '400 !important',
  fontSize: '17px !important',
  lineHeight: '20px !important',
  textAlign: 'center',
  color: '#929292 !important',
};

export const MainDataToConfirmedDataProps: TypographyProps = {
  fontWeight: '400 !important',
  fontSize: '17px !important',
  lineHeight: '20px !important',
  textAlign: 'center',
};
