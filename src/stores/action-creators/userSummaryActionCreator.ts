import { Dispatch } from 'redux';
import { UserSummaryAction as Action } from 'stores/actions/userSummaryActions';
import { UserSummaryActionType as ActionType } from 'stores/action-types/userSummaryActionType';
import { UserInfoSummaryView } from 'types/user';

export const reloadUserSummary = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.RELOAD_USER_SUMMARY,
    });
  };
};

export const setUserSummary = (
  summary: UserInfoSummaryView | undefined = undefined,
) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_USER_SUMMARY,
      payload: summary,
    });
  };
};
