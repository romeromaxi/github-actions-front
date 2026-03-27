import React, {createContext} from 'react';
import {Navigate} from 'react-router-dom';
import {Avatar, Button, Card, CardContent, Stack, Typography} from '@mui/material';
import {NavsTabVertical} from "components/navs/NavsTab";
import CompaniesTabContent from "../homeTabs/CompaniesTabContent";
import {TypographyBase} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import UserPersonalDataTabContent from "../../user/PersonalData/UserPersonalDataTabContent";
import CompaniesInvitationsTabContent from "../homeTabs/CompaniesInvitationsTabContent";
import {useTypedSelector} from "hooks/useTypedSelector";
import {UserInfoSummaryFields} from "types/user";
import { useUser } from 'hooks/contexts/UserContext';
import {AppRoutesDefinitions, useAppNavigation} from "../../../hooks/navigation";

type NewCompanyTypeContext = {
  onCloseDrawer: () => void;
};

export const NewCompanyContext = createContext<NewCompanyTypeContext>({
  onCloseDrawer: () => {},
});

function MyCompaniesList() {
  const { navigate } = useAppNavigation();
  const { summary } = useTypedSelector((state) => state.userSummary);
  const { user, isLoggedIn, displayName, initialsName } = useUser();

  const goToContactLuc = () => navigate(AppRoutesDefinitions.LucContactPage);
    
  if (!isLoggedIn) return <Navigate to={'/login'} />;
  
  return (
    <React.Fragment>
      <NavsTabVertical 
        tabSize={4} 
        lstTabs={[
          {tabList: [
              {
                label: 'Empresas vinculadas', 
                content: <CompaniesTabContent invitationAlert={summary && !!summary[UserInfoSummaryFields.UnansweredInvitations]}/>, 
                default: true, 
                queryParam: 'empresas'
              },
              {
                  label: 'Mi Perfil de usuario', 
                  content: <UserPersonalDataTabContent showMailToggle />, 
                  queryParam: 'perfil'
              },
              {
                label: 'Invitaciones pendientes', 
                content: <CompaniesInvitationsTabContent />, 
                queryParam: 'invitaciones',
                highlighted: summary && !!summary[UserInfoSummaryFields.UnansweredInvitations]
              },
            ]}
        ]}
        header={
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <Avatar
              sx={{
                fontSize: '1.05rem !important',
                width: 48,
                height: 48,
                color: 'primary.contrastText',
                backgroundColor: 'primary.main',
              }}
            >
              {initialsName}
            </Avatar>
            <Stack width={'100%'} overflow={'hidden'}>
              <TypographyBase variant={'h5'} fontWeight={500} maxLines={2} tooltip>
                {displayName}
              </TypographyBase>
              {user?.cuit && (
                <Typography variant={'caption'} color={'text.lighter'}>
                  {stringFormatter.formatCuit(user.cuit)}
                </Typography>
              )}
            </Stack>
          </Stack>
        }
      >
        <Stack spacing={1}>
          <CompanyDisclaimer />
          
          <Button 
            variant={'outlined'} 
            color={'secondary'} 
            size={'small'}
            onClick={() => navigate(AppRoutesDefinitions.MarketLanding)}
            id={"company-goto-market-btn"}
            fullWidth
          >
            Ingresá a la tienda
          </Button>

          <Button 
            variant={'outlined'} 
            size={'small'}
            color={'secondary'}
            onClick={goToContactLuc}
            id={"company-contact-btn"}
            fullWidth
          >
            <Stack>
              <div>Problemas? Dudas? Sugerencias?</div>
              <div>Contactanos</div>
            </Stack>
          </Button>
        </Stack>
      </NavsTabVertical>
    </React.Fragment>
  );
}

function CompanyDisclaimer() {
  return (
    <Card sx={{ opacity: 1 }}>
      <CardContent>
        <TypographyBase variant={'subtitle2'}
                        fontWeight={500}
                        fontStyle={'italic'}>
          Ingresá a la empresa para:
        </TypographyBase>
        <TypographyBase variant={'subtitle2'}
                        fontStyle={'italic'}>
          - Ver solicitudes enviadas
        </TypographyBase>
        <TypographyBase variant={'subtitle2'}
                        fontStyle={'italic'}>
          - Ver cómo te ven
        </TypographyBase>
        <TypographyBase variant={'subtitle2'}
                        fontStyle={'italic'}>
          - Gestionar datos e información
        </TypographyBase>
        <TypographyBase variant={'subtitle2'}
                        fontStyle={'italic'}>
          - Gestionar tus documentos
        </TypographyBase>
        <TypographyBase variant={'subtitle2'}
                        fontStyle={'italic'}>
          - Gestionar roles de usuarios
        </TypographyBase>
      </CardContent>
    </Card>
  );
}

export default MyCompaniesList;