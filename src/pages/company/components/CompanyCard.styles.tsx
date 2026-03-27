import { makeStyles } from '@mui/styles';
import { TypographyProps } from '@mui/material';

export default makeStyles({
  cardCompany: {
    // VER display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    gap: '16px',
    borderRadius: '16px',
    background: '#E0E0E0',
  },
  companyAvatar: {
    width: '110px',
    height: '110px',
  },
});

export const CompanyCuitTypographyProps: TypographyProps = {
  fontStyle: 'normal !important',
  fontWeight: '400 !important',
  fontSize: '23px !important',
  lineHeight: '29px !important',
  color: '#FFFFFF !important',
};

export const CompanyNameTypographyProps: TypographyProps = {
  fontStyle: 'normal !important',
  fontWeight: '500 !important',
  fontSize: '28px !important',
  lineHeight: '34px !important',
  color: '#FFFFFF !important',
};
