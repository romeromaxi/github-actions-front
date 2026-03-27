import {useEffect, useMemo} from 'react';
import {createSearchParams, Outlet, useLocation, useNavigate, useParams} from 'react-router-dom';
import { Box, Container, Stack } from '@mui/material';
import MenuHomeMarket from '../components/menu/MenuHomeMarket';
import MarketFooter from './components/MarketFooter';
import MarketStepsHelper from "./components/MarketStepsHelper";
import { AppConfigAppBarFields, AppConfigFields } from "../types/appConfigEntities";
import { useUser } from '../hooks/contexts/UserContext';
import { useProfileActions } from '../hooks/useProfileActions';
import { useTitleActions } from '../hooks/useTitleActions';
import ScrollTop from "./home/ScrollTop";
import clsx from "clsx";
import MenuHomeStyles from "../components/menu/MenuHome.styles";
import {AppbarBaseOLD} from "../components/appbar/AppBarBase";

interface LayoutLoggedUserCompanyFileMarketProps {
    children?: React.ReactNode;
    fullWidth?: boolean;
    bottomToolbar?: boolean;
    breadcrumbsComponent?: JSX.Element;
    hideFooter?: boolean;
    hideAppbar?: boolean;
    hideLogo?: boolean;
    flushWithAppBar?: boolean;
}

const SIMPLE_APPBAR_ROUTES = ['/login', '/signup', '/signup-confirmation', '/reset-password'];

function LayoutLoggedUserCompanyFileMarket({
                                               children,
                                               bottomToolbar,
                                               breadcrumbsComponent,
                                               hideFooter,
                                               hideAppbar,
                                               hideLogo,
                                               flushWithAppBar
                                           }: LayoutLoggedUserCompanyFileMarketProps) {
    const navigate = useNavigate();
    const classes = MenuHomeStyles();
    const params = useParams();
    const companyId: number = parseInt(params.companyId ?? '');
    const { setCompany } = useProfileActions();
    const { setFnLoadAvatar } = useTitleActions();
    const location = useLocation();
    const { user } = useUser();
    const paddingTopContent = useMemo(() => {
        if (hideAppbar) return '5px';

        const appBarHeight = window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Height];

        return `calc(${appBarHeight} ${!flushWithAppBar ? ' + 20px' : ''})`;
    }, [hideAppbar, flushWithAppBar])

    useEffect(() => {
        if (companyId) {
            setCompany(companyId);
        }
    }, [companyId, setCompany]);
    
  useEffect(() => {
    if (user?.lackConfirmation && user.mail) {
      const params = { mail: user.mail };
      navigate({
        pathname: '/signup/confirmation',
        search: `?${createSearchParams(params)}`,
      });
    }
  }, [user, navigate]);

    useEffect(() => {
        setFnLoadAvatar(undefined);
    }, [setFnLoadAvatar]);

    const landingHome = window.location.toString().includes('landing');

    const shouldUseSimpleAppbar = useMemo(() => {
        return SIMPLE_APPBAR_ROUTES.some(route => location.pathname.startsWith(route));
    }, [location.pathname]);

    return (
        <Box sx={{ position: 'relative' }}>
            {breadcrumbsComponent}
            <Container>
                {
                    !hideAppbar &&
                    (
                        shouldUseSimpleAppbar ?
                            <AppbarBaseOLD position="fixed"
                                        elevation={0}
                                        hideLogo={hideLogo}
                                        className={clsx(classes.appBar, {
                                            [classes.appBarBlur]: true,
                                        })}
                            />
                            :
                            <MenuHomeMarket
                                hideLogo={hideLogo}
                                bottomToolbar={bottomToolbar}
                                links={[
                                    {
                                        text: 'Mis cuentas MiPyME',
                                        onClick: () => navigate('/mi-cuenta'),
                                    },
                                    {text: 'Market', onClick: () => navigate('/market/lines')},
                                ]}
                            />
                    )
                }
                <Box pt={paddingTopContent}>
                    {children}
                    <Outlet/>
                </Box>

                {landingHome && (
                    <Stack spacing={2} mb={6}>
                        <MarketStepsHelper/>
                    </Stack>
                )}
            </Container>

            <ScrollTop />

            {!hideFooter && <MarketFooter/>}

        </Box>
    );
}

export default LayoutLoggedUserCompanyFileMarket;