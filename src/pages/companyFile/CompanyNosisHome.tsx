import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Grid, Stack } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { BackButton } from 'components/buttons/Buttons';
import CardHeaderWithBorder from 'components/cards/CardHeaderWithBorder';

import { EnumColors } from 'types/general/generalEnums';
import { CompanyViewDTO } from 'types/company/companyData';

import { HttpCompany } from 'http/index';
import { getBaseColor } from 'util/typification/generalColors';
import CompanyNosisTableDetail from './CompanyNosisTableDetail';
import { EntityWithIdFields } from '../../types/baseEntities';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

function CompanyNosisHome() {
  const navigate = useNavigate();
  let { companyId } = useParams();

  const [company, setCompany] = useState<CompanyViewDTO>();

  const goToBack = () => navigate(-1);

  const mapActionTitle = () => (
    <Stack direction="row" spacing={1}>
      <Button
        variant={'contained'}
        color={'inherit'}
        onClick={goToBack}
        startIcon={<KeyboardBackspaceIcon />}
      >
        Volver
      </Button>
    </Stack>
  );

  useEffect(() => {
    if (companyId) {
      HttpCompany.getCompanyById(parseInt(companyId)).then(setCompany);
    }
  }, [companyId]);
  return (
    <Stack mt={3} spacing={1}>
      <CardHeaderWithBorder
        baseColor={EnumColors.GREY_GRADIENT}
        title="Información de Bases Públicas"
        avatar={
          <QueryStatsIcon
            fontSize={'small'}
            sx={{ color: getBaseColor(EnumColors.LIGHTBLUE) }}
          />
        }
        sx={{ borderRadius: '8px !important', marginTop: '8px' }}
        action={mapActionTitle()}
      />

      <Grid container>
        <Grid item xs={12}>
          <CompanyNosisTableDetail companyId={company?.id} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default CompanyNosisHome;
