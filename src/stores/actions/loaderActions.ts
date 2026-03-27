export const LOADER_SHOW = 'loader/SHOW';
export const LOADER_HIDE = 'loader/HIDE';

export const showLoader = (message?: string) => ({
  type: LOADER_SHOW,
  payload: message
});

export const hideLoader = () => ({
  type: LOADER_HIDE
});

export type LoaderAction = 
  | ReturnType<typeof showLoader>
  | ReturnType<typeof hideLoader>;