import React, {useEffect, useMemo, useState} from 'react';
import {Button, Grid, Stack} from '@mui/material';
import {TypographyBase} from "../../components/misc/TypographyBase";
import {useUser} from "../../hooks/contexts/UserContext";
import {stringFormatter} from "../../util/formatters/stringFormatter";
import {PlusIcon} from "@phosphor-icons/react";
import {Skeleton} from "@mui/lab";
import CompaniesRelatedList from "./homeTabs/CompaniesRelatedList";
import ValidateIdentityHandle from 'pages/user/components/ValidateIdentityHandle';
import { NewCompanyContext } from './components/MyCompaniesList';
import NewCompanyBaseDrawer from './components/new/NewCompanyBaseDrawer';
import {CompanyViewDTO, CompanyViewDTOFields} from "../../types/company/companyData";
import {CompanyUserState} from "../../types/company/companyEnums";
import {UserInvitationFromCompany} from "../../types/invitations/invitationData";
import {CompanyUserInvitation} from "../../types/user/userInvitation";
import {useNavigate} from "react-router-dom";
import {HttpUser} from "../../http";
import {userStorage} from "../../util/localStorage";
import {useSnackbarActions} from "../../hooks/useSnackbarActions";
import UserValidationComponent from "../user/validation/UserValidationComponent";
import CreateCompanyComponent, { CreateCompanySteps } from "./newCompany/CreateCompanyComponent";
import UserOperationsWithoutActivity from "../user/operations/UserOperationsWithoutActivity";
import { CryptoJSHelper } from "util/helpers";
import UserPendingActions from "../user/components/UserPendingActions";
import ProductLinesRecommendedForUser from "../lines/ProductLinesRecommendedForUser";
import FlyerExploreMarket from "../../components/flyers/FlyerExploreMarket";

interface HomeCompanyUserContextType {
    isLoading: boolean,
    hasAnyCompanyData: boolean,
    companies: CompanyViewDTO[] | undefined,
    sentInvites: UserInvitationFromCompany[] | undefined,
    invitesAsResponsible: UserInvitationFromCompany[] | undefined,
    invites: CompanyUserInvitation[] | undefined,
    loadCompanies: () => void
}

export const HomeCompanyUserContext = React.createContext<HomeCompanyUserContextType>({
    isLoading: true,
    hasAnyCompanyData: true,
    companies: undefined,
    sentInvites: undefined,
    invitesAsResponsible: undefined,
    invites: undefined,
    loadCompanies: () => {}
});

enum FirstLoginOption {
    Idle,
    OwnCompany,
    CreateCompany,
    JoinCompany
}

