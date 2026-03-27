import { TitleActionType as ActionType } from 'stores/action-types/titleActionType';
import { ReactElement } from 'react';
import { FileBlobResponse } from '../../types/files/filesData';

interface TitleSetAction {
  type: ActionType.SET_TITLE;
  payload:
    | {
        title?: string | ReactElement;
        actions?: ReactElement | ReactElement[];
        subtitle?: string;
        //icon?: string
      }
    | undefined;
}

interface AvatarSetAction {
  type: ActionType.SET_AVATAR;
  payload:
    | {
        fnLoadAvatar?: () => Promise<FileBlobResponse>;
        fnUpdateAvatar?: (logo: File) => Promise<void>;
      }
    | undefined;
}

export type TitleAction = TitleSetAction | AvatarSetAction;
