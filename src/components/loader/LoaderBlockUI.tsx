import { makeStyles } from '@mui/styles';
import { createStyles, Theme } from '@mui/material/styles';

import {
  Backdrop,
  Card,
  CircularProgress,
  DialogContent,
  DialogContentText,
  Grid,
} from '@mui/material';
import {
    AppConfigFields,
    AppConfigPaletteColor,
    AppConfigPaletteColorFields,
    AppConfigPaletteFields
} from "types/appConfigEntities";

const primaryColor : AppConfigPaletteColor =
    window.APP_CONFIG[AppConfigFields.Palette][AppConfigPaletteFields.Primary][AppConfigPaletteColorFields.Main];

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: 100000,
      color: '#3498db',
      backgroundColor: 'rgba(0,0,0, 0.6)',
      marginTop: '0px !important'
    },
    titleGreetingWelcome: {
      alignSelf: 'center',
      fontWeight: '600 !important',
      fontSize: '24px !important',
    },
    containerCircularProgress: {
      justifyContent: 'center',
    },
    circularProgress: {
      color: primaryColor,
    },
  }),
);

const messageDefault: string = 'Aguardá unos instantes por favor';

interface LoaderBlockUIProps {
  message?: string;
}

export function LoaderBlockUI(props: LoaderBlockUIProps) {
  const classes = useStyles();
  const finalMessage: string = props.message ?? messageDefault;

  return (
    <Backdrop open={true} className={classes.backdrop}>
      <Card>
        <DialogContent>
          <Grid
            className={classes.containerCircularProgress}
            container
            item
            xs={12}
            marginTop={5}
            marginBottom={8}
          >
            <CircularProgress
              color="inherit"
              size={80}
              value={80}
              className={classes.circularProgress}
            />
          </Grid>

          <DialogContentText marginBottom={3}>{finalMessage}</DialogContentText>
        </DialogContent>
      </Card>
    </Backdrop>
  );
}
