import { LOADER_SHOW, LOADER_HIDE } from '../actions/loaderActions';

type LoaderState = {
  isLoading: boolean;
  message?: string;
};

const initialState: LoaderState = {
  isLoading: false
};

export const loaderReducer = (
  state = initialState,
  action: { type: string; payload?: string }
): LoaderState => {
  switch (action.type) {
    case LOADER_SHOW:
      return { 
        isLoading: true, 
        message: action.payload 
      };
      
    case LOADER_HIDE:
      return { 
        isLoading: false, 
        message: undefined 
      };
      
    default:
      return state;
  }
};