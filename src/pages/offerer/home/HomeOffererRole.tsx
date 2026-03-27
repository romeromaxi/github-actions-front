import React, { useContext } from 'react';
import OffererRolesList from '../roles/OffererRolesList';
import { OffererContext } from '../components/OffererContextProvider';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { useAction } from '../../../hooks/useAction';
import { OffererViewDTOFields } from '../../../types/offerer/offererData';

function HomeOffererRole() {
  const offerer = useContext(OffererContext);
  const { setTitle } = useAction();

  setTitle(offerer[OffererViewDTOFields.BusinessName]);
  return <OffererRolesList offererId={offerer[EntityWithIdFields.Id]} />;
}

export default HomeOffererRole;
