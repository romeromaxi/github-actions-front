import React from 'react';
import { Box } from '@mui/material';

import { NavsTabHorizontal } from 'components/navs/NavsTab';
import CompanyCertificationsList from './certifications/CompanyCertificationsList';
import CompanyAffidavitList from './affidavit/CompanyAffidavitList';
import CompanyDeclarationOfAssetsList from './declarationAssets/CompanyDeclarationOfAssetsList';
import { CompanyViewDTO } from '../../../types/company/companyData';

function CompanyFinancePhysicalPerson() {
  return (
    <Box mt={2}>
      <NavsTabHorizontal
        lstTabs={[
          {
            tabList: [
              {
                label: 'Manifestación de Bienes Personales',
                content: <CompanyDeclarationOfAssetsList />,
                default: true,
              },
              {
                label: 'Declaraciones Juradas',
                content: <CompanyAffidavitList />,
              },
              {
                label: 'Certificaciones',
                content: <CompanyCertificationsList />,
              },
            ],
          },
        ]}
      />
    </Box>
  );
}

export default CompanyFinancePhysicalPerson;
