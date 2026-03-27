import React, { useEffect } from 'react';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { useLocation } from "react-router-dom";
import { useUser } from "../../hooks/contexts/UserContext";
import { useUserSummaryActions } from '../../hooks/useUserSummaryActions';

function UserSummaryInformationManager() {
  const { user, isLoggedIn } = useUser();
  const { reload } = useTypedSelector((state) => state.userSummary);
  const { setUserSummary } = useUserSummaryActions();
  const location = useLocation();

  const loadUserSummary = async () => {
    if (!user || !isLoggedIn) return;
    
    if (user.lackConfirmation) return
    
    try {
      const { HttpUser } = await import('../../http/index');
      const summary = await HttpUser.getUserSummary();
      setUserSummary(summary);
    } catch (error) {
      console.error('Failed to load user summary:', error);
      setUserSummary(undefined);
    }
  };

  useEffect(() => {
    loadUserSummary();
  }, [user, isLoggedIn, location]);

  useEffect(() => {
    if (reload) loadUserSummary();
  }, [reload]);

  return <></>;
}

export default UserSummaryInformationManager;