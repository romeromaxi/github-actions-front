import { ProfileActionType as ActionType } from 'stores/action-types/profileActionType';

interface ProfileSetAction {
  type: ActionType.SET_PROFILE;
  payload: number | undefined;
}

interface CompanySetAction {
  type: ActionType.SET_COMPANY;
  payload: number | undefined;
}

interface ProfileReloadAction {
  type: ActionType.RELOAD_PROFILE;
  payload: boolean | undefined;
}

export type ProfileAction =
  | ProfileSetAction
  | CompanySetAction
  | ProfileReloadAction;
