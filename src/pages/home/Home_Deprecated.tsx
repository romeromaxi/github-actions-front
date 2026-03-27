import React from 'react';
import { Box, Button, ButtonGroup, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home_Deprecated() {
  const navigate = useNavigate();

  function goHomeCompanies() {
    navigate('/companies');
  }

  function goHomeOfferers() {
    navigate('/offerer');
  }

  function goHomeInternal() {
    navigate('/internal');
  }

  return (
    <Stack
      direction={'column'}
      sx={{ minHeight: '100vh' }}
      justifyContent={'space-between'}
    >
      <div>
        <Box sx={{ marginTop: '10px' }}>
          <Typography variant={'h4'} align={'center'}>
            Bienvenido/a a LUC
          </Typography>
        </Box>

        <Box
          sx={{
            marginTop: '100px',
            paddingLeft: '300px',
            paddingRight: '300px',
          }}
          alignContent={'center'}
        >
          <ButtonGroup
            size={'medium'}
            fullWidth={true}
            variant={'contained'}
            aria-label="medium button group"
          >
            <Button onClick={goHomeCompanies}>Pymes</Button>
          </ButtonGroup>
        </Box>
        <Box
          sx={{
            marginTop: '20px',
            paddingLeft: '300px',
            paddingRight: '300px',
          }}
          alignContent={'center'}
        >
          <ButtonGroup
            size={'medium'}
            fullWidth={true}
            variant={'contained'}
            aria-label="medium button group"
          >
            <Button onClick={goHomeOfferers}>Oferentes</Button>
          </ButtonGroup>
        </Box>
        <Box
          sx={{
            marginTop: '20px',
            paddingLeft: '300px',
            paddingRight: '300px',
          }}
          alignContent={'center'}
        >
          <ButtonGroup
            size={'medium'}
            fullWidth={true}
            variant={'contained'}
            aria-label="medium button group"
          >
            <Button onClick={goHomeInternal}>Interno</Button>
          </ButtonGroup>
        </Box>
      </div>
    </Stack>
  );
}

export default Home_Deprecated;
