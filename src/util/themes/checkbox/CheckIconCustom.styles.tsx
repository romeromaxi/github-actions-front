import {createStyles, makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {themeColorDefinition} from "../definitions";

export default makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '18px',
            height: '18px',
            borderRadius: '6px',
            placeContent: 'center !important'
        },
        checked: {
          background: '#FFFFFF',
          border: `2px solid ${themeColorDefinition.actions.main.default}`,
          alignItems: 'center',
        },
        checkedInside: {
          backgroundColor: themeColorDefinition.actions.main.default,
          width: '10px',
          height: '10px',
          borderRadius: '2px'
        },
        icon: {
            color: themeColorDefinition.actions.main.default,
            marginTop: '12%'
        }
    }),
);
