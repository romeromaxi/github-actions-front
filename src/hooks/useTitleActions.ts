import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setFnLoadAvatar, setTitle } from '../stores/action-creators/titleActionCreator';
import { FileBlobResponse } from '../types/files/filesData';

export const useTitleActions = () => {
  const dispatch = useDispatch();
  
  const setPageTitle = useCallback(
    (title: string | React.ReactElement, actions?: React.ReactElement | React.ReactElement[], subtitle?: string) => 
      dispatch(setTitle(title, actions, subtitle)),
    [dispatch]
  );
  
  const setAvatarLoader = useCallback(
    (fnLoadAvatar?: () => Promise<FileBlobResponse>, fnUpdateAvatar?: (logo: File) => Promise<void>) => 
      dispatch(setFnLoadAvatar(fnLoadAvatar, fnUpdateAvatar)),
    [dispatch]
  );

  return { 
    setPageTitle,
    setFnLoadAvatar: setAvatarLoader
  };
};