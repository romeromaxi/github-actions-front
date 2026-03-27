import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
  getLineList,
  addLineToWishlist,
  removeLineFromWishlist
} from '../stores/action-creators/wishlistActionCreator';

export const useWishlistActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators({
    getLineList,
    addLineToWishlist,
    removeLineFromWishlist
  }, dispatch);
};