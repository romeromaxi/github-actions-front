import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { reloadProfile, setCompany, setProfile } from '../stores/action-creators/profileActionCreator';


export const useProfileActions = () => {
  const dispatch = useDispatch();
  
  const reload = useCallback(
    (shouldReload: boolean) => dispatch(reloadProfile(shouldReload)),
    [dispatch]
  );
  
  const setProfileId = useCallback(
    (profileId: number | undefined) => dispatch(setProfile(profileId)),
    [dispatch]
  );
  
  const setCompanyId = useCallback(
    (companyId: number | undefined) => dispatch(setCompany(companyId)),
    [dispatch]
  );

  return { 
    reloadProfile: reload,
    setProfile: setProfileId,
    setCompany: setCompanyId
  };
};