import { SnackbarType } from 'stores/reducer/snackbarReducer';
import { SnackbarActionType as ActionType } from 'stores/action-types/snackbarActionType';

interface SnackbarAddAction {
  type: ActionType.ADD_SNACKBAR;
  payload: SnackbarType;
}

interface SnackbarRemoveAction {
  type: ActionType.REMOVE_SNACKBAR;
  payload: number;
}

interface SnackbarClearAction {
  type: ActionType.CLEAR_SNACKBAR;
  payload: undefined;
}

export type SnackbarAction =
  | SnackbarAddAction
  | SnackbarRemoveAction
  | SnackbarClearAction;
