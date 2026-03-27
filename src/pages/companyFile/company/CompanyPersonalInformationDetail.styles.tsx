import { makeStyles } from '@mui/styles';

export default makeStyles({
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 4,
    paddingLeft: 27.5,
    paddingRight: 27.5,
    paddingTop: 2,
    paddingBottom: 2,
  },
  title: {
    marginTop: '4px',
    color: 'rgb(1 84 74 / 90%)',
  },
  backgroundBuilding: {
    background: `linear-gradient(0deg, rgb(1 84 74 / 90%), rgba(4, 212, 187, 0.9)), url(/images/companyFiles/buildings.png)`,
  },
  contentAvatar: {
    zIndex: 12,
  },
  avatar: {
    width: '50px',
    height: '50px',
    marginTop: '10px',
    textAlign: 'center',
    objectFit: 'cover',
    color: 'transparent',
    textIndent: '10000px',
  },
  drop: {
    backdropFilter: 'blur(2px)',
    top: '0px',
    zIndex: 8,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  businessName: {
    fontWeight: 600,
  },
  cuit: {
    fontWeight: 400,
    fontSize: ' 18px',
    color: 'rgba(58, 53, 65, 0.87)',
  },
  contentLogo: {
    backgroundColor: 'black',
  },
  contentLogoAllowEdit: {
    paddingTop: '5px',
  },
  contentAllowEdit: {
    paddingLeft: '25px',
  },
  contentIconButton: {
    position: 'absolute',
    right: '0.75rem',
    top: '0.75rem',
    zIndex: 5,
  },
});

/*
*     contentHeader: {
        height: '45px',
        position: 'relative',
        background: `linear-gradient(0deg, rgb(1 84 74 / 90%), rgba(4, 212, 187, 0.9)), url(/images/companyFiles/buildings.png)`,
    },
    header: {
        width: '144px',
        height: '62px',
        display: 'inline-block',
        backgroundColor: 'currentcolor',
        WebkitMask: 'url(/images/companyFiles/shape-avatar.svg) center center / contain no-repeat',
        zIndex: 10,
        left: '0px',
        right: '0px',
        bottom: '-26px',
        position: 'absolute',
        color: 'rgb(255, 255, 255)'
    },
*/
