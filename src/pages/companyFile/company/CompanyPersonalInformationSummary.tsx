import React, { useContext } from 'react';

import { Grid } from '@mui/material';
import { CompanyFileCompletenessFields } from 'types/company/companyData';
import { useNavigate } from 'react-router-dom';
import { BusinessTwoTone } from '@mui/icons-material';
import CardActionButton from '../../../components/cards/CardActionButton';
import { LinearProgressWithTitle } from '../../../components/misc/LinearProgressWithLabel';
import { CompanyFileHomeContext } from '../CompanyFileHome';

function CompanyPersonalInformationSummary() {
  const { companyFileCompleteness } = useContext(CompanyFileHomeContext);
  const navigate = useNavigate();

  const goToView = () =>
    navigate(`detalle`, {
      state: {
        prevPathname: window.location.toString().includes('?tipo=1')
          ? '?tipo=1'
          : '?tipo=2',
      },
    });

  return (
    <CardActionButton
      title={'Datos constitutivos y de actividad'}
      subtitle={'Hacé click aquí para ir al detalle de la empresa y ver más.'}
      icon={<BusinessTwoTone sx={{ fontSize: '80px' }} />}
      content={
        <Grid container>
          {companyFileCompleteness && (
            <LinearProgressWithTitle
              title={'Porcentaje de completitud'}
              value={
                companyFileCompleteness[
                  CompanyFileCompletenessFields
                    .CompanyTotalDataCompletenessPercentage
                ]
              }
            />
          )}
        </Grid>
      }
      onClick={goToView}
    />
  );
}

export default CompanyPersonalInformationSummary;
