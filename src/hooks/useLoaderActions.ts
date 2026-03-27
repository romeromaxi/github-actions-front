import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../stores/actions/loaderActions';

export const useLoaderActions = () => {
  const dispatch = useDispatch();
  
  const show = useCallback(
    (message?: string) => dispatch(showLoader(message)),
    [dispatch]
  );
  
  const hide = useCallback(
    () => dispatch(hideLoader()),
    [dispatch]
  );

  return { showLoader: show, hideLoader: hide };
};