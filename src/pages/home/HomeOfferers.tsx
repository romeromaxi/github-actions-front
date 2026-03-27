import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import { userStorage } from 'util/localStorage/userStorage';
import { Module } from 'types/form/login/login-enum';
import { useNavigate } from 'react-router-dom';
import LoginPage from "../user/Login/LoginPage";

function HomeOfferers() {
  const navigate = useNavigate();

  useEffect(() => {
    if (userStorage.getUserType() == Module.Offerer) {
      navigate('/offerer/home');
    } else {
      if (userStorage.isLogged()) {
        navigate('/')
      }
    }
  }, []);

  return (
    <Stack
      direction={'column'}
      justifyContent={'space-between'}
    >
      <LoginPage />
    </Stack>
  );
}

export default HomeOfferers;
