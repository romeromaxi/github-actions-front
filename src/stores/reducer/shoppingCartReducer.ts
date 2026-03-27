import {
  ProductLineSummaryShoppingCart,
  ProductLineSummaryShoppingCartFields,
} from '../../types/lines/productLineData';
import { ShoppingCartAction as Action } from '../actions/shoppingCartAction';
import { ShoppingCartActionType as ActionType } from '../action-types/shoppingCartActionType';

interface ShoppingCartState {
  loading: boolean;
  error: string | null;
  shoppingCart?: ProductLineSummaryShoppingCart;
}

const initialState = {
  loading: false,
  error: null,
  shoppingCart: {
    [ProductLineSummaryShoppingCartFields.Quantity]: 0,
    [ProductLineSummaryShoppingCartFields.ProductLines]: [],
  },
};

const reducer = (
  state: ShoppingCartState = initialState,
  action: Action,
): ShoppingCartState => {
  switch (action.type) {
    case ActionType.GET_SUMMARY:
      return { loading: true, error: null, shoppingCart: undefined };
    case ActionType.GET_SUMMARY_SUCCESS:
      return { loading: false, error: null, shoppingCart: action.payload };
    case ActionType.GET_SUMMARY_ERROR:
      return { loading: false, error: action.payload, shoppingCart: undefined };
    default:
      return state;
  }
};

export default reducer;
