import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';

import {
    AppBar,
    Backdrop,
    Badge,
    Box,
    Button,
    Collapse,
    Divider,
    IconButton,
    MenuItem,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';

import MenuHomeStyles from './MenuHome.styles';

import {authTokenStorage} from 'util/localStorage/authTokenStorage';
import {MenuLink} from 'types/menu/menuLink';
import ShoppingBagPopup from 'pages/markets/lines/shoppingbag/ShoppingBagPopup';
import {CompanyViewDTO} from 'types/company/companyData';
import {EntityWithIdFields} from 'types/baseEntities';
import {LogInProcessParts, Module} from 'types/form/login/login-enum';
import LogInDrawer from '../../pages/user/LogInDrawer';
import {BellRinging, House} from "phosphor-react";
import {SafetyComponent} from '../security';
import {
    AppRouteSecObjects,
    GeneralConfigurationSecObjects,
    SecurityComponents,
    SideBarMenuItemsSecObjects,
} from '../../types/security';
import FailRedirectMarketDialog from '../../pages/markets/home/components/FailRedirectMarketDialog';
import MustHaveRelatedCompanyDialog from '../../pages/markets/lines/shoppingbag/dialogs/MustHaveRelatedCompanyDialog';
import useSearchParamsEncrypted from '../../hooks/useSearchParamsEncrypted';
import UserAvatarWithMenuNew from "../../layouts/home/components/UserAvatarWithMenuNew";
import {FavoriteEmptyButtonWithQuantity, NotificationsIconButton} from "../buttons/Buttons";
import {WrapperIcons} from "../icons/Icons";
import {Bell, BuildingOffice, Files, Folders, Heart, List, User, X} from "@phosphor-icons/react";
import {useTheme} from "@mui/material/styles";
import {AppbarMenuDataItemFields} from "../../types/menu/menuData";
import {useModuleNavigate} from "../../hooks/useModuleNavigate";
import {useUser} from "../../hooks/contexts/UserContext";
import {LogoAndLeftsideAppBarItems} from './components/LogoAndLeftsideAppBarItems';
import {useWishlistActions} from 'hooks/useWishlistActions';
import {useProfileActions} from 'hooks/useProfileActions';
import {useSnackbarActions} from 'hooks/useSnackbarActions';
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {UserInfoSummaryFields} from "../../types/user";
import FactoryIcon from "@mui/icons-material/Factory";
import {FactoryOutlined} from "@mui/icons-material";
import {AppRoutesDefinitions, useAppNavigation} from "../../hooks/navigation";
import BurgerMenuOptions from "./components/BurgerMenuOptions";
import {themeIconsSizeDefinition} from "../../util/themes/definitions";

interface TopToolbarNewProps {
    hideLogo?: boolean
}

const ButtonIdLogin: string = "btn-login";
const ButtonIdSignUp: string = "btn-registrate";
const ButtonIdMyCompanies: string = "btn-mis-empresas";
const ButtonIdMySolicitations: string = "btn-mis-solicitudes";
const ButtonIdMySelection: string = "btn-mi-seleccion";
const ButtonIdFavorites: string = "btn-favoritos";
const ButtonIdNotifications: string = "btn-notificaciones";

export function TopToolbarNew({ hideLogo }: TopToolbarNewProps) {
    const { user, isLoggedIn, logout, isUserContextLoading } = useUser();
    const { summary } = useTypedSelector((state) => state.userSummary);
    const solicitationsQty = summary?.[UserInfoSummaryFields.SolicitationsAlerts]
    const userModule = useMemo(() => user?.userType, [user]);
    const routeDomNavigate = useNavigate();
    const { navigate } = useAppNavigation();
    
    const { getLineList } = useWishlistActions();
    const { setProfile } = useProfileActions();
    const { addSnackbarWarning, addSnackbarError } = useSnackbarActions();
    const [buttonPopup, setButtonPopup] = useState<boolean>(false);
    const [failRedirect, setFailRedirect] = useState<boolean>(false);
    const [drawerProcess, setDrawerProcess] = useState<LogInProcessParts | undefined>(undefined)
    const [loadingCompanies, setLoadingCompanies] = useState<boolean>(false)
    const [companies, setCompanies] = useState<CompanyViewDTO[]>([]);
    const [showConfirmCreateCompany, setShowConfirmCreateCompany] =
        useState<boolean>(false);
    const [searchParams] = useSearchParamsEncrypted();
    const redirect = searchParams.get('redirect') || '';
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMediumLargeScreen = useMediaQuery(theme.breakpoints.down(1440));
    const isLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const isExtraExtraSmallScreen = useMediaQuery(theme.breakpoints.down(475));
    const isScreenSmallerThanCompanyButtonsThreshold = useMediaQuery(theme.breakpoints.down(1475));
    const isExtraLargeScreen = useMediaQuery(theme.breakpoints.down(1589));
    const moduleNavigate = useModuleNavigate()
    const isLanding = window.location.toString().includes('landing')
    const [isProcessingLogin, setIsProcessingLogin] = useState(false);

    const handleLoginSuccess = useCallback(() => {
        if (redirect && redirect !== '') {
          routeDomNavigate(redirect);
        } else if (user?.lackConfirmation && user.mail) {
          const encodedMail = encodeURIComponent(user.mail);
          routeDomNavigate(`/signup/confirmation?mail=${encodedMail}`);
        } else if (user?.userType === Module.Offerer && isLanding) {
          moduleNavigate(Module.Offerer);
        } else {
          moduleNavigate(Module.Company)
        }
        setIsProcessingLogin(false);
      }, [user, redirect, routeDomNavigate, isLanding, moduleNavigate]);
    
    const handleLoginFailure = useCallback(() => {
        logout();
            setProfile(undefined);
        addSnackbarWarning('El usuario ingresado no corresponde a la sección solicitada');
        setIsProcessingLogin(false);
    }, [setProfile, addSnackbarWarning]);

    useEffect(() => {
        if (!isProcessingLogin) return;
        
        if (!isUserContextLoading) {
            if (user) {
            handleLoginSuccess();
            } else {
            handleLoginFailure();
            }
        }
    }, [isProcessingLogin, isUserContextLoading, user, handleLoginSuccess, handleLoginFailure]);

    const onLogIn = () => {
        if (isUserContextLoading || isProcessingLogin) return;
        setIsProcessingLogin(true);
    };

    function hasEnoughCompanies(): boolean {
        return companies?.length !== 1 && companies?.length !== 0;
    }

    const onCancelCreateCompany = () => setShowConfirmCreateCompany(false);

    const onViewChart = () => {
        if (hasEnoughCompanies()) {
            setButtonPopup(true);
        } else {
            const companyId: number | undefined =
                companies && companies?.[0]?.[EntityWithIdFields.Id];
            if (companyId) routeDomNavigate(`/market/lines/carrito/${companyId}`);
            else if (!loadingCompanies && companies && companies.length == 0) {
                setShowConfirmCreateCompany(true)
            }
        }
    };

    const getCompanies = async () => {
        setLoadingCompanies(true);
        try {
            const { HttpCompany } = await import('../../http/index');
            const response = await HttpCompany.getCompaniesByUser();
            setLoadingCompanies(false);
            setCompanies(response);
        } catch (error) {
            setLoadingCompanies(false);
            addSnackbarError('Error al cargar las empresas');
        }
    };

    useEffect(() => {
        let tokenAutorizacion: string | null = authTokenStorage.getAccessToken();

        if (tokenAutorizacion) {
            getLineList();
            getCompanies();
        }
    }, [authTokenStorage.getAccessToken]);


    const onViewSolicitations = () => {
        switch (userModule) {
            case Module.Company:
                routeDomNavigate(`/market/solicitudes`);
                return;
            case Module.Offerer:
                routeDomNavigate(`/offerer/solicitations`);
                return;
            case Module.Internal:
                routeDomNavigate('/internal/solicitations')
                return;
        }
    }

    const onViewNotifications = () => {
        switch (userModule) {
            case Module.Company:
                routeDomNavigate(`/notificaciones`);
                return;
            case Module.Offerer:
                routeDomNavigate(`/offerer/notificaciones`);
                return;
            case Module.Internal:
                routeDomNavigate(`/internal/notificaciones`);
                return;
        }
    }
    
    const onNavigateMarketLanding = () => navigate(AppRoutesDefinitions.MarketLanding);
    
    const userAvatarMenuItems = useMemo(() => {
        const baseItems = [
            {
                [AppbarMenuDataItemFields.Id]: ButtonIdNotifications,
                [AppbarMenuDataItemFields.Logo]: Bell,
                [AppbarMenuDataItemFields.Title]: 'Notificaciones',
                [AppbarMenuDataItemFields.OnClick]: onViewNotifications,
            }
        ];
    
        if (isExtraExtraSmallScreen) {
            return [
                {
                    [AppbarMenuDataItemFields.Id]: ButtonIdMySelection,
                    [AppbarMenuDataItemFields.Logo]: Folders,
                    [AppbarMenuDataItemFields.Title]: 'Selección',
                    [AppbarMenuDataItemFields.OnClick]: onViewChart,
                    [AppbarMenuDataItemFields.Component]: {
                        componentName: SecurityComponents.GeneralConfiguration,
                        objectName: GeneralConfigurationSecObjects.SolicitationShoppingBagButton,
                    }
                },
                {
                    [AppbarMenuDataItemFields.Id]: ButtonIdMySolicitations,
                    [AppbarMenuDataItemFields.Logo]: Files,
                    [AppbarMenuDataItemFields.Title]: 'Solicitudes',
                    [AppbarMenuDataItemFields.OnClick]: onViewSolicitations,
                },
                {
                    [AppbarMenuDataItemFields.Id]: ButtonIdMyCompanies,
                    [AppbarMenuDataItemFields.Logo]: BuildingOffice,
                    [AppbarMenuDataItemFields.Title]: 'Mis Empresas',
                    [AppbarMenuDataItemFields.OnClick]: () => routeDomNavigate('/mi-cuenta'),
                    [AppbarMenuDataItemFields.Component]: {
                        componentName: SecurityComponents.GeneralConfiguration,
                        objectName: GeneralConfigurationSecObjects.MyCompaniesButton
                    }
                }, ...baseItems
            ];
        }
        return baseItems;
    }, [isExtraExtraSmallScreen, onViewChart, onViewNotifications, onViewSolicitations]);

    const IconButtonResponsive = ({ id, icon: Icon, onClick, title }) => {
        const theme = useTheme();
        const isSmall = useMediaQuery(theme.breakpoints.down(1100));
        const isMedium = useMediaQuery(theme.breakpoints.between(1100, 1320));
        
        const sizes = {
          small: {
            icon: 18,
            button: 36, 
            padding: 8
          },
          medium: {
            icon: 20,
            button: 40,
            padding: 10
          },
          large: {
            icon: 22,
            button: 44,
            padding: 11
          }
        };
      
        const { icon, button, padding } = isSmall ? sizes.small : 
                                        isMedium ? sizes.medium : 
                                        sizes.large;
      
        return (
          <Tooltip title={title}>
            <IconButton
                id={id}
              color="secondary"
              onClick={onClick}
              sx={{
                width: button,
                height: button,
                padding: padding,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.light
                }
              }}
            >
              <WrapperIcons 
                Icon={Icon} 
                size={icon}
              />
            </IconButton>
          </Tooltip>
        );
      };
    
    const onNavigateHome = () => {
        if (userModule === Module.Internal) routeDomNavigate('/internal/home')
        else if (userModule === Module.Offerer) routeDomNavigate('/offerer/home')
    }
    
    return (
        <Stack sx={{ width: 1 }}>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                <LogoAndLeftsideAppBarItems
                    isLoggedIn={isLoggedIn}
                    isLargeScreen={isLargeScreen}
                    isMediumScreen={isMediumScreen}
                    isMediumLargeScreen={isMediumLargeScreen}
                    userModule={userModule}
                />
                
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                {
                    isLoggedIn &&
                        <Stack direction={'row'} alignItems={'center'} spacing={4}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                {!isExtraExtraSmallScreen && isScreenSmallerThanCompanyButtonsThreshold ? (
                                    <>
                                        <SafetyComponent
                                            componentName={SecurityComponents.GeneralConfiguration}
                                            objectName={GeneralConfigurationSecObjects.SolicitationShoppingBagButton}
                                        >
                                            <IconButtonResponsive
                                                id={ButtonIdMySelection}
                                                icon={Folders} 
                                                onClick={onViewChart} 
                                                title="Mi Selección" 
                                            />
                                        </SafetyComponent>

                                        <IconButtonResponsive
                                            id={ButtonIdMySolicitations}
                                            icon={Files} 
                                            onClick={onViewSolicitations} 
                                            title="Mis Solicitudes" 
                                        />

                                        <SafetyComponent
                                            componentName={SecurityComponents.GeneralConfiguration}
                                            objectName={GeneralConfigurationSecObjects.MyCompaniesButton}
                                        >
                                            <IconButtonResponsive
                                                id={ButtonIdMyCompanies}
                                                icon={BuildingOffice} 
                                                onClick={() => routeDomNavigate('/mi-cuenta')} 
                                                title="Mis Empresas" 
                                            />
                                        </SafetyComponent>
                                        <SafetyComponent
                                            componentName={SecurityComponents.AppRoutes}
                                            objectName={AppRouteSecObjects.InternalPymeUserListRoute}
                                        >
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="secondary"
                                                startIcon={<WrapperIcons Icon={FactoryIcon} />}
                                                onClick={() => routeDomNavigate('/internal/companies')}
                                                sx={{whiteSpace: 'nowrap'}}
                                            >
                                                Usuarios PyME
                                            </Button>
                                        </SafetyComponent>
                                    </>
                                ) : !isExtraExtraSmallScreen && (
                                    <>
                                        <SafetyComponent
                                            componentName={SecurityComponents.GeneralConfiguration}
                                            objectName={GeneralConfigurationSecObjects.SolicitationShoppingBagButton}
                                        >
                                            <Tooltip title={'Mi Selección'}>
                                                <Button
                                                    id={ButtonIdMySelection}
                                                    variant="outlined"
                                                    size="small"
                                                    color="secondary"
                                                    startIcon={<WrapperIcons Icon={Folders} />}
                                                    onClick={onViewChart}
                                                    sx={{whiteSpace: 'nowrap'}}
                                                >
                                                    Selección
                                                </Button>
                                            </Tooltip>
                                        </SafetyComponent>

                                        {
                                            (isLoggedIn && (userModule === Module.Internal || userModule === Module.Offerer)) &&
                                            <Tooltip title={'Ir al inicio'}>
                                                <Button
                                                    id={ButtonIdMySolicitations}
                                                    variant="outlined"
                                                    size="small"
                                                    color="secondary"
                                                    startIcon={<WrapperIcons Icon={House} />}
                                                    onClick={onNavigateHome}
                                                    sx={{whiteSpace: 'nowrap'}}
                                                >
                                                    Mi LUC
                                                </Button>
                                            </Tooltip>
                                        }

                                        <SafetyComponent
                                            componentName={SecurityComponents.AppRoutes}
                                            objectName={AppRouteSecObjects.InternalPymeUserListRoute}
                                        >
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="secondary"
                                                startIcon={<WrapperIcons Icon={FactoryOutlined} />}
                                                onClick={() => routeDomNavigate('/internal/companies')}
                                                sx={{whiteSpace: 'nowrap'}}
                                            >
                                                Usuarios PyME
                                            </Button>
                                        </SafetyComponent>

                                        <Tooltip title={'Mis Solicitudes'}>
                                            <Badge
                                                badgeContent={solicitationsQty !== 0 ?
                                                    <WrapperIcons
                                                        className={'bell-ringing-shake'}
                                                        Icon={BellRinging}
                                                        size={'sm'}
                                                        color={'error'}
                                                    /> : null
                                                }
                                                color={'default'}
                                                sx={{
                                                    '& .MuiBadge-badge': {
                                                        right: 2,
                                                        top: 33,
                                                        padding: '0 4px',
                                                    },
                                                }}
                                            >
                                                <Button
                                                    id={ButtonIdMySolicitations}
                                                    variant="outlined"
                                                    size="small"
                                                    color="secondary"
                                                    startIcon={<WrapperIcons Icon={Files} />}
                                                    onClick={onViewSolicitations}
                                                    sx={{whiteSpace: 'nowrap'}}
                                                >
                                                    Solicitudes
                                                </Button>
                                            </Badge>
                                        </Tooltip>


                                        <SafetyComponent
                                            componentName={SecurityComponents.GeneralConfiguration}
                                            objectName={GeneralConfigurationSecObjects.MyCompaniesButton}
                                        >
                                            <Button
                                                id={ButtonIdMyCompanies}
                                                variant="outlined"
                                                size="small"
                                                color="secondary"
                                                startIcon={<WrapperIcons Icon={BuildingOffice} />}
                                                onClick={() => routeDomNavigate('/mi-cuenta')}
                                                sx={{whiteSpace: 'nowrap'}}
                                            >
                                                Mis Empresas
                                            </Button>
                                        </SafetyComponent>
                                    </>
                                )}

                                {!isExtraLargeScreen && (
                                    <>
                                          <NotificationsIconButton
                                            id={ButtonIdNotifications}
                                            onClick={onViewNotifications}
                                            tooltipTitle={'Ver notificaciones'}
                                            size="medium"
                                            color="secondary"
                                        />
                                    </>
                                )}
                            </Stack>
                            
                            <ShoppingBagPopup
                                open={buttonPopup}
                                setOpen={setButtonPopup}
                                callFromCard={false}
                                onReloadCompanies={getCompanies}
                            />

                            <MustHaveRelatedCompanyDialog
                                open={showConfirmCreateCompany}
                                onClose={onCancelCreateCompany}
                            />
                        </Stack>
                }

                    {isLoggedIn && (
                        <Box display="flex" justifyContent="flex-end" gap={isSmallScreen ? 2 : 4} alignItems="flex-end">
                                <UserAvatarWithMenuNew
                                    additionalMenuItems={
                                        isMediumLargeScreen ? (
                                            <React.Fragment>
                                                <SafetyComponent
                                                    componentName={SecurityComponents.SideBarMenuItems}
                                                    objectName={SideBarMenuItemsSecObjects.LinkCompanyRepository}
                                                >
                                                    <MenuItem disableRipple>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <WrapperIcons Icon={BuildingOffice} />
                                                            <Box id={ButtonIdMyCompanies} onClick={() => routeDomNavigate("/mi-cuenta")}>
                                                                <Typography>Mis Empresas</Typography>
                                                            </Box>
                                                        </Stack>
                                                    </MenuItem>
                                                </SafetyComponent>                   
                                            </React.Fragment>
                                        ) : undefined
                                    }
                                    menuItemsAsData={isExtraLargeScreen ? userAvatarMenuItems : undefined}
                                />
                        </Box>
                    )}


                    {!isLoggedIn && (
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <Button id={ButtonIdSignUp} variant={'contained'} color={'primary'} size={'small'}
                                    onClick={() => routeDomNavigate('/signup')}
                            >
                                Crear Usuario
                            </Button>

                            {
                                !isMediumScreen &&
                                <Stack direction='row' alignItems='center' spacing={2}>
                                    <Button variant={'outlined'} color={'secondary'} size={'small'}
                                            onClick={onNavigateMarketLanding}
                                    >
                                        Explorar Tienda LUC
                                    </Button>

                                    <IconButton id={ButtonIdLogin} onClick={() => routeDomNavigate('/login')}>
                                        <WrapperIcons Icon={User} size={'sm'} color={'#000000'} />
                                    </IconButton>
                                </Stack>
                            }
                        </Stack>
                    )}
                    {!isLoggedIn && !!drawerProcess && (
                        <LogInDrawer
                            formPart={drawerProcess}
                            title={'Ingresar'}
                            open
                            onClose={() => setDrawerProcess(undefined)}
                            onLogin={onLogIn}
                            allowsRegistration
                            fnAuthenticateUser={async (credentials) => {
                                const { HttpAuth } = await import('../../http/index');
                                return HttpAuth.authenticateUser(credentials);
                            }}
                        />
                    )}
                    <FailRedirectMarketDialog
                        open={failRedirect}
                        onClose={() => setFailRedirect(false)}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
}

interface MenuHomeMarketProps {
    links: MenuLink[];
    bottomToolbar?: boolean;
    hideLogo?: boolean
}

function MenuHomeMarket({ hideLogo }: MenuHomeMarketProps) {
    const classes = MenuHomeStyles();
    const routeDomNavigate = useNavigate();
    const { navigate } = useAppNavigation();
    const { isLoggedIn } = useUser();
    
    const topToolBar = TopToolbarNew({ hideLogo: hideLogo });
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
    const [drawerProcess, setDrawerProcess] = useState<LogInProcessParts | undefined>(undefined);
    
    const theme = useTheme();
    const zIndexAppBarBase = theme.zIndex.appBar;
    const zIndexBackdrop = theme.zIndex.drawer + 1;
    const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down(420));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMediumLargeScreen = useMediaQuery(theme.breakpoints.down(1440));

    const inMarket =
        (window.location.toString().includes('/market/landing') || window.location.toString().includes('/market/lines'))
        && !window.location.toString().includes('/market/lines/carrito');
    
    const showBurgerMenu = useMemo(() => {
        return (!isLoggedIn && isMediumLargeScreen) || (isLoggedIn && isMediumScreen);
    }, [isLoggedIn, isMediumScreen, isMediumLargeScreen]);
    
    const IconBurgerMenu = useMemo(() => openMobileMenu ? X : List, [openMobileMenu])

    const onClickLogIn = () => {
        setOpenMobileMenu(false);
        setDrawerProcess(LogInProcessParts.Login);
    };
    
    const onNavigateMarketLanding = () => navigate(AppRoutesDefinitions.MarketLanding);
    
    const onNavigateHelp = () => navigate(AppRoutesDefinitions.LucContactPage);
    
    return (
        <React.Fragment>
            <AppBar
                position={'fixed'}
                className={clsx(classes.appBar, {
                    [classes.appBarBlur]: !openMobileMenu,
                    [classes.appBarActive]: openMobileMenu,
                })}
                sx={{ 
                    paddingY: '18px !important',
                    height: (isMediumLargeScreen && openMobileMenu) ? 'auto' : '74px !important',
                    zIndex: openMobileMenu ? zIndexBackdrop + 1 : zIndexAppBarBase,
                    
                    paddingX: {
                        xs: '16px !important',
                        sm: '16px !important',
                        md: '32px !important',
                        lg: '64px !important',
                        xl: '96px !important',
                    }
                }}
            >
                <Stack sx={{ width: 1 }}>
                    <Stack direction={'row'}
                           alignItems={'center'}
                           spacing={2}
                           sx={{ width: 1}}>
                        {topToolBar}

                        {
                            showBurgerMenu &&
                                <Box textAlign={'center'}
                                     sx={{ height: themeIconsSizeDefinition.md, '&:hover': { cursor: 'pointer' }}}
                                     onClick={() => setOpenMobileMenu(!openMobileMenu)}
                                >
                                    <WrapperIcons Icon={IconBurgerMenu} size={'md'} color={'black'}/>
                                </Box>
                        }
                    </Stack>

                    {
                        showBurgerMenu &&
                            <Collapse in={openMobileMenu}>
                                <Stack spacing={1}
                                       sx={{ paddingX: '16px', paddingTop: '16px' }}
                                >
                                    <Divider />
                                                                    
                                    <BurgerMenuOptions inMarket={inMarket}
                                                       onCloseMenu={() => setOpenMobileMenu(false)}
                                    >
                                        {
                                            (!isLoggedIn && isMediumScreen) &&
                                                <Stack spacing={1.2}>
                                                    <Button id={ButtonIdLogin} color={'secondary'} variant={'contained'} size={'small'}
                                                            startIcon={<User />}
                                                            onClick={() => routeDomNavigate('/login')}
                                                            fullWidth
                                                    >
                                                        Ingresar
                                                    </Button>
                                                </Stack>
                                        }
                                    </BurgerMenuOptions>
                                </Stack>
                            </Collapse>
                    }
                </Stack>
            </AppBar>

            <Backdrop open={openMobileMenu}
                      sx={{ zIndex: zIndexBackdrop, backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
                      onClick={() => setOpenMobileMenu(false)}
            />

            <LogInDrawer formPart={drawerProcess} 
                         title={'Ingresar'} 
                         open={!!drawerProcess} 
                         onClose={() => setDrawerProcess(undefined)} 
                         /*onLogin={onLogIn}*/ 
                         allowsRegistration 
                         fnAuthenticateUser={async (credentials) => {
                             const { HttpAuth } = await import('../../http/index');
                             return HttpAuth.authenticateUser(credentials);
                         }}
            />
        </React.Fragment>
    );
}

export default MenuHomeMarket;

