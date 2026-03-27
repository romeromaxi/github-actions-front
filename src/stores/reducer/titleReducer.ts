import { TitleActionType as ActionType } from 'stores/action-types/titleActionType';
import { TitleAction as Action } from 'stores/actions/titleActions';
import { ReactElement } from 'react';
import { FileBlobResponse } from '../../types/files/filesData';

export type TitleState = {
  title?: string | ReactElement;
  actions?: ReactElement | ReactElement[];
  subtitle?: string;
  fnLoadAvatar?: () => Promise<FileBlobResponse>;
  fnUpdateAvatar?: (logo: File) => Promise<void>;
  //icon?: string
};

const initialTitle: TitleState = {
  title: '',
  actions: undefined,
  subtitle: undefined,
  fnLoadAvatar: undefined,
  fnUpdateAvatar: undefined,
  //icon: undefined
};

export const titleReducer = (
  state: TitleState = initialTitle,
  action: Action,
): TitleState => {
  switch (action.type) {
    case ActionType.SET_TITLE:
      return {
        ...state,
        title: action.payload?.title as string | ReactElement,
        actions: action.payload?.actions as ReactElement | ReactElement[],
        subtitle: action.payload?.subtitle as string,
        //icon: action.payload?.icon as string
      };
    case ActionType.SET_AVATAR:
      return {
        ...state,
        fnLoadAvatar: action.payload?.fnLoadAvatar,
        fnUpdateAvatar: action.payload?.fnUpdateAvatar,
      };

    default:
      return { ...state };
  }
};
