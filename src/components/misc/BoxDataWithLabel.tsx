import { Box, Stack, Typography } from '@mui/material';
import TotalBoxComponentStyles from './TotalBoxComponent.styles';
import { Skeleton } from '@mui/lab';

interface BoxDataWithLabelProps {
  label: string;
  data: string;
  loading?: boolean;
  reverse?: boolean;
  size?: 'small' | 'medium' | 'large';
}

function BoxDataWithLabel(props: BoxDataWithLabelProps) {
  const classes = TotalBoxComponentStyles();
  const labelFontSize: string = props.size === 'small' ? '1rem' : '1.075rem';
  const titleFontSize: string = props.size === 'small' ? '1.075rem' : '1.25rem';
  const direction = props.reverse ? 'column-reverse' : 'column';

  return (
    <Box
      className={classes.boxContainer}
      component="div"
      minWidth={'160px'}
      maxWidth={'375px'}
    >
      <Stack direction={direction}>
        {props.loading ? (
          <Skeleton />
        ) : (
          <Typography fontWeight={600} fontSize={titleFontSize}>
            {props.data}
          </Typography>
        )}
        <Typography
          fontWeight={500}
          fontSize={labelFontSize}
          color={'grey.400'}
        >
          {props.label}
        </Typography>
      </Stack>
    </Box>
  );
}

export function BoxDataWithLabelLoading() {
  const classes = TotalBoxComponentStyles();

  return (
    <Box
      className={`${classes.boxContainer} ${classes.boxLoading}`}
      component="div"
    >
      <Stack direction="column">
        <Skeleton />
        <Skeleton />
      </Stack>
    </Box>
  );
}

export default BoxDataWithLabel;
