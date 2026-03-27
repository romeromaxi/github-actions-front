import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
  getShoppingCartSummary,
  addLineToShoppingCart,
  addLineToCompanies,
  removeLineFromShoppingCart
} from '../stores/action-creators/shoppingCartActionCreator.ts';

export const useShoppingCartActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators({
    getShoppingCartSummary,
    addLineToShoppingCart,
    addLineToCompanies,
    removeLineFromShoppingCart
  }, dispatch);
};