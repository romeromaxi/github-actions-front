import { combineReducers } from 'redux';
import shoppingCartReducer from './shoppingCartReducer';
import { loaderReducer } from './loaderReducer';
import { snackbarReducer } from './snackbarReducer';
import { titleReducer } from './titleReducer';
import { userSummaryReducer } from './userSummaryReducer';
import wishlistReducer from './wishlistReducer';
import { profileReducer } from './profileReducer';

const reducers = combineReducers({
  loading: loaderReducer,
  shoppingCart: shoppingCartReducer,
  wishList: wishlistReducer,
  snackbar: snackbarReducer,
  title: titleReducer,
  profile: profileReducer,
  userSummary: userSummaryReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
