import { makeStyles } from '@mui/styles';
import { TypographyProps } from '@mui/material';

export default makeStyles({
  descriptionConfirms: {
    background: '#E7F6FD',
    borderRadius: '8px',
    justifyContent: 'center',
    marginTop: '8px',
    padding: '3px 8px 8px 8px',
    '& > div > div': {
      justifyContent: 'center',
    },
  },
  descriptionAsignationRole: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '23px',
    lineHeight: '29px',
    color: '#494949',
    marginTop: '10px',
  },
  form: {
    width: '100%',
    '& > div > div': {
      width: '100%',
    },
  },
});

export const DescriptionConfirmedMainDataProps: TypographyProps = {
  fontSize: '13px !important',
  fontWeight: '400 !important',
  lineHeight: '15px !important',
};
