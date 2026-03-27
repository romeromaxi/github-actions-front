import {
  CompanyFields,
  CompanyFileCompletenessFields,
  CompanyFileCompletenessView,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import React, { useEffect, useState } from 'react';
import { HttpCompany } from '../../../http';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { Box, Grid, Stack, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CardActionButton from '../../../components/cards/CardActionButton';
import CompanyRoleSummary from './CompanyRoleSummary';
import { LinearProgressWithTitle } from '../../../components/misc/LinearProgressWithLabel';
import { useNavigate } from 'react-router-dom';
import { DefaultStylesButton } from '../../../components/buttons/Buttons';
import { grey } from '@mui/material/colors';
import CompanyAfipFormDrawer from './CompanyAfipFormDrawer';

interface CompanyCardCreatedWithoutBondProps {
  company: CompanyViewDTO;
  onReload?: () => void;
  hideAgg?: boolean;
  dontNavigate?: boolean;
}

const CompanyCardCreatedWithoutBond = ({
  company,
  onReload,
  hideAgg = false,
  dontNavigate = false,
}: CompanyCardCreatedWithoutBondProps) => {
  const navigate = useNavigate();
  const [companyFileCompleteness, setCompanyFileCompleteness] =
    useState<CompanyFileCompletenessView>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  useEffect(() => {
    HttpCompany.getCompletenessPercentage(company[EntityWithIdFields.Id]).then(
      setCompanyFileCompleteness,
    );
  }, []);

  const onOpenDrawer = (e: any) => {
    e.stopPropagation();
    setOpenDrawer(true);
  };

  const renderCuitAction = () => {
    if (!hideAgg && company[CompanyViewDTOFields.AllowGetResponsability])
      return (
        <DefaultStylesButton size="small" onClick={onOpenDrawer} tooltipTitle={'Enviá la documentación necesaria para verificar la empresa y obtener usuario pleno'}>
          Verificar
        </DefaultStylesButton>
      );
  };

  const renderSummaryHeader = () => (
    <Stack
      direction={'row'}
      alignItems={'center'}
      spacing={0.5}
      justifyContent={'center'}
    >
      <WarningAmberIcon fontSize="small" sx={{ color: '#1565C0 !important' }} />
      <Typography color={'#1565C0'} fontSize={11}>
        {company[CompanyViewDTOFields.CompanyUserQueryStateDesc]}
      </Typography>
    </Stack>
  );

  const afterSubmit = () => {
    setOpenDrawer(false);
    onReload && onReload();
  };

  return (
    <Box>
      <CardActionButton
        title={company[CompanyFields.BusinessName]}
        subtitleContent={
          <div
            style={{
              marginTop:
                company[CompanyFields.BusinessName].length < 44 ? 10 : 0,
            }}
          >
            <CompanyRoleSummary
              company={company}
              renderHeader={renderSummaryHeader}
              hideRole
              renderCuitAction={renderCuitAction}
            />
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
        fontProps={
          dontNavigate ? { color: `${grey[600]} !important` } : undefined
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

      <CompanyAfipFormDrawer
        companyId={company[EntityWithIdFields.Id]}
        companyName={company[CompanyViewDTOFields.BusinessName]}
        show={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
        onConfirmed={afterSubmit}
        inProcess={false}
      />
    </Box>
  );
};

export default CompanyCardCreatedWithoutBond;
