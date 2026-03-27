import { makeStyles } from '@mui/styles';
import { grey } from '@mui/material/colors';

export default makeStyles({
  accordionRoot: {
    border: 'none !important',
    borderTop: 'none !important',
    "&::before": {
      display: "none",
    },
  },
  accordionSummary: {
    borderRadius: '18px !important',
    margin: '-5px -5px 0 -16px !important',
    backgroundColor: 'transparent !important',
    '&.Mui-expanded': {
      minHeight: `0 !important`,
    },
    '&.Mui-expanded > .MuiAccordionSummary-content': {
      margin: `12px 0px !important`
    },
  },
  accordionDetail: {
    padding: '0px !important',
  },
});
