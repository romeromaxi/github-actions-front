import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from 'stores/reducer';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
