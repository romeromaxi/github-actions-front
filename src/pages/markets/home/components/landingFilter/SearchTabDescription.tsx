import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';

const SearchTabDescription = ({ title, description, buttonText, onClick, dataCy }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack 
      direction={isSmallScreen ? 'column' : 'row'} 
      alignItems='center' 
      justifyContent={'space-between'} 
      spacing={2} 
      sx={{ 
        padding: '10px',
        borderRadius: { xs: '50px', sm: '75px', md: '100px' },
        backgroundColor: '#F7FAFC'
      }}
      data-cy={dataCy}
    >
      <Stack sx={{
        backgroundColor: 'white !important',
        padding: { xs: '34px', sm: '34px', md: '24px', lg: '24px' },
        borderRadius: { xs: '50px', sm: '75px', md: '100px' },
      }}>
        <Typography fontSize={21} fontWeight={500}>{title}</Typography>
        <Typography variant={'body2'} color={'text.lighter'}>
          {description}
        </Typography>
      </Stack>
      <Button variant={'contained'} onClick={onClick} sx={{ width: isSmallScreen ? "100%" : "auto"}}>
        {buttonText}
      </Button>
    </Stack>
  );
};

export default SearchTabDescription;