import { Stack } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { CaretRight } from 'phosphor-react';
import React from 'react';

const moveAndFade = keyframes`
  0% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(20px); }
`;

const AnimatedIcon = styled(CaretRight)(({ theme }) => ({
  animation: `${moveAndFade} 2s infinite`,
  color: 'green',
}));

export const AnimatedCaret = () => {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <AnimatedIcon size={24} weight="bold" />
      <AnimatedIcon size={24} weight="bold" style={{ animationDelay: '0.5s' }} />
      <AnimatedIcon size={24} weight="bold" style={{ animationDelay: '1s' }} />
    </Stack>
  );
};