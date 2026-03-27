import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import {Container} from '@mui/material';
import ScrollTop from './ScrollTop';
import AppBarScroll from './AppBarScroll';
import SideBarMenu from './SideBarMenu';
import clsx from 'clsx';
import LayoutHomeStyles from './LayoutHome.styles';
import { MenuCode, MenuLayoutType } from 'types/menu/menuLink';
import AppBarFixed from './AppBarFixed';
import { userStorage } from '../../util/localStorage/userStorage';
import { useAction } from '../../hooks/useAction';
import { DialogAlert } from '../../components/dialog';
import { HttpCompany } from '../../http';

export interface LayoutHomeProps {
  children?: React.ReactNode;
  layoutType?: MenuLayoutType;
  setAvatar?: boolean;
  // TODO: preventivo hasta cambiar AppBar en toda la plataforma
  hideAppbar?: boolean,
  // TODO: preventivo hasta sacar menu lateral en toda la plataforma
  hideSidebar?: boolean
}

export const LayoutHomeContext = React.createContext({
  sideBarOpen: false,
  setSideBarOpen: (open: boolean) => {},
  mediumWindow: false,
  menuActive: MenuCode.Home as MenuCode,
  setMenuActive: (menu: MenuCode) => {},
  companyId: 0,
  setShouldWarnBeforeSwitch: (value: boolean) => {},
  shouldWarnBeforeSwitch: false,

  onDialogConfirm: () => {},
  setOnDialogConfirm: (func: () => void) => {},
  setShowConfirmDialog: (value: boolean) => {},
});

function LayoutHome({ children, ...props }: LayoutHomeProps) {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const companyId: number = parseInt(params.companyId ?? '');
  const { setCompany, setFnLoadAvatar } = useAction();
   useEffect(() => {
    if (companyId) {
      setCompany(companyId);
    }
  }, [companyId, setCompany]);

  const classes = LayoutHomeStyles();

  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const [mediumWindow, setMediumWindow] = useState<boolean>(false);
  const [menuActive, setMenuActive] = useState<MenuCode>(MenuCode.Home);

  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [shouldWarnBeforeSwitch, setShouldWarnBeforeSwitch] =
    useState<boolean>(false);
  const [onDialogConfirm, setOnDialogConfirm] = useState<any>(
    () => () => console.log('default'),
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 990) {
        setMediumWindow(true);
      } else {
        setMediumWindow(false);
        setSideBarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (userStorage.isLackConfirmation()) {
      const userMail = userStorage.getUserMail();
      if (location.pathname === '/') userStorage.removeFromStorage();
      else if (userMail) navigate(`/signup/confirmation?mail=${userMail}`);
      else {
        userStorage.removeFromStorage();
        navigate('/');
      }
    }
  }, []);

  useEffect(() => {
    if (!!props.setAvatar && !!companyId)
      setFnLoadAvatar(
        () => HttpCompany.getCompanyLogo(companyId),
        (logo: File) => HttpCompany.updateCompanyLogo(companyId, logo),
      );
    else setFnLoadAvatar(undefined);
  }, [props.setAvatar, companyId]);
  
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      if (shouldWarnBeforeSwitch) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldWarnBeforeSwitch]);
  
  return (
    <LayoutHomeContext.Provider
      value={{
        sideBarOpen,
        mediumWindow,
        setSideBarOpen,
        menuActive,
        setMenuActive,
        companyId,
        shouldWarnBeforeSwitch,
        setShouldWarnBeforeSwitch,
        onDialogConfirm,
        setOnDialogConfirm,
        setShowConfirmDialog,
      }}
    >
      {
        !props.hideAppbar &&
          <AppBarScroll layoutType={props?.layoutType || MenuLayoutType.Home} />
      }

      {(!mediumWindow && !props.hideSidebar) && (
        <SideBarMenu layoutType={props?.layoutType || MenuLayoutType.Home} />
      )}

      <Container
        className={clsx(classes.containerBase, {
          [classes.container]: !mediumWindow && !props.setAvatar && !props.layoutType && !props.hideSidebar,
          [classes.containerPerson]: !mediumWindow && (props.setAvatar || props.layoutType) && !props.hideSidebar,
          [classes.containerPaddingBottom]: true
        })}
      >
        {
          !props.hideAppbar &&
            <AppBarFixed layoutType={props?.layoutType || MenuLayoutType.Home} />
        }

        {children}

        <Outlet />
      </Container>

      <ScrollTop />
      <DialogAlert
        open={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setShouldWarnBeforeSwitch(false);
        }}
        onConfirm={() => {
          setShowConfirmDialog(false);
          setShouldWarnBeforeSwitch(false);
          onDialogConfirm();
        }}
        textContent={`¿Estás seguro que deseás cambiar de pestaña? Los cambios no guardados se perderán.`}
      />
    </LayoutHomeContext.Provider>
  );
}

export default LayoutHome;
