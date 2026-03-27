import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { Grid, Stack } from '@mui/material';
import DvrIcon from '@mui/icons-material/Dvr';
import ListIcon from '@mui/icons-material/List';
import FactoryIcon from '@mui/icons-material/Factory';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import { LoaderBlockUI } from 'components/loader';
import { TitlePage } from 'components/text/TitlePage';
import { NavsTabVertical } from 'components/navs/NavsTab';
import CompanyDetailCard from './components/CompanyDetailCard';

import { PersonTypes } from 'types/person/personEnums';
import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { HttpCompany } from 'http/company/httpCompany';

import CompanySocietyList from './relatedPeople/CompanySocietyList';

import FinancialYearList from './finance/FinancialYearList';
import CompanyAdministratorsRepresentativesList from './relatedPeople/CompanyAdministratorsRepresentativesList';
import CompanyFinancePhysicalPerson from './finance/CompanyFinancePhysicalPerson';
import CompanyRepresentativesList from './relatedPeople/CompanyRepresentativesList';
import { EntityWithIdFields } from '../../types/baseEntities';
import SolicitationByCompanyList from '../markets/comunications/SolicitationByCompanyList';
import FlowPage from './flow/FlowPage';
import CompanyActivityCard from './activity/components/CompanyActivityCard';

function NavsTabVerticalPhysicalPerson(company: CompanyViewDTO) {
  return (
    <NavsTabVertical
      lstTabs={[
        {
          tabList: [
            {
              label: 'Legajo Único Crediticio',
              content: (
                <Navigate
                  to={`/mis-presentaciones/${company[EntityWithIdFields.Id]}/legajo`}
                />
              ),
              sx: {
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: '12px 24px',
                gap: '12px',
                borderRadius: '8px',
                background:
                  'linear-gradient(90deg, #04D5BB 0%, #4784E1 84.11%)',
                color: 'white',
              },
            },
          ],
        },
        {
          tabList: [
            {
              label: 'Comunicaciones',
              content: <SolicitationByCompanyList />,
            },
          ],
        },
        {
          label: 'Información de la empresa:',
          tabList: [
            {
              label: 'Datos Generales',
              icon: <FactoryIcon fontSize={'small'} />,
              content: (
                <Stack gap={3}>
                  <TitlePage text="Datos Generales" />
                  <CompanyDetailCard company={company} />
                </Stack>
              ),
              default: true,
            },
            {
              label: 'Actividad',
              icon: <DvrIcon fontSize={'small'} />,
              content: (
                <Stack gap={3}>
                  <TitlePage text="Datos de actividad de la empresa" />
                  <CompanyActivityCard company={company} />
                </Stack>
              ),
            },
            {
              label: 'Representantes',
              icon: <PeopleAltOutlinedIcon fontSize={'small'} />,
              content: (
                <Stack gap={3}>
                  <TitlePage text="Representantes de la empresa" />
                  <CompanyRepresentativesList />
                </Stack>
              ),
            },
            {
              label: 'Información Eco Financiera',
              icon: <QueryStatsIcon fontSize={'small'} />,
              content: <CompanyFinancePhysicalPerson />,
            },
            {
              label: 'Económico Financiera',
              icon: <ListIcon fontSize={'small'} />,
              content: <FlowPage company={company} />,
            },
          ],
        },
      ]}
    />
  );
}

function NavsTabVerticalLegalPerson(company: CompanyViewDTO) {
  return (
    <NavsTabVertical
      lstTabs={[
        {
          tabList: [
            {
              label: 'Legajo Único Crediticio',
              content: (
                <Navigate
                  to={`/mis-presentaciones/${company[EntityWithIdFields.Id]}/legajo`}
                />
              ),
              sx: {
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: '12px 24px',
                gap: '12px',
                borderRadius: '8px',
                background:
                  'linear-gradient(90deg, #04D5BB 0%, #4784E1 84.11%)',
                color: 'white',
              },
            },
          ],
        },
        {
          tabList: [
            {
              label: 'Comunicaciones',
              content: <SolicitationByCompanyList />,
            },
          ],
        },
        {
          label: 'Información de la empresa:',
          tabList: [
            {
              label: 'Datos Generales',
              icon: <FactoryIcon fontSize={'small'} />,
              content: (
                <Stack gap={3}>
                  <TitlePage text="La Empresa" />
                  <CompanyDetailCard company={company} />
                </Stack>
              ),
              default: true,
            },
            {
              label: 'Actividad',
              icon: <DvrIcon fontSize={'small'} />,
              content: (
                <Stack gap={3}>
                  <TitlePage text="Datos de actividad de la empresa" />
                  <CompanyActivityCard company={company} />
                </Stack>
              ),
            },
            {
              label: 'Socios',
              icon: <RecordVoiceOverIcon fontSize={'small'} />,
              content: <CompanySocietyList />,
            },
            {
              label: 'Responsables',
              icon: <PeopleAltOutlinedIcon fontSize={'small'} />,
              content: (
                <Stack gap={3}>
                  <TitlePage text="Administradores y Representantes de la empresa" />
                  <CompanyAdministratorsRepresentativesList />
                </Stack>
              ),
            },
            {
              label: 'Información Eco Financiera',
              icon: <QueryStatsIcon fontSize={'small'} />,
              content: <FinancialYearList dataId={company[EntityWithIdFields.Id]}/>,
            },
            {
              label: 'Económico Financiera',
              icon: <ListIcon fontSize={'small'} />,
              content: <FlowPage company={company} />,
            },
          ],
        },
      ]}
    />
  );
}

function HomeCompany() {
  const params = useParams();

  const companyId: number = parseInt(params.idCompany ?? '');

  const [company, setCompany] = useState<CompanyViewDTO>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    HttpCompany.getCompanyById(companyId).then((company) => {
      setCompany(company);
      setLoading(false);
    });
  }, [companyId]);

  return (
    <>
      {company && (
        <Grid container item xs={12}>
          <Grid item xs={12} lg={12}>
            {company[CompanyViewDTOFields.PersonTypeCode] == PersonTypes.Legal
              ? NavsTabVerticalLegalPerson(company)
              : NavsTabVerticalPhysicalPerson(company)}
          </Grid>
        </Grid>
      )}

      {loading && <LoaderBlockUI />}
    </>
  );
}

export default HomeCompany;
