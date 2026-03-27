import React from 'react';
import { Grid, Typography } from '@mui/material';
import { AddButton } from 'components/buttons/Buttons';
import ValidateIdentityHandle from 'pages/user/components/ValidateIdentityHandle';
import {PublicEntityEnums} from "../../../../util/typification/publicEntityEnums";

interface CompanyHomeOtherCompaniesProps {
  hasCompanies?: boolean;
  onClick: () => void;
  onReload: () => void
}

function CompanyHomeOtherCompanies({
  hasCompanies,
  onClick, onReload
}: CompanyHomeOtherCompaniesProps) {
  const mainText: string = hasCompanies
    ? 'Carga tus cuentas MiPyME y comenzá a utilizar las soluciones LUC.'
    : 'Ingresa una cuenta MiPyME y comienza a utilizar las soluciones LUC.';
  const subText: string | undefined = hasCompanies
    ? `Si no sos el responsable ante ${PublicEntityEnums.ARCA}, tendrás acceso temporal al MARKET. Invitá al responsable para que te permita el uso pleno a la Cuenta`
    : undefined;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          fontWeight={600}
          lineHeight={1.2}
          fontSize={'1.5rem'}
        >
          Cuenta MiPyME
        </Typography>
        <Typography fontSize={14} mt={0.2}>
          {mainText}
        </Typography>
        {!!subText && (
          <Typography fontSize={14} mt={0.2}>
            {subText}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12}>
        <ValidateIdentityHandle onClick={onClick} onReload={onReload}>
          <AddButton>Cuenta MiPyME</AddButton>
        </ValidateIdentityHandle>
      </Grid>
    </Grid>
  );
}

export default CompanyHomeOtherCompanies;
