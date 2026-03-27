import { makeStyles } from '@mui/styles';
import { cardHeaderClasses } from '@mui/material';
import { getBaseColor } from '../../util/typification/generalColors';
import { EnumColors } from '../../types/general/generalEnums';
import { grey } from '@mui/material/colors';

export default makeStyles({
  cardHeaderBlue: {
    background: '#4784E1',
    borderRadius: '8px 8px 0px 0px',
    borderBottom: '6px solid #5946C9',
  },
  cardHeaderGreen: {
    background: '#04D4BB',
    borderRadius: '8px 8px 0px 0px',
    borderBottom: '6px solid #2AA2AA',
  },
  cardHeaderLightBlue: {
    background: '#4DC3E8',
    borderRadius: '8px 8px 0px 0px',
    borderBottom: '6px solid #0F94BE',
  },
  cardHeaderRed: {
    background: '#F26A6A',
    borderRadius: '8px 8px 0px 0px',
    borderBottom: '6px solid #DB4539',
  },
  cardHeaderGrey: {
    background: '#ABAAAA',
    borderRadius: '8px 8px 0px 0px',
    borderBottom: '6px solid #676767',
  },
  cardHeaderLucGradient: {
    borderRadius: '8px 8px 0px 0px',
    background: 'linear-gradient(90deg, #04D5BB 0%, #4784E1 84.11%)',
  },
  cardHeaderGreyGradient: {
    borderRadius: '8px 8px 0px 0px',
    background:
      'linear-gradient(0deg, rgba(253,253,253,1) 0%, rgba(250,250,250,1) 50%, rgba(245,245,245,1) 100%)',
    borderBottom: `1px solid ${grey[400]}`,
    [`& .${cardHeaderClasses.title}`]: {
      color: getBaseColor(EnumColors.LIGHTBLUE),
    },
  },
  cardHeaderMarketBlue: {
    background: '#004dda',
    borderRadius: '8px 8px 0px 0px',
    borderBottom: '6px solid #676767',
  },
  cardHeaderWhite: {
    borderRadius: '8px 8px 0px 0px',
    background: 'white',
  },
});