const sortedCompany = (a: CompanyViewDTO, b: CompanyViewDTO): number => {
    const aIsPersonalCompany = a[CompanyViewDTOFields.IsUserCompany];
    const bIsPersonalCompany = b[CompanyViewDTOFields.IsUserCompany];

    if (aIsPersonalCompany) return -1;

    if (bIsPersonalCompany) return 1;

    const aIsBlocked =
        a[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
        CompanyUserState.Blocked;
    const bIsBlocked =
        b[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
        CompanyUserState.Blocked;

    if (aIsBlocked && !bIsBlocked) return 1;

    if (!aIsBlocked && bIsBlocked) return -1;

    return a[CompanyViewDTOFields.BusinessName].localeCompare(
        b[CompanyViewDTOFields.BusinessName],
    );
};

function HomeCompanyUser() {
  const { user, refreshUser } = useUser();
  const { addSnackbarSuccess } = useSnackbarActions();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [companies, setCompanies] = useState<CompanyViewDTO[]>();
  const [sentInvites, setSentInvites] = useState<UserInvitationFromCompany[]>();
  const [invitesAsResponsible, setInvitesAsResponsible] = useState<UserInvitationFromCompany[]>();
  const [invites, setInvites] = useState<CompanyUserInvitation[]>();
  const [loginOptionSelected, setLoginOptionSelected] = useState<FirstLoginOption>(FirstLoginOption.Idle);
  const [showValidateIdentity, setShowValidateIdentity] = useState<boolean>(false);

  const encryptedHome = CryptoJSHelper.encryptRoute('/mi-cuenta');
    
  const hasAnyCompanyData = useMemo(() => 
    !!companies?.length || !!invites?.length || !!sentInvites?.length || !!invitesAsResponsible?.length
  , [companies, invites, sentInvites, invitesAsResponsible]);
  
  const initialStepCreateCompany = useMemo(() => {
      if (!user || !user.hasValidatedIdentity)
          return undefined;

      switch (loginOptionSelected) {
          case FirstLoginOption.CreateCompany:
              return { step: CreateCompanySteps.STEP_AFIP_SYNC, willCreate: true };
              
          case FirstLoginOption.JoinCompany:
              return { step: CreateCompanySteps.STEP_AFIP_SYNC, willCreate: false };
              
          case FirstLoginOption.Idle:
          default:
              return undefined;
      }
  }, [user, loginOptionSelected]);
  
  const [openDrawerNewCompany, setOpenDrawerNewCompany] = useState<boolean>(false);
  const navigate = useNavigate();

  const onCloseNewRepo = () => setOpenDrawerNewCompany(false);

    const loadCompanies = async () => {
        setLoading(true);
        try {
            const { HttpCompany } = await import("../../http/company/httpCompany");
            const { HttpInvitations } = await import("../../http/invitations");
            const { HttpUserInvitations } = await import("../../http/user/httpUserInvitations");
            
            Promise.all([
                HttpCompany.getCompaniesByUser(),
                HttpInvitations.getSentInvitations(),
                HttpInvitations.getPendingInvitationsAsResponsible(),
                HttpUserInvitations.getCompanyInvitations()
            ])
                .then((values) => {
                    setCompanies(values[0].sort(sortedCompany));
                    setSentInvites(values[1])
                    setInvitesAsResponsible(values[2])
                    setInvites(values[3])
                })
                .finally(() => setLoading(false))
        } catch (error) {
            console.error("Error loading companies:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, []);
    
    const handleNewCompany = () => {        
        navigate({
            pathname: `/nueva-pyme`,
            search: `?redirect=${encryptedHome}&return=${encryptedHome}`
        });
    }

    const onHandleInsertOwnCompany = () => {
        userStorage.skipFirstLogin();
        refreshUser().then().catch();
        addSnackbarSuccess('Se creó correctamente tu cuenta de autónomo o monotributista');
        loadCompanies();
    }    
    
    const onHandleSubmitValidatedIdentity = () => {
        switch (loginOptionSelected) {
            case FirstLoginOption.Idle:
            case FirstLoginOption.OwnCompany:
                onHandleInsertOwnCompany();
                break;
            case FirstLoginOption.CreateCompany:
                setShowValidateIdentity(false);
                refreshUser().then().catch();
                break;
            case FirstLoginOption.JoinCompany:
                setShowValidateIdentity(false);
                refreshUser().then().catch();
                break;
        }
    }
    
    const onClickCreateCompany = () => {
        setLoginOptionSelected(FirstLoginOption.CreateCompany);
        setShowValidateIdentity(user ? !user.hasValidatedIdentity : true);
    }

    const onClickJoinCompany = () => {
        setLoginOptionSelected(FirstLoginOption.JoinCompany);
        setShowValidateIdentity(user ? !user.hasValidatedIdentity : true);
    }
    
    const onHandleSubmitCreateCompany = () => {
        HttpUser.skipFirstLogin().then().catch();
        userStorage.skipFirstLogin()
        refreshUser().then().catch();
        loadCompanies()
    }
    
    const onHandleSkipFirstLogin = () => {
        HttpUser.skipFirstLogin().then().catch();
        userStorage.skipFirstLogin()
        refreshUser().then().catch();
    }
    
  return (
      <HomeCompanyUserContext.Provider value={{ 
          isLoading,
          hasAnyCompanyData,
          companies,
          sentInvites,
          invitesAsResponsible,
          invites,
          loadCompanies
      }}>
          {
              user && user.isFirstLogin && !hasAnyCompanyData &&
                  <Grid container spacing={4.5}>
                      <Grid item xs={12}>
                          {
                              showValidateIdentity ?
                                  <UserValidationComponent onSubmit={onHandleSubmitValidatedIdentity}
                                                           waitBackgroundProcessing={loginOptionSelected === FirstLoginOption.OwnCompany}
                                                           onClickReturn={onHandleSkipFirstLogin}
                                  />
                                  :
                                  (user.hasTaxActivity) ?
                                      <UserValidationComponent onSubmit={onHandleSubmitValidatedIdentity}
                                                               waitBackgroundProcessing
                                                               onClickReturn={onHandleSkipFirstLogin}
                                                               backLabel="Hacerlo más tarde"
                                      />
                                      :
                                      user.hasValidatedIdentity ?
                                          <CreateCompanyComponent onSubmit={onHandleSubmitCreateCompany}
                                                                  onClickReturn={onHandleSkipFirstLogin}
                                                                  initialStep={initialStepCreateCompany}
                                          /> 
                                          :
                                          <UserOperationsWithoutActivity onClickCreate={onClickCreateCompany}
                                                                         onClickJoin={onClickJoinCompany}
                                                                         onClickReturn={onHandleSkipFirstLogin}
                                          />
                          }
                      </Grid>
                  </Grid>
          }

          {
              (!user || !user.isFirstLogin) &&
                <Grid container spacing={4.5}>
                  <Grid item xs={12}>
                    <Stack direction={{ xs: 'column', sm: 'row' }}
                           justifyContent={'space-between'}
                           spacing={1}
                    >
                      <Stack spacing={0.75}
                             width={{ xs: 1, sm: '48%' }}
                      >
                        {
                          !!user ?
                            <React.Fragment>
                              <TypographyBase variant={'h2'}>
                                {`Hola, ${stringFormatter.toTitleCase(user?.firstName)}`}
                              </TypographyBase>
            
                              <TypographyBase variant={'body2'} color={'text.lighter'}>
                                {stringFormatter.formatCuit(user.cuit)}
                              </TypographyBase>
                            </React.Fragment>
                            :
                            <Skeleton variant={'text'} width={'100%'} />
                        }
                      </Stack>
            
                        <ValidateIdentityHandle 
                            onClick={handleNewCompany} 
                            redirectUrl={`/nueva-pyme?redirect=${encryptedHome}&return=${encryptedHome}`}
                            returnUrl={'/mi-cuenta'}
                        >
                            <Button color={'primary'} variant={'contained'} size={'medium'}
                                    data-cy="user-companies-new-company-button"
                                    id={"company-new-btn"}
                                    startIcon={<PlusIcon />}
                            >
                                Vincular nueva PyME
                            </Button>
                        </ValidateIdentityHandle>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <CompaniesRelatedList />
                  </Grid>
                  
                  <Grid item xs={12}>
                      <FlyerExploreMarket />
                  </Grid>
                    
                    <UserPendingActions />

                    <ProductLinesRecommendedForUser />
                    
                    <NewCompanyContext.Provider value={{ onCloseDrawer: onCloseNewRepo }}>
                        <NewCompanyBaseDrawer open={openDrawerNewCompany}
                                              onReload={loadCompanies}
                                              onClose={() => {
                                                  setOpenDrawerNewCompany(false)
                                              }}
                                              onSubmit={() => {
                                                  setOpenDrawerNewCompany(false);
                                                  loadCompanies();
                                              }}
                        />
                    </NewCompanyContext.Provider>
                </Grid>
          }
          
      </HomeCompanyUserContext.Provider>
  );
}

export default HomeCompanyUser;
