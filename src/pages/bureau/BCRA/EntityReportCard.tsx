import React from 'react';
import { Box, Stack } from '@mui/material';
import { DebtHistoryDetail } from '../../../types/nosis/nosisData';
import MaxSituationByDateChart from './MaxSituationByDateChart';
import EntitiesBySituationChart from './EntitiesBySituationChart';
import BureauReportCard from '../components/BureauReportCard';

interface EntityReportCardProps {
  debtHistoryDetailList?: DebtHistoryDetail[];
}

function EntityReportCard({ debtHistoryDetailList }: EntityReportCardProps) {
  return (
    <BureauReportCard title={'Evolución máxima situación informada'}>
      <Stack direction={'row'}>
        <Box sx={{ width: 1, height: '300px' }}>
          <MaxSituationByDateChart
            debtHistoryDetailList={debtHistoryDetailList}
          />
        </Box>
        {
          /*
          <Box sx={{ width: 1 / 2 }}>
            <EntitiesBySituationChart
              debtHistoryDetailList={debtHistoryDetailList}
            />
          </Box>
           */
        }
      </Stack>
    </BureauReportCard>
  );
}

export default EntityReportCard;
