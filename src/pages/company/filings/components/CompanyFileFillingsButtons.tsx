import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import CardActionButton from 'components/cards/CardActionButton';
import { CompanyFileType } from 'types/company/companyEnums';

interface CompanyFileFillingsButtonsProps {
  companyId: number;
  model?: boolean;
}

const CompanyFileFillingsButtons = ({
  companyId,
  model,
}: CompanyFileFillingsButtonsProps) => {
  const navigate = useNavigate();

  const goToCompanyFile = (fileType: CompanyFileType) =>
    navigate(
      `/mis-presentaciones/${companyId}/legajo/detalle?tipo=${fileType}`,
      { state: model ? 'model' : '' },
    );

  return (
    <Fragment>
      <Grid item md={4}>
        <CardActionButton
          title={'Legajo de Contacto'}
          onClick={() => goToCompanyFile(CompanyFileType.Long)}
        />
      </Grid>
      {/*
                <Grid item md={4}>
                    <CardActionButton title={'Legajo Abreviado'}
                                      subtitle={"Hacé click para ver el legajo abreviado"}
                                      onClick={() => goToCompanyFile(CompanyFileType.Short)}
                    />
                </Grid>
                 */}
    </Fragment>
  );
};

export default CompanyFileFillingsButtons;
