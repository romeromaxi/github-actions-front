import { createStyles, makeStyles } from '@mui/styles';
import { TypographyProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    label: {
      /*        fontStyle: 'normal',
                    fontWeight: 300,
                    fontSize: '14px',
                    lineHeight: '22px',
                    color: "rgb(95, 116, 141)"*/
    },
    data: {
      color: theme.palette.grey[800],
    },
    dataPrimary: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '20px',
      lineHeight: '24px',
      color: '#4784E1',
    },
    dataEditable: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '20px',
      lineHeight: '24px',
      color: '#5946C9',
    },
    icon: {
      color: '#3f4254',
      fontWeight: '600 !important',
      fontSize: '1.075rem !important',
      ml: -1 / 3,
    },
    iconChip: {
      fontSize: '1.2rem !important',
    },
  }),
);
