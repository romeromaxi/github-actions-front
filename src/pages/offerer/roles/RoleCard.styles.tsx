import { makeStyles } from '@mui/styles';
import { TypographyProps } from '@mui/material';

export default makeStyles({
  cardRole: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0px',
    background: '#FFFFFF',
    boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
  },
  backgroudRoleLoading: {
    background: '#F8F8F8',
  },
});

export const TextDescriptionContentDataProps: TypographyProps = {
  color: '#3AB186 !important',
};
