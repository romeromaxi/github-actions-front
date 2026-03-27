import { Dispatch } from 'redux';
import { WishlistAction as Action } from 'stores/actions/wishlistAction';
import { WishlistActionType as ActionType } from 'stores/action-types/wishlistActionType';
import { HttpMarketWishList } from '../../http/market/httpMarketWishList';

const handleWishlistOperation = async (
  dispatch: Dispatch<Action>,
  operation: () => Promise<any>,
  then?: () => void
) => {
  dispatch({ type: ActionType.GET_LINE_LIST });
  
  try {
    await operation();
    const lineList = await HttpMarketWishList.getUserInfo();
    dispatch({
      type: ActionType.GET_LINE_LIST_SUCCESS,
      payload: lineList,
    });
    then?.();
  } catch (err) {
    dispatch({
      type: ActionType.GET_LINE_LIST_ERROR,
      payload: err instanceof Error ? err.message : 'Error',
    });
  }
};

export const getLineList = () => {
  return async (dispatch: Dispatch<Action>) => {
    await handleWishlistOperation(
      dispatch,
      () => Promise.resolve()
    );
  };
};

export const addLineToWishlist = (productLineId: number, then?: () => void) => {
  return async (dispatch: Dispatch<Action>) => {
    await handleWishlistOperation(
      dispatch,
      () => HttpMarketWishList.addLine(productLineId),
      then
    );
  };
};

export const removeLineFromWishlist = (productLineId: number, then?: () => void) => {
  return async (dispatch: Dispatch<Action>) => {
    await handleWishlistOperation(
      dispatch,
      () => HttpMarketWishList.removeLine(productLineId),
      then
    );
  };
};