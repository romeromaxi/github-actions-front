import { UserSummaryActionType as ActionType } from 'stores/action-types/userSummaryActionType';
import { UserInfoSummaryView } from 'types/user';

interface UserSummaryReloadAction {
  type: ActionType.RELOAD_USER_SUMMARY;
}

interface UserSummarySetAction {
  type: ActionType.SET_USER_SUMMARY;
  payload: UserInfoSummaryView | undefined;
}

export type UserSummaryAction = UserSummaryReloadAction | UserSummarySetAction;
