import React, { useContext } from 'react';
import { OffererContext } from '../../components/OffererContextProvider';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import SolicitationDelayChartsWithFilter from './charts/solicitation-delay-charts/SolicitationDelayChartsWithFilter';

function ReportsSolicitationAnalytics() {
  const offerer = useContext(OffererContext);

  return (
    <SolicitationDelayChartsWithFilter
      offererId={offerer[EntityWithIdFields.Id]}
    />
  );
}

export default ReportsSolicitationAnalytics;
