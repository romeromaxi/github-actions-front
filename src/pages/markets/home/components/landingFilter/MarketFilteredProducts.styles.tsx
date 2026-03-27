import { makeStyles } from '@mui/styles';
import { getBaseColor } from '../../../../../util/typification/generalColors';
import { EnumColors } from '../../../../../types/general/generalEnums';

export default makeStyles({
  rootProductCard: {
    // padding: '0 4px',
    ':--moz-transition': 'all 0.5s ease-in-out',
    ':--o-transition': 'all 0.5s ease-in-out',
    ':--webkit-transition': 'all 0.5s ease-in-out',
    ':--ms-transition': 'all 0.5s ease-in-out',
    transition: 'all 0.5s ease-in-out',
    height: '200px',
    minHeight: '175px',
    '&:hover': {
      cursor: 'pointer',
      // color : '#fff',
      ':--moz-transform': 'translateY(-10px)',
      ':--o-transform': 'translateY(-10px)',
      ':--webkit-transform': 'translateY(-10px)',
      ':--ms-transform': 'translateY(-10px)',
      transform: 'translateY(-10px)',
    },
  },
  productTitle: {
    // padding: '20px 0px !important',
    textAlign: 'center',
    fontSize: '1.125rem !important',
    fontWeight: '600 !important',
    lineHeight: 1.2,
    color: '#3F4254 !important',
    // color: '#111'
  },
  selectedProductCard: {
    border: `1px solid ${getBaseColor(EnumColors.MARKET_BLUE)}`,
    // backgroundColo?r: 'red',
  },
});
