import { Grid, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import CompanyFileFillingsButtons from './CompanyFileFillingsButtons';
import CardActionButton from 'components/cards/CardActionButton';
import { FillingsModelsTab } from 'types/fillings/fillingsEnums';
import AssociatesModelMenu from './models/AssociatesModelMenu';
import AuthoritiesModelMenu from './models/AuthoritiesModelMenu';
import EmployeesModelMenu from './models/EmployeesModelMenu';
import CompanyFinancialStatementsModelMenu from './models/CompanyFinancialStatementsModelMenu';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { EntityWithIdFields } from 'types/baseEntities';
import { PersonTypes } from 'types/person/personEnums';
import PersonFinancialStatementsModelMenu from './models/PersonFinancialStatementsModelMenu';
import FlowsModelMenu from './models/FlowsModelMenu';
import AfipModelMenu from './models/AfipModelMenu';

interface ModelsFillingsMenuProps {
  company: CompanyViewDTO;
  onSelectModel: () => void;
  onBack: () => void;
}

const ModelsFillingsMenu = ({
  company,
  onSelectModel,
  onBack,
}: ModelsFillingsMenuProps) => {
  const [modelType, setModelType] = useState<FillingsModelsTab>(
    FillingsModelsTab.Home,
  );

  const seeModels = () => {
    setModelType(FillingsModelsTab.Home);
    onBack();
  };

  const isLegalPerson =
    company[CompanyViewDTOFields.PersonTypeCode] == PersonTypes.Legal;

  const onClickModel = (model: FillingsModelsTab) => {
    setModelType(model);
    onSelectModel();
  };

  return (
    <>
      {modelType == FillingsModelsTab.Home && (
        <Stack spacing={1}>
          <Typography variant="h3" fontWeight={600}>
            Mirá los modelos de presentación que LUC tiene para vos
          </Typography>
          <Grid container spacing={2}>
            <CompanyFileFillingsButtons
              companyId={company[EntityWithIdFields.Id]}
              model
            />

            {isLegalPerson && (
              <Grid item md={4}>
                <CardActionButton
                  title={'Socios'}
                  onClick={() => onClickModel(FillingsModelsTab.Associates)}
                />
              </Grid>
            )}
            <Grid item md={4}>
              <CardActionButton
                title={'Autoridades'}
                onClick={() => onClickModel(FillingsModelsTab.Authorities)}
              />
            </Grid>
            <Grid item md={4}>
              <CardActionButton
                title={'Empleados'}
                onClick={() => onClickModel(FillingsModelsTab.Employees)}
              />
            </Grid>
            <Grid item md={4}>
              <CardActionButton
                title={isLegalPerson ? 'EECC' : 'Manifestación de Bienes'}
                onClick={() => onClickModel(FillingsModelsTab.EECC)}
              />
            </Grid>
            <Grid item md={4}>
              <CardActionButton
                title={'Compras y Ventas'}
                onClick={() => onClickModel(FillingsModelsTab.Flows)}
              />
            </Grid>
            <Grid item md={4}>
              <CardActionButton
                title={'Constitutiva e Impositiva'}
                onClick={() => onClickModel(FillingsModelsTab.Afip)}
              />
            </Grid>
          </Grid>
        </Stack>
      )}
      {modelType == FillingsModelsTab.Associates && (
        <AssociatesModelMenu
          onBack={seeModels}
          companyId={company[EntityWithIdFields.Id]}
        />
      )}
      {modelType == FillingsModelsTab.Authorities && (
        <AuthoritiesModelMenu
          onBack={seeModels}
          companyId={company[EntityWithIdFields.Id]}
        />
      )}
      {modelType == FillingsModelsTab.Employees && (
        <EmployeesModelMenu
          onBack={seeModels}
          companyId={company[EntityWithIdFields.Id]}
        />
      )}
      {modelType == FillingsModelsTab.EECC &&
        company &&
        (company[CompanyViewDTOFields.PersonTypeCode] == PersonTypes.Legal ? (
          <CompanyFinancialStatementsModelMenu
            onBack={seeModels}
            company={company}
          />
        ) : (
          <PersonFinancialStatementsModelMenu
            onBack={seeModels}
            company={company}
          />
        ))}
      {modelType == FillingsModelsTab.Flows && (
        <FlowsModelMenu onBack={seeModels} company={company} />
      )}
      {modelType == FillingsModelsTab.Afip && (
        <AfipModelMenu onBack={seeModels} company={company} />
      )}
    </>
  );
};

export default ModelsFillingsMenu;
