import React, { useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userStorage } from '../../util/localStorage/userStorage';
import { Module } from '../../types/form/login/login-enum';

function HomeInternal() {
  const navigate = useNavigate();

  useEffect(() => {
    if (userStorage.getUserType() == Module.Internal) {
      navigate('/internal/home');
    }
  }, []);

  return (
    <Stack
      direction={'column'}
      sx={{ minHeight: '100vh' }}
      justifyContent={'space-between'}
    >
      {/*<MenuHome onLoginClick={() => setLogInActive(true)}
                      onSignUpClick={() => setSignUpActive(true)}/>*/}
      <div>
        <Typography variant={'h4'} sx={{ marginTop: '10px' }}>
          Usuario Interno
        </Typography>
        <Typography variant={'h4'}>Bienvenido/a a LUC</Typography>
        <Typography variant={'subtitle2'}>
          De que trata la plataforma
        </Typography>
        <Typography variant={'subtitle2'}>Para que sirve</Typography>
        <Typography variant={'subtitle2'}>Como funciona</Typography>

        <Box sx={{ marginTop: '200px' }}>
          <Typography variant={'h4'} align={'center'}>
            Entidades Financieras que participan.
          </Typography>
        </Box>
        <Box sx={{ marginTop: '100px' }}>
          <Typography variant={'h4'} align={'center'}>
            Ofertas de financiamiento para pymes.
          </Typography>
        </Box>
      </div>
    </Stack>
  );
}

export default HomeInternal;
