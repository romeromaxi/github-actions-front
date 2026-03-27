import * as React from 'react';
import { useEffect } from 'react';
import { SolicitationStateChartForm } from './SolicitationAnalysisAndStateChartWithFilter';
import { HttpOffererReports } from '../../../../../../http/offerer/httpOffererReports';
import { EntityWithIdAndDescriptionQuantity } from '../../../../../../types/baseEntities';
import { downloadFileBlobHelper } from '../../../../../../util/helpers';
import BaseSolicitationPieChart from './BaseSolicitationPieChart';

const data1 = [
  { name: 'Admisión', solicitations: 30 },
  { name: 'Aprobación Admisión', solicitations: 20 },
  { name: 'Análisis Precalificación', solicitations: 10 },
  { name: 'Aprobación Precalificación', solicitations: 25 },
];

interface SolicitationsInAnalysisChartProps {
  offererId: number;
  filter: SolicitationStateChartForm;
}

const SolicitationsInAnalysisChart: React.FC<
  SolicitationsInAnalysisChartProps
> = ({ offererId, filter }: SolicitationsInAnalysisChartProps) => {
  const [data, setData] = React.useState<EntityWithIdAndDescriptionQuantity[]>(
    [],
  );

  useEffect(() => {
    HttpOffererReports.getSolicitationsInAnalysis(offererId, filter).then(
      setData,
    );
  }, [offererId, filter]);

  return (
    <BaseSolicitationPieChart
      title={'Solicitudes en Análisis'}
      data={data}
      onDownload={() =>
        HttpOffererReports.exportSolicitationsInAnalysis(
          offererId,
          filter,
        ).then(downloadFileBlobHelper)
      }
    />
  );
};

export default SolicitationsInAnalysisChart;
