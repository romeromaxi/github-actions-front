import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserSummaryActionType } from 'stores/action-types/userSummaryActionType';
import { UserInfoSummaryView } from 'types/user';
import { useMemo } from 'react';

export function useUserSummaryActions() {
  const dispatch = useDispatch();
  
  return useMemo(() => bindActionCreators({
    setUserSummary: (payload: UserInfoSummaryView | undefined) => ({
      type: UserSummaryActionType.SET_USER_SUMMARY,
      payload
    }),
    
    reloadUserSummary: () => ({
      type: UserSummaryActionType.RELOAD_USER_SUMMARY
    })
  }, dispatch), [dispatch]);
}