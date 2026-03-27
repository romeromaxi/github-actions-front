import { Dispatch } from 'redux';
import { ShoppingCartAction as Action } from 'stores/actions/shoppingCartAction';
import { ShoppingCartActionType as ActionType } from 'stores/action-types/shoppingCartActionType';
import { SnackbarActionType as ActionTypeShopping } from 'stores/action-types/snackbarActionType';
import {BaseResponse, BaseResponseFields, BaseResponseWithData} from '../../types/baseEntities';
import { EnumSnackbarType, SnackbarTypeFields } from '../reducer/snackbarReducer';

const handleCartOperation = async <T extends BaseResponse | BaseResponseWithData<any>>(
    dispatch: Dispatch<Action>,
    operation: () => Promise<T>,
    then?: (baseResponse?: T) => void
): Promise<T | undefined> => {
  dispatch({ type: ActionType.GET_SUMMARY });

  try {
    const response = await operation();

    if (response[BaseResponseFields.HasError]) {
      (dispatch as any)({
        type: ActionTypeShopping.ADD_SNACKBAR,
        payload: {
          [SnackbarTypeFields.Type]: EnumSnackbarType.WARNING,
          [SnackbarTypeFields.Message]: response[BaseResponseFields.ErrorDescription],
        },
      });
      return response;
    }

    const { HttpMarketShoppingCart } = await import('../../http/market/httpMarketShoppingCart');
    const summary = await HttpMarketShoppingCart.getSummary();
    dispatch({
      type: ActionType.GET_SUMMARY_SUCCESS,
      payload: summary,
    });
    then?.(response);
    return response;
  } catch (err) {
    dispatch({
      type: ActionType.GET_SUMMARY_ERROR,
      payload: err instanceof Error ? err.message : 'Error',
    });
    return undefined;
  }
};

export const getShoppingCartSummary = () => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.GET_SUMMARY });
    try {
      const { HttpMarketShoppingCart } = await import('../../http/market/httpMarketShoppingCart');
      const summary = await HttpMarketShoppingCart.getSummary();
      dispatch({ type: ActionType.GET_SUMMARY_SUCCESS, payload: summary });
    } catch (err) {
      dispatch({ type: ActionType.GET_SUMMARY_ERROR, payload: 'Error' });
    }
  };
};

export const addLineToShoppingCart = (
  productLineId: number,
  companyId?: number,
  then?: (baseResponse?: BaseResponse) => void
) => {
  return async (dispatch: Dispatch<Action>) => {
    const { HttpMarketShoppingCart } = await import('../../http/market/httpMarketShoppingCart');
    return await handleCartOperation(
      dispatch,
      () => HttpMarketShoppingCart.addLine(productLineId, companyId),
      then
    );
  };
};

export const addLineToCompanies = (
  productLineId: number,
  companiesIds: number[],
  then?: (baseResponse?: BaseResponseWithData<number[]>) => void
) => {
  return async (dispatch: Dispatch<Action>) => {
    const { HttpMarketShoppingCart } = await import('../../http/market/httpMarketShoppingCart');
    return await handleCartOperation(
      dispatch,
      () => HttpMarketShoppingCart.addLineToSeveralCompanies(productLineId, companiesIds),
      then
    );
  };
};

export const removeLineFromShoppingCart = (
  productLineId: number,
  companyId?: number,
  then?: () => void
) => {
  return async (dispatch: Dispatch<Action>) => {
    const { HttpMarketShoppingCart } = await import('../../http/market/httpMarketShoppingCart');
    return await handleCartOperation(
      dispatch,
      () => 
        companyId ? 
          HttpMarketShoppingCart.removeLine(productLineId, companyId) :
          HttpMarketShoppingCart.removeLineUniqueCompany(productLineId),
      then as (baseResponse?: BaseResponse) => void
    );
  };
};