import { createStyles, makeStyles } from '@mui/styles';
import { cardHeaderClasses } from '@mui/material';
import { getBaseColor } from '../../util/typification/generalColors';
import { EnumColors } from '../../types/general/generalEnums';
import { grey } from '@mui/material/colors';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      '&:hover': {
        boxShadow: '0 0.1rem 1rem 0.25rem rgb(0 0 0 / 12%) !important',
        transform: 'translateY(-2.5%)',
        transition: 'transform 0.3s ease',
      },
      '& > button div p:first-child': {
        color: theme.palette.primary.main,
      },
    },
    rootIconColor: {
      '& > button div div svg': {
        color: `${theme.palette.primary.main} !important`,
      },
    },
    disabled: {
      height: '100%',
      boxShadow: '0 0.1rem 1rem 0.25rem rgb(0 0 0 / 5%) !important',
      backgroundColor: '#e3e3e3 !important',
    },
    roundedButton: {
      borderRadius: 16,
      backgroundColor: 'white !important',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0 0.1rem 1rem 0.25rem rgb(0 0 0 / 12%) !important',
        transform: 'translateY(-2.5%)',
        transition: 'transform 0.3s ease',
      },
    },
  }),
);
