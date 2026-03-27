import React, { ReactElement, useEffect } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import CardActionButtonStyles from './CardActionButton.styles';
import CardActionButtonTitle from './CardActionButtonTitle';

interface CardActionButtonProps {
  title: string;
  subtitle?: string;
  subtitleContent?: ReactElement;
  content?: ReactElement;
  icon?: ReactElement;
  alertIcon?: ReactElement;
  onClick: () => void;
  company?: boolean;
  disabled?: boolean;
  fontProps?: SxProps;
  headerProps?: SxProps;
  headerText?: string;
  topContent?: boolean;
  cutTitleIf?: number;
}

function CardActionButton(props: CardActionButtonProps) {
  const classes = CardActionButtonStyles();

  return (
    <Card
      className={
        props.disabled
          ? classes.disabled
          : `${classes.root} ${!props.company ? classes.rootIconColor : ''}`
      }
      sx={{ maxHeight: '20rem' }}
    >
      {props.company && props.headerProps && (
        <Box sx={props.headerProps}>
          <Typography
            fontSize={14}
            textAlign={'center'}
            color={'white !important'}
          >
            {props.headerText || ''}
          </Typography>
        </Box>
      )}
      <CardActionArea
        onClick={props.onClick}
        sx={{ height: '100%' }}
        disabled={props.disabled}
      >
        <Stack spacing={0} height={props.topContent ? '95%' : 'auto'}>
          {props.company ? (
            <>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                {props?.icon}
                {props?.alertIcon}
              </Stack>
              <Stack spacing={1} height={1} pb={3}>
                {props.title && (
                  <CardActionButtonTitle
                    title={props.title}
                    disabled={props.disabled}
                    fontProps={props.fontProps}
                    cutTitleIf={props.cutTitleIf}
                  />
                )}
                {props?.subtitleContent}
                {props.content && (
                  <Grid
                    container
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Grid item xs={12}>
                      <CardContent>{props.content}</CardContent>
                    </Grid>
                  </Grid>
                )}
              </Stack>
            </>
          ) : (
            <>
              <Grid container alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={props?.icon ? 2 : 0} textAlign={'end'}>
                  {props?.icon}
                </Grid>
                <Grid item xs={props?.icon ? 10 : 12}>
                  <Typography
                    fontSize={'1.5rem'}
                    fontWeight={props.disabled ? 400 : 600}
                    textAlign={'center'}
                    m={1.8}
                    mb={0.5}
                    color={'grey.900'}
                    sx={props.fontProps}
                  >
                    {props.title}
                  </Typography>
                  <Typography
                    fontSize={'1.1rem'}
                    fontWeight={500}
                    color={'text.disabled'}
                    textAlign={'center'}
                    m={1.8}
                    mt={1}
                  >
                    {props?.subtitle}
                  </Typography>
                </Grid>
              </Grid>
              <>
                {props.content && (
                  <Grid
                    container
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Grid item xs={12}>
                      <CardContent>{props.content}</CardContent>
                    </Grid>
                  </Grid>
                )}
              </>
            </>
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
}

export default CardActionButton;
