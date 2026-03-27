import {
  CompanyFields,
  CompanyFileCompletenessFields,
  CompanyFileCompletenessView,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { HttpCompany } from '../../../http';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { Box, Grid } from '@mui/material';
import CardActionButton from '../../../components/cards/CardActionButton';
import CompanyRoleSummary from './CompanyRoleSummary';
import { LinearProgressWithTitle } from '../../../components/misc/LinearProgressWithLabel';

interface CompanyCardCompletedProps {
  company: CompanyViewDTO;
}

function CompanyCardCompleted({ company }: CompanyCardCompletedProps) {
  const navigate = useNavigate();
  const [companyFileCompleteness, setCompanyFileCompleteness] =
    useState<CompanyFileCompletenessView>();

  useEffect(() => {
    HttpCompany.getCompletenessPercentage(company[EntityWithIdFields.Id]).then(
      setCompanyFileCompleteness,
    );
  }, []);

  return (
    <Box>
      <CardActionButton
        title={company[CompanyFields.BusinessName]}
        subtitleContent={
          <div
            style={{
              marginTop:
                company[CompanyFields.BusinessName].length < 44 ? 28 : 0,
            }}
          >
            <CompanyRoleSummary company={company} />
          </div>
        }
        content={
          companyFileCompleteness && (
            <Grid container spacing={2} marginTop={'-34px'}>
              <Grid item xs={6}>
                <LinearProgressWithTitle
                  title={'Legajo abreviado'}
                  value={
                    companyFileCompleteness[
                      CompanyFileCompletenessFields
                        .FileTypeShortCompletenessPercentage
                    ]
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <LinearProgressWithTitle
                  title={'Legajo de Contacto'}
                  value={
                    companyFileCompleteness[
                      CompanyFileCompletenessFields
                        .FileTypeLongCompletenessPercentage
                    ]
                  }
                />
              </Grid>
            </Grid>
          )
        }
        onClick={
          company[CompanyViewDTOFields.AllowCompanyAccess]
            ? company[CompanyViewDTOFields.AllowFullAccess]
              ? () =>
                  navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}`)
              : () =>
                  navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}?tab=sentSolicitations`)
            : () => {}
        }
        company
        headerProps={
          company[
            CompanyViewDTOFields.CompanyQueryStateUserClassificationCode
          ] == 1
            ? { backgroundColor: '#3884c7', borderRadius: '1em 1em 0em 0em' }
            : { backgroundColor: '#6fade3', borderRadius: '1em 1em 0em 0em' }
        }
        headerText={
          company[CompanyViewDTOFields.CompanyQueryStateUserClassificationDesc]
        }
      />
    </Box>
  );
}

export default CompanyCardCompleted;
