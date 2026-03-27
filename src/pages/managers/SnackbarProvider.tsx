import {
  SnackbarProvider as SnackbarProviderNotistack,
  closeSnackbar,
  CustomContentProps,
  SnackbarContent,
  SnackbarOrigin
} from 'notistack';
import { Outlet } from 'react-router-dom';
import React, {ReactElement} from "react";
import {Alert, AlertTitle, IconButton, useMediaQuery} from "@mui/material";
import { X } from '@phosphor-icons/react';
import { TypographyBase } from 'components/misc/TypographyBase';

interface SnackbarProviderProps {
  children?: ReactElement;
}

interface ReportCompleteProps extends CustomContentProps {
  title: string
}

const ReportComplete = React.forwardRef<HTMLDivElement, ReportCompleteProps>((props, ref) => {
  const { id, variant, message, title, action, ...other } = props

  return (
    <SnackbarContent ref={ref} role="alert" {...other}>

      <Alert
        onClose={() => closeSnackbar(id)}
        //@ts-ignore
        severity={variant}
        //@ts-ignore
        color={variant}
        style={{
          marginBottom: '5px',
          width: '100% !important',
          maxWidth: '100% !important',
          alignItems: 'center',
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: 'white !important'
        }}
        variant={'outlined'}
        key={`snackbarAlert_variant_${id}`}
      >
        <AlertTitle sx={{
          fontSize: '1rem', // 16px
          fontFamily: 'Geist',
          lineHeight: '130%',
        }}>
          {title}
        </AlertTitle>

        <TypographyBase variant={'body3'} 
                        height={'100%'}
                        maxLines={4}
                        color={'text.lighter'}
        >
          {message}
        </TypographyBase>
      </Alert>
    </SnackbarContent>
  )
})

function SnackbarProvider({ children }: SnackbarProviderProps) {
  const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const hideDurationInMilliseconds: number = 5000; 
  const positionSnackbar: SnackbarOrigin = {
    vertical: 'bottom',
    horizontal: window.innerWidth > 600 ? 'right' : 'center',
  };
  
  return (
    <SnackbarProviderNotistack
      maxSnack={5}
      preventDuplicate
      autoHideDuration={hideDurationInMilliseconds}
      anchorOrigin={positionSnackbar}
      disableWindowBlurListener
      dense
      style={{
        minWidth: isSmallScreen ? '90vw': '500px',
        maxWidth: isSmallScreen ? '90vw': '500px',
      }}
      action={(snackbarId) => (
        <IconButton
          size="small"
          onClick={() => closeSnackbar(snackbarId)}
          color="inherit"
        >
          <X />
        </IconButton>
      )}
      Components={{
        error: ReportComplete,
        success: ReportComplete,
        warning: ReportComplete,
      }}
    >
      {children}
      <Outlet />
    </SnackbarProviderNotistack>
  )
}

export default SnackbarProvider;