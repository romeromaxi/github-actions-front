import { UserSummaryActionType as ActionType } from 'stores/action-types/userSummaryActionType';
import { UserSummaryAction as Action } from 'stores/actions/userSummaryActions';
import { UserInfoSummaryView } from '../../types/user';

export type UserSummaryState = {
  summary?: UserInfoSummaryView;
  reload?: boolean;
};

const initialUserSummary: UserSummaryState = {
  summary: undefined,
  reload: false,
};

export const userSummaryReducer = (
  state: UserSummaryState = initialUserSummary,
  action: Action,
): UserSummaryState => {
  switch (action.type) {
    case ActionType.RELOAD_USER_SUMMARY:
      return {
        ...state,
        summary: undefined,
        reload: true,
      };

    case ActionType.SET_USER_SUMMARY:
      return {
        ...state,
        summary: action.payload as UserInfoSummaryView,
        reload: false,
      };

    default:
      return { ...state };
  }
};
