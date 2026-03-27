import React, {ReactNode, useMemo, useState} from 'react';
import {AppBar, Backdrop, Box, Button, Collapse, Divider, IconButton, Stack, useMediaQuery} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {LogoAppBar} from '../menu/components/LogoAppBar';
import {useAppNavigation} from "../../hooks/navigation";
import AppBarBaseStyles from "./AppBarBase.styles";
import clsx from "clsx";
import {BellRingIcon, MenuIcon, UserRoundIcon, XIcon} from "lucide-react";
import {useUser} from "../../hooks/contexts/UserContext";
import {themeIconsSizeDefinition} from "../../util/themes/definitions";
import {WrapperIcons} from "../icons/Icons";
import UserAvatarWithMenuNew from "../../layouts/home/components/UserAvatarWithMenuNew";
import {NotificationsIconButton} from "../buttons/Buttons";
import {Module} from "../../types/form/login/login-enum";
import {PymeRoute} from "../../routes/pyme/routeAppPymeData";
import {OffererRoute} from "../../routes/offerer/routeAppOffererData";
import {InternalRoute} from "../../routes/internal/routeAppInternalData";
import {GuestRoute} from 'routes/guest/routeAppGuestData';
import {TypographyBase} from "../misc/TypographyBase";
import UsefulInformationButton, {
    UsefulInformationButtonVariant
} from "../../layouts/home/components/UsefulInformationButton";

interface AppbarBaseOLDProps {
  rightContent?: ReactNode;
  leftContent?: ReactNode;
  customContent?: ReactNode;
  hideLogo?: boolean;
  className?: string;
  sx?: any;
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  elevation?: number;
}

