import { ShoppingCartActionType as ActionType } from 'stores/action-types/shoppingCartActionType';
import { ProductLineSummaryShoppingCart } from '../../types/lines/productLineData';

interface GetShoppingCartSummaryAction {
  type: ActionType.GET_SUMMARY;
}

interface GetShoppingCartSummarySuccessAction {
  type: ActionType.GET_SUMMARY_SUCCESS;
  payload: ProductLineSummaryShoppingCart;
}

interface GetShoppingCartSummaryErrorAction {
  type: ActionType.GET_SUMMARY_ERROR;
  payload: string;
}

/*export enum AddToShoppingCartPayloadFields {
    ProductLineId = 'productLineId',
    CompanyId = 'companyId',
}

export interface AddToShoppingCartPayload {
    [AddToShoppingCartPayloadFields.ProductLineId]: number,
    [AddToShoppingCartPayloadFields.CompanyId]?: number,
}

interface AddToShoppingCartAction {
    type: ActionType.ADD_TO_SHOPPING_CART,
    payload: AddToShoppingCartPayload
}

interface RemoveFromShoppingCartAction {
    type: ActionType.REMOVE_FROM_SHOPPING_CART,
    payload: number
}*/

export type ShoppingCartAction =
  | GetShoppingCartSummaryAction
  | GetShoppingCartSummarySuccessAction
  | GetShoppingCartSummaryErrorAction;
/*    | AddToShoppingCartAction
    | RemoveFromShoppingCartAction*/
