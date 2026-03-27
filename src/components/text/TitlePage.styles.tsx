import { makeStyles } from '@mui/styles';
import { TitlePageProps } from './TitlePage';

export default makeStyles({
  root: {
    fontStyle: 'normal',
    fontWeight: '600 !important',
    fontSize: '1.5rem !important',
    lineHeight: '34px !important',
    color: (props: TitlePageProps) => (props?.color ? props.color : '#676767'),
  },
});
