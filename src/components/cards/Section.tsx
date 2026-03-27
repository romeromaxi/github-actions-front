import React from 'react';
import { Box, Grid, SxProps, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';

interface SectionProps {
  title: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

function Section(props: SectionProps) {
  return (
    <Box sx={props.sx}>
      <Typography
        variant={'h3'}
        color={'grey.700'}
        fontSize={'1.7rem'}
        fontWeight={600}
        borderBottom={'1px dashed #E4E6EF'}
      >
        {props.title}
      </Typography>
      <Grid container pl={2} pt={1}>
        <Grid item xs={12}>
          {props.children}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Section;
