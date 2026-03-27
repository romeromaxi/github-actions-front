import { Grid, Typography } from '@mui/material';
import React from 'react';
import { SubTitle } from 'components/text/SubTitle';
import { AddButton } from 'components/buttons/Buttons';
import ValidateIdentityHandle from '../../../user/components/ValidateIdentityHandle';
import {PublicEntityEnums} from "../../../../util/typification/publicEntityEnums";

interface CompanyHomeOwnCompanyProps {
  hasPersonalCompany?: boolean;
  onClick: () => void;
}

function CompanyHomeOwnCompany({
  hasPersonalCompany,
  onClick,
}: CompanyHomeOwnCompanyProps) {
  if (hasPersonalCompany)
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SubTitle text={'Soy mi propia empresa'} light />
          <Typography fontSize={14} mt={0.2}>
            Ya tenés tu espacio personal para guardar información y
            documentación relevante para tu empresa Persona Humana. Comenzá a
            utilizar las soluciones LUC
          </Typography>
        </Grid>
      </Grid>
    );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SubTitle text={'Soy mi propia empresa'} light />
        <Typography fontSize={14} mt={0.2}>
          {`Si tenés actividad comercial en ${PublicEntityEnums.ARCA} ya podes comenzar tu espacio
          privado y personal para guardar información y documentación relevante
          para tu proyecto o empresa.`}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <ValidateIdentityHandle onClick={onClick}>
          <AddButton>Persona Humana</AddButton>
        </ValidateIdentityHandle>
      </Grid>
    </Grid>
  );
}

export default CompanyHomeOwnCompany;
