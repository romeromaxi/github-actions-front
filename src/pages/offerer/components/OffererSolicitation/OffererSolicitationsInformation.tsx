import React, { createContext, useEffect, useState } from 'react';

import { NavsTabInsideHeader } from 'components/navs/NavsTab';
import OffererInformationHeader from '../OffererInformationHeader';
import OffererSolicitationTable from './OffererSolicitationTable/OffererSolicitationTable';
import OffererSolicitationChartsTab from './OffererSolicitationCharts/OffererSolicitationChartsTab';
import {
  SolicitationTotalsView,
  SolicitationTotalsViewOfferer,
} from 'types/solicitations/solicitationData';
import { HttpSolicitation } from 'http/index';
import OffererSolicitationUserHeader from './OffererSolicitationUserHeader';
import { Stack } from '@mui/material';

interface OffererSolicitationsInformationProps {
  offererId: number;
}

export const OffererSolicitationsInformationContext = createContext({
  solicitationTotals: undefined as undefined | SolicitationTotalsViewOfferer,
  solicitationUserTotals: undefined as undefined | SolicitationTotalsView[],
});

const OffererSolicitationsInformation = ({
  offererId,
}: OffererSolicitationsInformationProps) => {
  const [solicitationTotals, setSolicitationTotals] =
    useState<SolicitationTotalsViewOfferer>();
  const [solicitationUserTotals, setSolicitationUserTotals] =
    useState<SolicitationTotalsView[]>();

  const searchTotals = () => {
    setSolicitationTotals(undefined);
    setSolicitationUserTotals(undefined);
    HttpSolicitation.getTotalSolicitationsByOfferer(offererId).then(
      setSolicitationTotals,
    );

    HttpSolicitation.getTotalSolicitationsByUserOfferer(offererId).then(
      setSolicitationUserTotals,
    );
  };

  useEffect(() => {
    searchTotals();
  }, []);

  return (
    <OffererSolicitationsInformationContext.Provider
      value={{
        solicitationTotals: solicitationTotals,
        solicitationUserTotals: solicitationUserTotals,
      }}
    >
      <Stack spacing={2}>
        <OffererSolicitationUserHeader />

        <NavsTabInsideHeader
          lstTabs={[
            {
              tabList: [
                {
                  label: 'Solicitudes',
                  content: <OffererSolicitationTable />,
                  default: true,
                },
                {
                  label: 'Gráficos',
                  content: (
                    <OffererSolicitationChartsTab offererId={offererId} />
                  ),
                },
              ],
            },
          ]}
        >
          <OffererInformationHeader offererId={offererId} />
        </NavsTabInsideHeader>
      </Stack>
    </OffererSolicitationsInformationContext.Provider>
  );
};

export default OffererSolicitationsInformation;
