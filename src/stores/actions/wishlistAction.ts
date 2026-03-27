import { WishlistActionType as ActionType } from '../action-types/wishlistActionType';
import { ProductLineView } from '../../types/lines/productLineData';

interface GetWishListLineListAction {
  type: ActionType.GET_LINE_LIST;
}

interface GetWishListLineListActionSuccessAction {
  type: ActionType.GET_LINE_LIST_SUCCESS;
  payload: ProductLineView[];
}

interface GetWishListLineListActionErrorAction {
  type: ActionType.GET_LINE_LIST_ERROR;
  payload: string;
}

export type WishlistAction =
  | GetWishListLineListAction
  | GetWishListLineListActionSuccessAction
  | GetWishListLineListActionErrorAction;
