import { SnackbarAction as Action } from 'stores/actions/snackbarActions';
import { EnumSnackbarType, SnackbarTypeFields } from 'stores/reducer/snackbarReducer';
import { SnackbarActionType as ActionType } from 'stores/action-types/snackbarActionType';

const createSnackbarAction = (
  type: EnumSnackbarType,
  message: string,
  title: string = ''
) => ({
  type: ActionType.ADD_SNACKBAR,
  payload: {
    [SnackbarTypeFields.Type]: type,
    [SnackbarTypeFields.Title]: title,
    [SnackbarTypeFields.Message]: message,
  },
});

const snackbarCache = new Map<string, Action>();

const getSnackbarKey = (type: EnumSnackbarType, message: string, title: string) => 
  `${type}-${message}-${title}`;

export const snackbarSuccess = (message: string, title: string = '') => {
  const key = getSnackbarKey(EnumSnackbarType.SUCCESS, message, title);
  if (!snackbarCache.has(key)) {
    snackbarCache.set(key, createSnackbarAction(EnumSnackbarType.SUCCESS, message, title));
  }
  return snackbarCache.get(key)!;
};

export const snackbarError = (message: string, title: string = '') => {
  const key = getSnackbarKey(EnumSnackbarType.ERROR, message, title);
  if (!snackbarCache.has(key)) {
    snackbarCache.set(key, createSnackbarAction(EnumSnackbarType.ERROR, message, title));
  }
  return snackbarCache.get(key)!;
};

export const snackbarInfo = (message: string, title: string = '') => {
  const key = getSnackbarKey(EnumSnackbarType.INFO, message, title);
  if (!snackbarCache.has(key)) {
    snackbarCache.set(key, createSnackbarAction(EnumSnackbarType.INFO, message, title));
  }
  return snackbarCache.get(key)!;
};

export const snackbarWarning = (message: string, title: string = '') => {
  const key = getSnackbarKey(EnumSnackbarType.WARNING, message, title);
  if (!snackbarCache.has(key)) {
    snackbarCache.set(key, createSnackbarAction(EnumSnackbarType.WARNING, message, title));
  }
  return snackbarCache.get(key)!;
};

export const snackbarDefault = (message: string, title: string = '') => {
  const key = getSnackbarKey(EnumSnackbarType.DEFAULT, message, title);
  if (!snackbarCache.has(key)) {
    snackbarCache.set(key, createSnackbarAction(EnumSnackbarType.DEFAULT, message, title));
  }
  return snackbarCache.get(key)!;
};

export const removeSnackbar = (index: number) => ({
  type: ActionType.REMOVE_SNACKBAR,
  payload: index,
});

export const clearSnackbar = () => ({
  type: ActionType.CLEAR_SNACKBAR,
});