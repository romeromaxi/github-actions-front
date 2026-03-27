import CardActionButtonStyles from './CardActionButton.styles';
import { Grid, Stack, SxProps, Typography, Box } from '@mui/material';
import React, { ReactElement } from 'react';

interface CardActionButtonRoundedProps {
  title: string;
  subtitle?: string;
  subtitleContent?: ReactElement;
  content?: ReactElement;
  icon?: ReactElement;
  alertIcon?: ReactElement;
  onClick: () => void;
  company?: boolean;
  disabled?: boolean;
  sx?: SxProps;
}

const CardActionButtonRounded = (props: CardActionButtonRoundedProps) => {
  const classes = CardActionButtonStyles();

  return (
    <Box
      className={classes.roundedButton}
      onClick={props.onClick}
      sx={props?.sx}
    >
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
          <Stack spacing={1}>
            {props.title && (
              <Typography
                fontSize={'1.5rem'}
                fontWeight={props.disabled ? 400 : 600}
                textAlign={'center'}
                color={'primary.main'}
                pt={1}
              >
                {props.title}
              </Typography>
            )}
            {props?.subtitleContent}
            {props.content && (
              <Grid
                container
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Grid item xs={12}>
                  {props.content}
                </Grid>
              </Grid>
            )}
          </Stack>
        </>
      ) : (
        <Stack spacing={4} mt={2}
               color={'primary.main'}
        >
          <Stack
            alignItems={'center'}
            spacing={1}
            direction="row"
            justifyContent={'center'}
            sx={{ paddingTop: 2, paddingBottom: 4 }}
          >
            <Typography
              fontSize={'1.6rem'}
              fontWeight={props.disabled ? 400 : 600}
              textAlign={'center'}
              m={3}
            >
              {props.title}
            </Typography>
            <Typography
              fontSize={'1.3rem'}
              fontWeight={500}
              color={'text.disabled'}
              textAlign={'center'}
              m={3}
            >
              {props?.subtitle}
            </Typography>
            {props?.icon}
          </Stack>
          <>
            {props.content && (
              <Grid
                container
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Grid item xs={12}>
                  {props.content}
                </Grid>
              </Grid>
            )}
          </>
        </Stack>
      )}
    </Box>
  );
};

export default CardActionButtonRounded;
