import { makeStyles } from '@mui/styles';

export default makeStyles({
  accordion: {
    backgroundColor: 'white',
    boxShadow: 'none',
  },
  accordionSummary: {
    background: 'linear-gradient(180deg, #F5F5F5 0%, #FFFFFF 100%)',
    borderBottom: '1px solid #E0E0E0',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '23px',
    lineHeight: '29px',
    color: '#4784E1',
  },
  accordionDetail: {
    paddingLeft: '30px',
  },
});
