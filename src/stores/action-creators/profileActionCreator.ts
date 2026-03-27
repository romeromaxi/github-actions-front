import { Dispatch } from 'redux';
import { ProfileAction as Action } from 'stores/actions/profileActions';
import { ProfileActionType as ActionType } from 'stores/action-types/profileActionType';

export const setProfile = (profileId: number | undefined) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_PROFILE,
      payload: profileId,
    });
  };
};

export const reloadProfile = (reload: boolean = true) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.RELOAD_PROFILE,
      payload: reload,
    });
  };
};

export const setCompany = (companyId: number | undefined) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_COMPANY,
      payload: companyId,
    });
  };
};
