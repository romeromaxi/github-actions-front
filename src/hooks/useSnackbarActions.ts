import { EnumSnackbarType } from 'stores/reducer/snackbarReducer';
import {useSnackbar} from "notistack";
import {AlertColor} from "@mui/material/Alert";

const severityTypeMap: Record<EnumSnackbarType, AlertColor | 'default'> = {
  [EnumSnackbarType.ERROR]: 'error',
  [EnumSnackbarType.SUCCESS]: 'success',
  [EnumSnackbarType.WARNING]: 'warning',
  [EnumSnackbarType.INFO]: 'info',
  [EnumSnackbarType.DEFAULT]: 'default'
};

const titleTypeMap: Record<EnumSnackbarType, string> = {
  [EnumSnackbarType.ERROR]: 'Error',
  [EnumSnackbarType.SUCCESS]: 'Operación Exitosa',
  [EnumSnackbarType.WARNING]: 'Advertencia',
  [EnumSnackbarType.INFO]: 'Información',
  [EnumSnackbarType.DEFAULT]: 'Información'
};

export const useSnackbarActions = () => {
  const { enqueueSnackbar } = useSnackbar(); 

  const addSnackbar = (
      type: EnumSnackbarType,
      message: string,
      title: string = ''
  ) => {
    enqueueSnackbar(message, {
      variant: severityTypeMap[type],
      title: title || titleTypeMap[type],
      persist: false
    });
    
    return true;
  };

  return {
    addSnackbar: (type: EnumSnackbarType, message: string, title: string = '') =>
      addSnackbar(type, message, title),
    
    addSnackbarSuccess: (message: string, title: string = '') =>
      addSnackbar(EnumSnackbarType.SUCCESS, message, title),

    addSnackbarError: (message: string, title: string = '') =>
      addSnackbar(EnumSnackbarType.ERROR, message, title),

    addSnackbarInfo: (message: string, title: string = '') =>
      addSnackbar(EnumSnackbarType.INFO, message, title),

    addSnackbarWarning: (message: string, title: string = '') =>
      addSnackbar(EnumSnackbarType.WARNING, message, title),

    addSnackbarDefault: (message: string, title: string = '') =>
      addSnackbar(EnumSnackbarType.DEFAULT, message, title),
  }
};