import React, { ReactElement } from 'react';
import CardActionButtonStyles from './CardActionButton.styles';
import {
  Card,
  CardActionArea,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

interface CompactCardActionButtonProps {
  title: string;
  subtitle?: string;
  icon?: ReactElement;
  onClick: () => void;
  subtitleTooltip?: string;
  iconHeader?: ReactElement;
}

function CompactCardActionButton({ ...props }: CompactCardActionButtonProps) {
  const classes = CardActionButtonStyles();

  return (
    <Card className={classes.root}>
      <Tooltip
        title={
          props?.subtitleTooltip && props?.subtitle ? props.subtitleTooltip : ''
        }
      >
        <CardActionArea onClick={props.onClick} sx={{ p: 1 }}>
          <Grid container alignItems={'center'} justifyContent={'center'}>
            <Grid item xs={12}>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={2}
              >
                {props?.icon}
                <Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      fontSize={'1.125rem'}
                      fontWeight={600}
                      textAlign={'center'}
                      color={'grey.900'}
                    >
                      {props.title}
                    </Typography>
                    {props.iconHeader && props.iconHeader}
                  </Stack>
                  <Typography
                    fontSize={'0.8125rem'}
                    fontWeight={500}
                    color={'text.disabled'}
                    textAlign={'center'}
                    noWrap
                  >
                    {props?.subtitle}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardActionArea>
      </Tooltip>
    </Card>
  );
}

export default CompactCardActionButton;
