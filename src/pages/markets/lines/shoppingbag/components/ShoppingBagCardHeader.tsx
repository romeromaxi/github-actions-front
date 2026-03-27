import React from 'react';
import { Box, Stack } from '@mui/material';
// @ts-ignore
import companyFileComplete from '../../../../../assets/img/market/completa-tu-legajo.png';
import { SubTitle } from '../../../../../components/text/SubTitle';
import { BackButton } from '../../../../../components/buttons/Buttons';
import { useNavigate } from 'react-router-dom';

function ShoppingBagCardHeader() {
  const navigate = useNavigate();

  const onBack = () => navigate('/market/lines');

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      mb={2}
      spacing={1}
    >
      <Box>
        <SubTitle text={'¿Qué debo hacer?'} style={{ fontSize: '1.25rem' }} />
      </Box>
      <Box
        component="img"
        src={companyFileComplete}
        sx={{
          position: 'relative',
          width: '65%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: 2,
        }}
      />
      <BackButton onClick={onBack} size={'small'}>
        Volver
      </BackButton>
    </Stack>
  );
}

export default ShoppingBagCardHeader;
