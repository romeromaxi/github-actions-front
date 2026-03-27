import { makeStyles } from '@mui/styles';
import { blueColorBase, whiteColor } from '../../../util/themes/ThemeItapTec';

export default makeStyles({
  accordionExpanded: {
    '&.Mui-expanded > .MuiAccordionSummary-content': {
      backgroundColor: blueColorBase,
      '& > h4': {
        color: `${whiteColor} !important`,
      },
    },
  },
});
