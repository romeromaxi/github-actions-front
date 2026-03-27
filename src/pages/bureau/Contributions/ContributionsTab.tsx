import React from 'react';
import { BureauInformationContext } from 'hooks/contexts/BureauInformationContext';
import { Stack } from '@mui/material';
import { DataWithLabel } from '../../../components/misc/DataWithLabel';
import { NosisDetailQueryFields } from '../../../types/nosis/nosisData';
import ContributionsQuantityTable from './ContributionsQuantityTable';
import EmployerContributionsTable from './EmployerContributionsTable';
import {PublicEntityEnums} from "../../../util/typification/publicEntityEnums";

function ContributionsTab() {
  const { loading, error, nosisQuery } = React.useContext(BureauInformationContext);

  return (
    <Stack gap={2}>
      <DataWithLabel
        rowDirection
        label={'Fuente de la Información'}
        data={PublicEntityEnums.BCRA}
      />
      <ContributionsQuantityTable
        contributions={
          nosisQuery?.[NosisDetailQueryFields.SocialSecurityContributions]
        }
        loading={loading}
        error={error}
      />
      <DataWithLabel
        rowDirection
        label={'Fuente de la Información'}
        data={PublicEntityEnums.BCRA}
      />
      <EmployerContributionsTable
        contributionList={
          nosisQuery?.[
            NosisDetailQueryFields.SocialSecurityContributionsDetailList
          ]
        }
        loading={loading}
        error={error}
      />
    </Stack>
  );
}

export default ContributionsTab;
