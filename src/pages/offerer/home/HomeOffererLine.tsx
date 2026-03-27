import React, { useContext, useState } from 'react';
import { EntityWithIdFields } from '../../../types/baseEntities';
import OffererLineList from '../line/OffererLineList';
import { OffererContext } from '../components/OffererContextProvider';
import { NavsTabInsideHeader } from '../../../components/navs/NavsTab';
import { Alert } from '@mui/material';
import LineListHeader from '../line/components/LineListHeader';
import { AddButton } from '../../../components/buttons/Buttons';
import NewLineDrawer from '../line/NewLineDrawer';
import { useNavigate } from 'react-router-dom';
import { SafetyComponent } from '../../../components/security';
import {
  HomeOffererLineSecObjects,
  SecurityComponents,
} from '../../../types/security';

function HomeOffererLine() {
  const offerer = useContext(OffererContext);
  const navigate = useNavigate();
  const [openDialogNew, setOpenDialogNew] = useState<boolean>(false);

  const onNewLineSubmit = (lineId: number) =>
    navigate(`/offerer/lines/${lineId}`);

  const componentAction = (
    <SafetyComponent
      componentName={SecurityComponents.OffererLineHome}
      objectName={HomeOffererLineSecObjects.LineOffererNewButton}
    >
      <AddButton size={'small'} onClick={() => setOpenDialogNew(true)}>
        {'Agregar Línea de Productos'}
      </AddButton>
    </SafetyComponent>
  );

  return (
    <React.Fragment>
      <NavsTabInsideHeader
        lstTabs={[
          {
            tabList: [
              {
                label: 'Líneas',
                content: (
                  <OffererLineList
                    title="Líneas"
                    offererId={offerer[EntityWithIdFields.Id]}
                  />
                ),
                default: true,
              },
              {
                label: 'Gráficos',
                content: <Alert severity={'info'}>Sin información</Alert>,
              },
            ],
          },
        ]}
        action={componentAction}
      >
        <LineListHeader />
      </NavsTabInsideHeader>
      <NewLineDrawer
        show={openDialogNew}
        title={'Alta de Línea'}
        offererId={offerer[EntityWithIdFields.Id]}
        onCloseDrawer={() => setOpenDialogNew(false)}
        onFinishProcess={onNewLineSubmit}
      />
    </React.Fragment>
  );
}

export default HomeOffererLine;
