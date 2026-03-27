import { Dispatch } from 'redux';
import { TitleAction as Action } from 'stores/actions/titleActions';
import { TitleActionType as ActionType } from 'stores/action-types/titleActionType';
import { ReactElement } from 'react';
import { FileBlobResponse } from '../../types/files/filesData';

export const setTitle = (
  title: string | ReactElement,
  actions: ReactElement | ReactElement[] | undefined = undefined,
  subtitle: string | undefined = undefined,
) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_TITLE,
      payload: {
        title: title,
        subtitle: subtitle,
        actions: actions,
      },
    });
  };
};

export const setFnLoadAvatar = (
  fnLoadAvatar: (() => Promise<FileBlobResponse>) | undefined = undefined,
  fnUpdateAvatar: ((logo: File) => Promise<void>) | undefined = undefined,
) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_AVATAR,
      payload: {
        fnLoadAvatar: fnLoadAvatar,
        fnUpdateAvatar: fnUpdateAvatar,
      },
    });
  };
};
