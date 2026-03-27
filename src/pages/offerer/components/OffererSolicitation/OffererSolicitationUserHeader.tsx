import React, { useContext } from 'react';
import OffererUserHeader from '../OffererUserHeader';
import { OffererSolicitationsInformationContext } from './OffererSolicitationsInformation';
import BoxDataWithLabel, {
  BoxDataWithLabelLoading,
} from 'components/misc/BoxDataWithLabel';
import { SolicitationTotalsViewFields } from 'types/solicitations/solicitationData';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../../../types/baseEntities';
import { Stack, Typography } from '@mui/material';
import TotalBoxComponent from '../../../../components/misc/TotalBoxComponent';
import { CompanyFinanceHeaderFields } from '../../../../types/company/companyFinanceInformationData';

function OffererSolicitationUserHeader() {
  const { solicitationUserTotals } = useContext(
    OffererSolicitationsInformationContext,
  );

  return (
    <OffererUserHeader>
      {solicitationUserTotals ? (
        <React.Fragment>
          <Stack alignItems={'end'}>
            <Typography fontWeight={600}>Asignadas por etapa</Typography>

            <Stack direction={'row'} alignItems={'start'} spacing={3}>
              {solicitationUserTotals.map((x) => (
                <TotalBoxComponent
                  label={x[EntityWithIdAndDescriptionFields.Description]}
                  size={'small'}
                  total={x[SolicitationTotalsViewFields.SolicitationsQuantity]}
                  nulleable
                  key={`BoxDataWithLabelOffererSolicitationUserHeader_${x[EntityWithIdFields.Id]}`}
                />
              ))}
            </Stack>
          </Stack>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <BoxDataWithLabelLoading />
          <BoxDataWithLabelLoading />
        </React.Fragment>
      )}
    </OffererUserHeader>
  );
}

export default OffererSolicitationUserHeader;
