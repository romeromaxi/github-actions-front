import { Dispatch } from 'redux';
import { LoaderAction as Action } from 'stores/actions/loaderActions';
import { LoaderActionType as ActionType } from 'stores/action-types/loaderActionType';

export const showLoader = (message?: string) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SHOW_LOADER,
      payload: message,
    });
  };
};

export const hideLoader = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.HIDE_LOADER,
    });
  };
};
