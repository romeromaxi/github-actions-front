import { ProfileActionType as ActionType } from 'stores/action-types/profileActionType';
import { ProfileAction as Action } from 'stores/actions/profileActions';

export type ProfileState = {
  profileId?: number;
  companyId?: number;
  relaod: boolean;
};

const initialProfile: ProfileState = {
  profileId: undefined,
  companyId: undefined,
  relaod: false,
};

export const profileReducer = (
  state: ProfileState = initialProfile,
  action: Action,
): ProfileState => {
  switch (action.type) {
    case ActionType.SET_PROFILE:
      return {
        ...state,
        profileId: action.payload as number,
      };
    case ActionType.SET_COMPANY:
      return {
        ...state,
        companyId: action.payload as number,
      };
    case ActionType.RELOAD_PROFILE:
      return {
        ...state,
        relaod: action.payload as boolean,
      };

    default:
      return { ...state };
  }
};
