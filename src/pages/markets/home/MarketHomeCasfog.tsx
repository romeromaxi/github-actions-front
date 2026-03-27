import {Box, Stack} from '@mui/material';
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { userStorage } from 'util/localStorage/userStorage';
import useSearchParamsEncrypted from 'hooks/useSearchParamsEncrypted';
import {LogInProcessParts, Module} from "types/form/login/login-enum";
import LogInDrawer from "../../user/LogInDrawer";
import {useAction} from "hooks/useAction";
import {HttpAuth} from "http/index";

interface MarketHomeCasfogProps {
    srcImage: string
}

const MarketHomeCasfog = ({ srcImage }: MarketHomeCasfogProps) => {
  const [searchParams] = useSearchParamsEncrypted();
  const { setProfile, snackbarWarning } = useAction();
  const navigate = useNavigate();
  const redirect = searchParams.get('redirect') || '';
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [part, setPart] = useState<LogInProcessParts>()

    useEffect(() => {
        if (userStorage.isLogged() && redirect) {
            navigate(redirect, { replace: true });
        }
    }, [redirect]);
  
  const onCloseDrawer = () => {
      setOpenDrawer(false)
      setPart(undefined)
  }

    const onLogIn = () => {
        const user = userStorage.get();
        const userTypeLogin = user?.userType;

        if (!user || userTypeLogin !== Module.Company) {
            userStorage.removeFromStorage();
            setProfile(undefined);
            snackbarWarning(
                'El usuario ingresado no corresponde a la sección solicitada',
            );
        } else if (redirect && redirect !== '') {
            navigate(redirect);
        } else {
            window.location.reload();
        }
    };

  return (
      <Stack>
        <Box
          sx={{
            height: '82vh !important',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundImage: `url(${srcImage})`,
            zIndex: 2,
            position: 'relative',
            cursor: 'pointer',
            '&:hover': {
              cursor: 'pointer',
            }
          }}
          onClick={() => {
            setOpenDrawer(true)
            setPart(LogInProcessParts.Login)
          }}
        />
        
        {openDrawer && !!part && (
          <LogInDrawer
              formPart={part}
              title={'Ingresar'}
              open={openDrawer}
              onClose={onCloseDrawer}
              onLogin={onLogIn}
              allowsRegistration
              fnAuthenticateUser={HttpAuth.authenticateUser}
          />
        )}
      </Stack>

  );
};

export default MarketHomeCasfog;
