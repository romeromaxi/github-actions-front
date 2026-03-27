import { makeStyles } from '@mui/styles';

export default makeStyles({
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 4,
    marginTop: 30,
    paddingLeft: 27.5,
    paddingRight: 27.5,
  },
  root: {
    background: `linear-gradient(0deg, rgba(4, 212, 187, 0.9), rgba(4, 212, 187, 0.9)), url(${'/images/companyFiles/buildings.png'})`,
    backgroundSize: '100% 100% !important',
    padding: '8px 24px',
  },
  pruebas: {
    height: '250px',
    '&:before': {
      filter: 'blur(2px)',
      background: `linear-gradient(0deg, rgba(4, 212, 187, 0.9), rgba(4, 212, 187, 0.9)), url(${'/images/companyFiles/buildings.png'})`,
      backgroundSize: '100% 100% !important',
    },
  },
  rootDateForm: {
    background: `linear-gradient(0deg, rgba(4, 212, 187, 0.9), rgba(4, 212, 187, 0.9)), url(${'/images/companyFiles/buildings.png'})`,
    backgroundSize: '100% 100% !important',
    padding: '8px 24px',
    height: '250px',
  },
  contentBlur: {
    marginLeft: '-22px',
    marginTop: '-46px',
    height: '100%',
    backdropFilter: 'blur(2px)',
  },
  dateDescription: {
    color: 'white',
    fontSize: '16px',
    textAlign: 'left',
    fontStyle: 'italic',
  },
});
/*        filter: 'blur(2px)',
    background: `linear-gradient(0deg, rgba(4, 212, 187, 0.9), rgba(4, 212, 187, 0.9)), url(${"/images/companyFiles/buildings.png"})`,
    backgroundSize: '100% 100% !important',*/
