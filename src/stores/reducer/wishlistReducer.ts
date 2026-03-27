import { ProductLineView } from '../../types/lines/productLineData';
import { WishlistAction as Action } from '../actions/wishlistAction';
import { WishlistActionType as ActionType } from '../action-types/wishlistActionType';

interface WishlistState {
  loading: boolean;
  error: string | null;
  wishlist?: ProductLineView[];
}

const initialState = {
  loading: false,
  error: null,
  wishlist: [],
};

const reducer = (
  state: WishlistState = initialState,
  action: Action,
): WishlistState => {
  switch (action.type) {
    case ActionType.GET_LINE_LIST:
      return { loading: true, error: null, wishlist: [] };
    case ActionType.GET_LINE_LIST_SUCCESS:
      return { loading: false, error: null, wishlist: action.payload };
    case ActionType.GET_LINE_LIST_ERROR:
      return { loading: false, error: action.payload, wishlist: [] };
    default:
      return state;
  }
};

export default reducer;
