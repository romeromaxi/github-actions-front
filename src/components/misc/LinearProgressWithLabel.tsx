import * as React from 'react';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack } from '@mui/material';
import { numberFormatter } from '../../util/formatters/numberFormatter';
import { TypographyBase } from './TypographyBase';

export function LinearProgressWithTitle(
  props: LinearProgressProps & { title: string; value: number },
) {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography color={'grey.400'} fontWeight={500} fontSize={'1.075rem'}>
            {props.title}
          </Typography>
          <Typography fontWeight={600} fontSize={'1.075rem'}>
            {numberFormatter.toStringWithPercentage(props.value, 0, 0)}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <LinearProgress
          sx={{ borderRadius: 100 }}
          variant="determinate"
          value={props.value}
        />
      </Grid>
    </Grid>
  );
}

export function LinearProgressNew(props: LinearProgressProps  & { value: number }) {
    return (
        <Stack>
            <LinearProgress
                sx={{ borderRadius: 100, padding: 0.75, '& .MuiLinearProgress-bar': { backgroundColor: '#E98400' }, ...props.sx }}
                variant="determinate"
                value={props.value}
            />
            <Stack direction={'row-reverse'} justifyContent={'space-between'} mt={1}>
                <TypographyBase variant={'caption'} fontSize={12} color={'text.lighter'} sx={{whiteSpace: 'nowrap'}}>
                    {`${numberFormatter.toStringWithPercentage(props.value, 0, 0)} completado`}
                </TypographyBase>
            </Stack>
        </Stack>
    )
}
export function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="subtitle1" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
