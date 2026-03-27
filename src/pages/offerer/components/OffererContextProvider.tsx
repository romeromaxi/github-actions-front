import React, { useEffect, useState } from 'react';
import { OffererViewDTO } from 'types/offerer/offererData';
import { HttpOfferer } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';
import { userStorage } from 'util/localStorage/userStorage';
import { HttpOffererLogo } from 'http/offerer/httpOffererLogo';

interface OffererContextProviderProps {
  children?: React.ReactNode;
}

export const OffererContext = React.createContext({} as OffererViewDTO);

function OffererContextProvider({ children }: OffererContextProviderProps) {
  const { showLoader, hideLoader, setFnLoadAvatar } = useAction();
  const [offerer, setOfferer] = useState<OffererViewDTO>({} as OffererViewDTO);

  const logoutUser = () => userStorage.removeFromStorage();

  useEffect(() => {
    showLoader();
    HttpOfferer.getOffererByUser()
      .then((offerer) => {
        if (!!offerer && !!offerer[EntityWithIdFields.Id]) {
          setOfferer(offerer);
          setFnLoadAvatar(() =>
            HttpOffererLogo.getByOffererId(offerer[EntityWithIdFields.Id]),
          );
        } else {
          logoutUser();
        }
      })
      .catch(() => logoutUser())
      .finally(() => hideLoader());
  }, []);

  return (
    <OffererContext.Provider value={offerer}>
      {!!offerer?.[EntityWithIdFields.Id] && children}
    </OffererContext.Provider>
  );
}

export default OffererContextProvider;
