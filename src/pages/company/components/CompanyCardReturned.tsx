import {
  CompanyFields,
  CompanyFileCompletenessFields,
  CompanyFileCompletenessView,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../types/company/companyData';
import { Box, Grid, Stack, Typography } from '@mui/material';
import CardActionButton from '../../../components/cards/CardActionButton';
import CompanyRoleSummary from './CompanyRoleSummary';
import React, { useEffect, useState } from 'react';
import DrawerBase from '../../../components/misc/DrawerBase';
import { SubTitle } from '../../../components/text/SubTitle';
import NewCompanyDrawerStyles from '../newCompany/NewCompanyDrawer.styles';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { useNavigate } from 'react-router-dom';
import { HttpCompany } from '../../../http';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { DefaultStylesButton } from '../../../components/buttons/Buttons';
import { LinearProgressWithTitle } from '../../../components/misc/LinearProgressWithLabel';
import NewCompanyForm from '../newCompany/NewCompanyForm';

interface CompanyCardReturnedProps {
  company: CompanyViewDTO;
  onReload?: () => void;
}

const CompanyCardReturned = ({
  company,
  onReload,
}: CompanyCardReturnedProps) => {
  const navigate = useNavigate();
  const [companyFileCompleteness, setCompanyFileCompleteness] =
    useState<CompanyFileCompletenessView>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const classes = NewCompanyDrawerStyles();

  useEffect(() => {
    HttpCompany.getCompletenessPercentage(company[EntityWithIdFields.Id]).then(
      setCompanyFileCompleteness,
    );
  }, []);

  const onOpenDrawer = () => setOpenDrawer(true);

  const renderHeader = () => (
    <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
      <WarningAmberIcon fontSize="small" sx={{ color: '#1565C0 !important' }} />
      <Typography color={'#1565C0'} fontSize={11}>
        {company[CompanyViewDTOFields.CompanyUserQueryStateDesc]}
      </Typography>
    </Stack>
  );

  const renderCuitAction = () => (
    <DefaultStylesButton size="small" onClick={onOpenDrawer}>
      Agregar
    </DefaultStylesButton>
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
              hideRole
              renderCuitAction={renderCuitAction}
              renderHeader={renderHeader}
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
              <Grid item xs={12}>
                <Typography
                  color={'red !important'}
                  letterSpacing={'0.2px'}
                  textAlign={'center'}
                  fontSize={15}
                  fontWeight={500}
                >
                  Solicitamos revisar la documentación enviada
                </Typography>
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
      <DrawerBase
        show={openDrawer}
        onCloseDrawer={() => {
          setOpenDrawer(false);
        }}
        title={'Completar Datos'}
      >
        <SubTitle text={'Información de la Empresa'} />
        {
          <Typography className={classes.companyName}>
            {company[CompanyViewDTOFields.BusinessName]}
          </Typography>
        }

        {onReload && (
          <NewCompanyForm
            onSubmitted={afterSubmit}
            companyId={company[EntityWithIdFields.Id]}
          />
        )}
      </DrawerBase>
    </Box>
  );
};

export default CompanyCardReturned;
