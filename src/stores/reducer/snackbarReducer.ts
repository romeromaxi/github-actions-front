import { SnackbarActionType as ActionType } from 'stores/action-types/snackbarActionType';
import { SnackbarAction as Action } from 'stores/actions/snackbarActions';

export enum EnumSnackbarType {
  ERROR,
  INFO,
  SUCCESS,
  WARNING,
  DEFAULT
}

export enum SnackbarTypeFields {
  Type = 'type',
  Title = 'title',
  Message = 'message',
}

export type SnackbarType = {
  [SnackbarTypeFields.Type]: EnumSnackbarType;
  [SnackbarTypeFields.Title]?: string;
  [SnackbarTypeFields.Message]: string;
};

export type SnackbarState = {
  stackSnackbar: SnackbarType[];
  snackbarRecentlyAdded: boolean;
};

const initialSnackbarState: SnackbarState = {
  stackSnackbar: [],
  snackbarRecentlyAdded: false,
};

export const snackbarReducer = (
  state: SnackbarState = initialSnackbarState,
  action: Action,
): SnackbarState => {
  switch (action.type) {
    case ActionType.ADD_SNACKBAR:
      return {
        ...state,
        stackSnackbar: [...state.stackSnackbar, action.payload],
        snackbarRecentlyAdded: true,
      };

    case ActionType.REMOVE_SNACKBAR:
      let current: SnackbarType[] = [...state.stackSnackbar];

      if (current.length <= 0) return state;

      let removeIndex: number = action.payload as number;

      if (removeIndex > current.length - 1) return state;

      return {
        ...state,
        stackSnackbar: current.filter((_, idx) => idx !== removeIndex),
        snackbarRecentlyAdded: false,
      };

    case ActionType.CLEAR_SNACKBAR:
      return {
        ...state,
        stackSnackbar: [],
        snackbarRecentlyAdded: false,
      };

    default:
      return { ...state };
  }
};
