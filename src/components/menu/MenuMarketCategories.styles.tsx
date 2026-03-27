import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    textCategory: {
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: `${theme.palette.grey[100]} !important`,
        borderRadius: '1rem !important',
        '& > a': {
          paddingLeft: '0.825rem !important',
          paddingRight: '0.825rem !important',
        },
      },
    },
      textCategoryDisabled: {
          '&:hover': {
              cursor: 'not-allowed'
          },
      },
    linkCategory: {
      textDecoration: 'none !important',
      color: 'inherit !important',
    },
  }),
);
