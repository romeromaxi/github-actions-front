
import React, {useContext, useEffect, useState} from 'react';
import OffererSummaryHeader from './components/OffererSummaryHeader';
import OffererSummaryRoles from './components/OffererSummaryRoles';
import OffererSummaryWorkTeams from './components/OffererSummaryWorkTeams';
import { OffererContext } from '../components/OffererContextProvider';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { HttpOffererRoles } from '../../../http';
import {
  OffererSummaryTotalsView
} from '../../../types/offerer/offererData';
import { OffererRole } from '../../../types/offerer/rolesData';
import { OffererWorkTeamView } from '../../../types/offerer/offererSolicitationData';
import { HttpOffererWorkTeams } from '../../../http/offerer/httpOffererWorkTeams';
import {NavsTabInsideHeader} from "../../../components/navs/NavsTab";

const HomeOffererSummary = () => {
  const offerer = useContext(OffererContext);
  const [totals, setTotals] = useState<OffererSummaryTotalsView>();
  const [roles, setRoles] = useState<OffererRole[]>();
  const [workTeams, setWorkTeams] = useState<OffererWorkTeamView[]>();

  const loadSummaryTotals = () => {
    HttpOffererRoles.getSummaryTotals(offerer[EntityWithIdFields.Id]).then(
      (r) => {
        setTotals(r);
      },
    );
  };

  const loadRoles = () => {
    setRoles(undefined);
    HttpOffererRoles.getListByOffererId(offerer[EntityWithIdFields.Id]).then(
      (res) => {
        setRoles(res);
      },
    );
  };

  const loadWorkTeams = () => {
    setWorkTeams(undefined);
    HttpOffererWorkTeams.getListByOffererId(
      offerer[EntityWithIdFields.Id],
    ).then((r) => setWorkTeams(r));
  };

  const loadAllData = () => {
    loadSummaryTotals();
    loadRoles();
    loadWorkTeams();
  };

  useEffect(() => {
    loadAllData();
  }, [offerer]);

  return (
        <NavsTabInsideHeader lstTabs={
          [
            {
              tabList: [
                {label: 'Usuarios',
                  content: <OffererSummaryRoles
                      offererId={offerer[EntityWithIdFields.Id]}
                      roles={roles}
                      onReload={loadAllData}
                  />,
                  default: true
                },
                {
                  label: 'Equipos',
                  content: <OffererSummaryWorkTeams
                      offererId={offerer[EntityWithIdFields.Id]}
                      workTeams={workTeams}
                      onReload={loadAllData}
                  />
                }
              ]
            }
          ]
        }
        >
            <OffererSummaryHeader totals={totals} roles={roles} workTeams={workTeams} />
        </NavsTabInsideHeader>
  );
};

export default HomeOffererSummary;
