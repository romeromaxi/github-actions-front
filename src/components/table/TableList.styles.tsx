import { makeStyles } from '@mui/styles';
import {themeColorDefinition} from "../../util/themes/definitions";

const weightNormal = 400;
const weightBold = 700;

export default makeStyles({
  root: {
    flexGrow: 1,
    marginTop: 0,
    color: 'black',
  },
  head: {
    backgroundColor: 'var(--kt-light-rgb)',
    borderBottom: '1px solid #eff2f5 !important',
    fontWeight: 500,
  },
  table: {
    '& > thead > tr': {
      '& > th': {
        background: 'none',
        /*textAlign: 'right',*/
        textAlign: 'center',
        paddingBottom: 0,
        '& > p': {
          color: 'black',
          fontSize: '13px',
          fontWeight: weightNormal,
          textTransform: 'uppercase !important',
        },
      },
      '&  > th:first-child p': {
        fontSize: '16px',
        textAlign: 'left',
        fontWeight: weightBold,
        textTransform: 'capitalize !important',
      },
    },
    '& > tbody': {
      '& > tr': {
        background: 'none',

        '& > td': {
          color: 'black',
          fontSize: '14px',
          paddingTop: '15px',
          paddingBottom: '6px',
          /*textAlign: 'right',*/
          textAlign: 'left',
          fontWeight: weightBold,
          borderBottom: '1px solid rgba(0, 0, 0, 0.16)',
        },
        '& :first-child ': {
          fontSize: '14px',
          textAlign: 'left',
          paddingLeft: '22px',
          fontWeight: weightNormal,
          textTransform: 'uppercase',
        },
      },
      '& :last-child > td': {
        borderBottom: `1px solid white`,
      },
    },
    padding: 4,
  },
  clickableRow: {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary || '#f5f5f5',
      '& td': {
        backgroundColor: 'inherit',
      }
    },
    '&:active': {
      backgroundColor: themeColorDefinition.UIElements.backgrounds.primary || '#e0e0e0',
      '& td': {
        backgroundColor: 'inherit',
      }
    }
  }
});
