import { Typography, TypographyProps } from '@mui/material';
import TitlePageStyles from './TitlePage.styles';

export interface TitlePageProps {
  text: string;
  color?: string;
}

export function TitlePage(props: TitlePageProps) {
  const classes = TitlePageStyles(props);

  return <Typography className={classes.root}>{props.text}</Typography>;
}