export const AppbarBaseOLD = ({
  rightContent,
  leftContent,
  customContent,
  hideLogo = false,
  className,
  sx,
  position = 'fixed',
  elevation = 0,
}: AppbarBaseOLDProps) => {
  const theme = useTheme();
  const isMediumLargeScreen = useMediaQuery(theme.breakpoints.down(1440));

  if (customContent) {
    return (
      <AppBar
        position={position}
        elevation={elevation}
        className={className}
        sx={{
          paddingY: '18px !important',
          height: '74px !important',
          backgroundColor: 'white',
          paddingX: {
            xs: '16px !important',
            sm: '16px !important',
            md: '32px !important',
            lg: '64px !important',
            xl: '96px !important',
          },
          ...sx,
        }}
      >
        {customContent}
      </AppBar>
    );
  }

  const hasAdditionalContent = !!leftContent || !!rightContent;
  const logoPosition = hasAdditionalContent ? 'flex-start' : 'center';

  return (
    <AppBar
      position={position}
      elevation={elevation}
      className={className}
      sx={{
        paddingY: '18px !important',
        height: '74px !important',
        backgroundColor: 'white',
        paddingX: {
          xs: '16px !important',
          sm: '16px !important',
          md: '32px !important',
          lg: '64px !important',
          xl: '96px !important',
        },
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: 1, height: 1 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={leftContent ? 6 : 0}
          sx={{
            justifyContent: logoPosition,
            flexGrow: hasAdditionalContent ? 0 : 1,
          }}
        >
          {leftContent}
          {!hideLogo && <LogoAppBar isMediumLargeScreen={isMediumLargeScreen} />}
        </Stack>

        {rightContent && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {rightContent}
          </Box>
        )}
      </Stack>
    </AppBar>
  );
};

const ButtonIdLogin: string = "btn-login";
const ButtonIdSignUp: string = "btn-registrate";
const ButtonIdNotifications: string = "btn-notificaciones";


interface AppBarBaseSectionProps {
    children: ReactNode;
}

const LeftSection = ({ children }: AppBarBaseSectionProps) => <>{children}</>;

const RightSection = ({ children }: AppBarBaseSectionProps) => <>{children}</>;

const BottomSection = ({ children }: AppBarBaseSectionProps) => <>{children}</>;

type AppBarChild = React.ReactElement & { type: any };

interface AppBarBaseProps {
    showUserAvatar?: boolean,
    showCreateUser?: boolean,
    showLoginUser?: boolean,
    showNotifications?: boolean,
    showUsefulInformation?: boolean,
    hideLogo?: boolean,
    children?: ReactNode,
    title?: string,
    fitBottom?: boolean,
    logoSuffix?: ReactNode,
}


export function AppBarBase({
    showUserAvatar, showCreateUser, showLoginUser, showNotifications, showUsefulInformation, hideLogo = false, children, title, fitBottom, logoSuffix
}: AppBarBaseProps) {
    const classes = AppBarBaseStyles();
    
    const theme = useTheme();
    const zIndexAppBarBase = theme.zIndex.appBar;
    const zIndexBackdrop = theme.zIndex.drawer + 1;

    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMediumLargeScreen = useMediaQuery(theme.breakpoints.down(1440));
    
    const { navigate } = useAppNavigation();
    const { user, isLoggedIn } = useUser();

    const userModule = useMemo(() => user?.userType, [user]);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const leftContent : React.ReactElement | undefined = useMemo(() => {
        return React.Children.toArray(children).find(
            (child: any) => child.type === LeftSection
        ) as React.ReactElement | undefined;
    }, [children])

    const rightContent = React.Children.toArray(children).find(
        (child: any) => child.type === RightSection
    ) as React.ReactElement | undefined;

    const bottomContent = React.Children.toArray(children).find(
        (child: any) => child.type === BottomSection
    ) as React.ReactElement | undefined;

    const hasAnyData = useMemo(() => (
        !!leftContent || !!rightContent || !!showUserAvatar || !!showCreateUser || !!showLoginUser || !!showNotifications || !!showUsefulInformation
    ), [leftContent, rightContent, showUserAvatar, showCreateUser, showLoginUser, showNotifications, showUsefulInformation]);

    const showBurgerMenu = useMemo(() => {
        return ((!isLoggedIn && isMediumScreen) || (isLoggedIn && isMediumScreen)) && hasAnyData;
    }, [isLoggedIn, isMediumScreen, hasAnyData]);
    const IconBurgerMenu = useMemo(() =>
            openMobileMenu ? XIcon : MenuIcon
        , [openMobileMenu]);

    const onViewNotifications = () => {
        switch (userModule) {
            case Module.Company:
                navigate(PymeRoute.PymeNotifications);
                return;
            case Module.Offerer:
                navigate(OffererRoute.OffererNotifications);
                return;
            case Module.Internal:
                navigate(InternalRoute.InternalNotifications);
                return;
        }
    }
    
    const onHandleClickSignUp = () => navigate(GuestRoute.SignUp);
    
    const onHandleClickLogin = () => navigate(GuestRoute.Login);
    
    return (
        <React.Fragment>
            <AppBar position={'fixed'}
                    className={clsx(classes.appBar, {
                        [classes.appBarBlur]: !openMobileMenu,
                        [classes.appBarActive]: openMobileMenu,
                    })}
                    sx={{
                        paddingTop: '18px !important',
                        paddingBottom: `${fitBottom && !openMobileMenu ? 0 : 18}px !important`,
                        height: ((isMediumLargeScreen && openMobileMenu) || !!bottomContent) ? 'auto' : '74px !important',
                        zIndex: openMobileMenu ? zIndexBackdrop + 1 : zIndexAppBarBase,
                        paddingX: {
                            xs: '16px !important',
                            sm: '16px !important',
                            md: '32px !important',
                            lg: '64px !important',
                            xl: '96px !important',
                        },
                    }}
            >
                <Stack width={1}>
                    <Stack direction={'row'}
                           justifyContent={'space-between'}
                           alignItems={'center'}>

                        <Stack spacing={5} direction={'row'} alignItems={'center'}
                               sx={{
                                   flexGrow: 1,
                                   minWidth: 0,
                                   flexWrap: 'nowrap',
                                   ...(!hasAnyData ? { width: '100%', justifyContent: 'center' } : {})
                               }}
                        >
                            {
                                !hideLogo &&
                                    <Stack direction={'row'} alignItems={'center'} spacing={1.75} sx={{ flexShrink: 0 }}>
                                        <LogoAppBar isMediumLargeScreen={isMediumLargeScreen} />
                                        {!!logoSuffix && (
                                            <>
                                                <Divider orientation={'vertical'} 
                                                         flexItem sx={{ height: '-webkit-fill-available', alignSelf: 'center' }}
                                                />
                                                
                                                {logoSuffix}
                                            </>
                                        )}
                                    </Stack>
                            }

                            {
                                (!!leftContent && !isMediumScreen) ?
                                    <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ flexShrink: 1, minWidth: 0 }}>
                                        {leftContent}
                                    </Stack>
                                    :
                                    <Box />
                            }

                            {
                                !!title &&
                                    <TypographyBase variant={'h5'} tooltip maxLines={2}>
                                        {title}
                                    </TypographyBase>
                            }
                        </Stack>

                        <Stack spacing={2} direction={'row'} alignItems={'center'}>
                            {
                                (showCreateUser && !isLoggedIn) &&
                                <Button id={ButtonIdSignUp} variant={'contained'} color={'primary'} size={'small'}
                                        onClick={onHandleClickSignUp}
                                >
                                    Crear Usuario
                                </Button>
                            }
                            
                            {
                                (!!rightContent && !isMediumScreen) ?
                                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                        {rightContent}
                                    </Stack>
                                    :
                                    <Box />
                            }

                            {
                                (showUsefulInformation && !isMediumScreen) &&
                                    <UsefulInformationButton variant={UsefulInformationButtonVariant.IconButton} />
                            }
                            
                            {
                                (showNotifications && isLoggedIn && !isMediumScreen) &&
                                    <NotificationsIconButton
                                        id={ButtonIdNotifications}
                                        onClick={onViewNotifications}
                                        tooltipTitle={'Ver notificaciones'}
                                        size="medium"
                                        color="secondary"
                                    />
                            }
                            
                            {
                                (showUserAvatar && isLoggedIn && !isMediumScreen) &&
                                    <UserAvatarWithMenuNew />
                            }
                            
                            {
                                (showLoginUser && !isLoggedIn && !isMediumScreen) &&
                                    <IconButton id={ButtonIdLogin} onClick={onHandleClickLogin}>
                                        <WrapperIcons Icon={UserRoundIcon} size={'sm'} color={'#000000'} />
                                    </IconButton>
                            }

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
                    </Stack>

                    {
                        !!bottomContent &&
                            <Stack mt={1}>
                                {bottomContent}
                            </Stack>
                    }
                    
                    {
                        showBurgerMenu &&
                        <Collapse in={openMobileMenu} sx={{ 
                            height: openMobileMenu ? 'auto' : '0px !important', 
                            overflowY: openMobileMenu ? 'auto' : 'none' 
                        }}>
                            <Stack spacing={1}
                                   sx={{ paddingX: '16px', paddingTop: '16px', '& > *': { width: '100% !important' } }}
                                   onClick={(e) => {
                                       e.stopPropagation();
                                       setOpenMobileMenu(false);
                                   }}
                            >
                                <Divider />

                                {!!leftContent && leftContent}

                                {!!rightContent && rightContent}

                                {
                                    (showUserAvatar && isLoggedIn) &&
                                        <Button variant={'appbar'}
                                                startIcon={<BellRingIcon />}
                                                id={ButtonIdNotifications}
                                                onClick={onViewNotifications}
                                                size={'small'}
                                        >
                                            Notificaciones
                                        </Button>
                                }

                                {
                                    (showUsefulInformation) &&
                                        <React.Fragment>
                                            <Divider />
    
                                            <UsefulInformationButton variant={UsefulInformationButtonVariant.MenuOnly} />
                                        </React.Fragment>
                                }

                                {
                                    (showLoginUser && !isLoggedIn) &&
                                        <Button id={ButtonIdLogin} color={'secondary'} variant={'contained'} size={'small'}
                                                startIcon={<UserRoundIcon />}
                                                onClick={onHandleClickLogin}
                                        >
                                            Ingresar
                                        </Button>
                                }

                                {
                                    (showUserAvatar && isLoggedIn) &&
                                        <React.Fragment>
                                            <Divider />
                                            
                                            <UserAvatarWithMenuNew onlyOptionsMenu />
                                        </React.Fragment>
                                }
                            </Stack>
                        </Collapse>
                    }
                </Stack>
            </AppBar>

            <Backdrop open={openMobileMenu}
                      sx={{ zIndex: zIndexBackdrop, backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
                      onClick={() => setOpenMobileMenu(false)}
            />
        </React.Fragment>
    )
}


AppBarBase.Left = LeftSection;
AppBarBase.Right = RightSection;
AppBarBase.Bottom = BottomSection;
