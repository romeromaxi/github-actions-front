import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { DictionarySecurityObject } from 'types/security';
import { useProfileActions } from '../../hooks/useProfileActions';
import { useUser } from '../../hooks/contexts/UserContext';

interface SecurityManagerProps {
  setDictionarySecurityObject: (
    dictionary: DictionarySecurityObject | undefined,
  ) => void;
  children?: React.ReactNode;
}

export const SecurityReloadContext = createContext({
  reloadSecurityObjects: () => Promise.resolve(),
});

function SecurityManager(props: SecurityManagerProps) {
  const { reloadProfile } = useProfileActions();
  const {user} = useUser();
  const { relaod, companyId } = useTypedSelector((state) => state.profile);

  const loadSecurityObjects = async (cancelReload = false) => {
    try {
      const httpModule = await import('../../http/cache/httpCacheSecurityObject');

      let promise: () => Promise<DictionarySecurityObject>;

      if (companyId) {
        promise = () => httpModule.HttpCacheSecurityObject.getByUserAndCompany(companyId);
      } else {
        promise = httpModule.HttpCacheSecurityObject.getByUser;
      }

      const securityObject = await promise();
      props.setDictionarySecurityObject(securityObject);

      if (cancelReload) reloadProfile(false);
    } catch (error) {
      console.error("Failed to load security objects:", error);
    }
  };
  
    useEffect(() => {
        if (user?.userId !== undefined) {
            loadSecurityObjects();
        }
    }, [user?.userId, companyId, props.setDictionarySecurityObject]);
    
  const contextValue = {
      reloadSecurityObjects: () => loadSecurityObjects(true)
  };
    
  useEffect(() => {
    if (relaod) {
      const handleReload = async () => {
        try {
          const httpModule = await import('../../http/cache/httpCacheSecurityObject');
          
          let promise: () => Promise<DictionarySecurityObject>;
          
          if (companyId) {
            promise = () => httpModule.HttpCacheSecurityObject.getByUserAndCompany(companyId);
          } else {
            promise = httpModule.HttpCacheSecurityObject.getByUser;
          }
          
          const securityObject = await promise();
          props.setDictionarySecurityObject(securityObject);
          reloadProfile(false);
        } catch (error) {
          console.error("Failed to reload security objects:", error);
          reloadProfile(false);
        }
      };
      
      handleReload();
    }
  }, [relaod, companyId, props.setDictionarySecurityObject, reloadProfile]);

  return (
    <SecurityReloadContext.Provider value={contextValue}>
      {props.children || null}
    </SecurityReloadContext.Provider>
  );
}

export const useSecurityReload = () => useContext(SecurityReloadContext);

export default SecurityManager;
