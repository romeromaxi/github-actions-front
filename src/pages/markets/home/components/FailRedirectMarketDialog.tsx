import React, {useState, useCallback, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {Dialog, IconButton} from '@mui/material';
import { Module } from '../../../../types/form/login/login-enum';
import { useSnackbarActions } from '../../../../hooks/useSnackbarActions';
import { useProfileActions } from '../../../../hooks/useProfileActions';
import { useUser } from '../../../../hooks/contexts/UserContext';
import {useModuleNavigate} from "../../../../hooks/useModuleNavigate";
import MarketUserLoginContent from "./MarketUserLoginContent";
import {WrapperIcons} from "../../../../components/icons/Icons";
import {X} from "@phosphor-icons/react";

interface FailRedirectMarketDialogProps {
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
  description?: string;
  redirect?: () => void;
  hideTitle?: boolean;
}

const FailRedirectMarketDialog = React.memo(({
  open,
  onClose,
  onCancel,
  description,
  redirect,
    hideTitle
}: FailRedirectMarketDialogProps) => {
  const moduleNavigate = useModuleNavigate();
  
  const { addSnackbarWarning } = useSnackbarActions();
  const { setProfile } = useProfileActions();
  const { user, logout, isUserContextLoading } = useUser();
  const navigate = useNavigate();
  const finalDesc = description ?? '¿Querés conocer toda la oferta de financiamiento?'
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);

  const handleLoginSuccess = useCallback(() => {
    if (user?.lackConfirmation && user.mail) {
      const encodedMail = encodeURIComponent(user.mail);
      navigate(`/signup/confirmation?mail=${encodedMail}`);
    } else if (user?.userType === Module.Offerer) {
      moduleNavigate(Module.Offerer);
    } else {
      redirect ? redirect() : window.location.reload()
    }
    setIsProcessingLogin(false);
  }, [user, navigate, moduleNavigate]);

  const handleCancel = useCallback(() => {
    onClose();
    onCancel?.();
  }, [onClose, onCancel]);

  const handleLoginFailure = useCallback(() => {
    logout();
    setProfile(undefined);
    addSnackbarWarning('El usuario ingresado no corresponde a la sección solicitada');
    setIsProcessingLogin(false);
  }, [setProfile, addSnackbarWarning]);
  
  useEffect(() => {
    if (!isProcessingLogin) return;

    if (!isUserContextLoading) {
      if (user) {
        handleLoginSuccess();
      } else {
        handleLoginFailure();
      }
    }
  }, [isProcessingLogin, isUserContextLoading, user, handleLoginSuccess, handleLoginFailure]);
  
  return (
    <Dialog maxWidth={'sm'}
            fullWidth
            open={open}
            onClose={handleCancel}
            PaperProps={{
              sx: {
                boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.primary.main} !important`,
              }
            }}
    >
      <MarketUserLoginContent description={finalDesc}
                              dialogAction={
                                <IconButton color="default" onClick={handleCancel}>
                                  <WrapperIcons Icon={X} size={'md'} />
                                </IconButton>
                              }
      />
    </Dialog>
  );
});

export default FailRedirectMarketDialog;