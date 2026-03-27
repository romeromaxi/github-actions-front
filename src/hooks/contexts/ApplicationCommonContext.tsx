import React, {useContext, useEffect, useState, startTransition, useMemo, useCallback} from "react";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {DialogAlert} from "components/dialog";
import {useAction} from "hooks/useAction";
import {useUser} from "hooks/contexts/UserContext";
import {AppConfigAppBarFields, AppConfigFields} from "../../types/appConfigEntities";

interface ApplicationCommonDialogConfirmProps {
    title?: string;
    textContent?: string;
    textDiscard?: string;
    textConfirm?: string;
    onDiscard?: () => void;
    onConfirm?: () => void
}

interface ApplicationCommonContextType {
    companyId: number,
    paddingTopContent: string,
    getPaddingTopContent: (topContentType: ApplicationCommonTopContentType, hasElementAbove?: boolean) => string,
    setShouldWarnBeforeSwitch: (value: boolean) => void,
    shouldWarnBeforeSwitch: boolean,
    openConfirmDialog: (props: ApplicationCommonDialogConfirmProps) => void
}

export enum ApplicationCommonTopContentType {
    Normal = 'normal',
    FlushWithAppBar = 'flushAppBar',
    AboveAppBar = 'aboveAppBar'
}

export const ApplicationCommonContext = React.createContext<ApplicationCommonContextType>({
  companyId: 0,
  paddingTopContent: window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Height],
    
  getPaddingTopContent: (topContentType: ApplicationCommonTopContentType, hasElementAbove: boolean = false) =>
      window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Height],  

  setShouldWarnBeforeSwitch: (value: boolean) => {},
  shouldWarnBeforeSwitch: false,

  openConfirmDialog: (props: ApplicationCommonDialogConfirmProps) => {}
});

interface ApplicationCommonContextProviderProps {
    children?: React.ReactNode;
}

function ApplicationCommonContextProvider({ children }: ApplicationCommonContextProviderProps) {
    const params = useParams();
    const { isLoggedIn, user, logout } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const companyId: number = parseInt(params.companyId ?? '');
    const { setCompany } = useAction();
    useEffect(() => {
        if (companyId) {
            setCompany(companyId);
        }
    }, [companyId, setCompany]);

    const [shouldWarnBeforeSwitch, setShouldWarnBeforeSwitch] = useState<boolean>(false);
    const [confirmDialogProps, setConfirmDialogProps] = useState<ApplicationCommonDialogConfirmProps & { open: boolean }>({
        open: false
    });
    
    const paddingTopContent = useMemo(() => {
        const appBarHeight = window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Height];

        return `calc(${appBarHeight} + 20px)`;
    }, [])

    const getPaddingTopContent = useCallback((topContentType: ApplicationCommonTopContentType, hasElementAbove: boolean = false) => {
        if (hasElementAbove) return '0px';
        
        const appBarHeight = window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Height];
        
        switch (topContentType) {
            case ApplicationCommonTopContentType.FlushWithAppBar:
                return `calc(${appBarHeight})`;
                
            case ApplicationCommonTopContentType.AboveAppBar:
                return `calc(${appBarHeight} - 14px)`;
                
            case ApplicationCommonTopContentType.Normal:
            default:
                return `calc(${appBarHeight} + 20px)`;
        }
    }, []);
    
    useEffect(() => {
        if (isLoggedIn && user?.lackConfirmation) {
            const userMail = user.mail;

            if (location.pathname === '/') {
                logout().then(() =>
                    startTransition(() => navigate('/'))
                );
            } else if (userMail) {
                startTransition(() => {
                    navigate(`/signup/confirmation?mail=${userMail}`);
                });
            } else {
                logout().then(() =>
                    startTransition(() => navigate('/'))
                );
            }
        }
    }, [isLoggedIn, user, logout]);

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
    
    const openConfirmDialog = (props: ApplicationCommonDialogConfirmProps) => {
        setConfirmDialogProps({
            ...props,
            open: true
        })
    }
    
    const handleDiscardDialog = () => {
        confirmDialogProps.onDiscard && confirmDialogProps.onDiscard();
        setShouldWarnBeforeSwitch(false);
        setConfirmDialogProps({ open: false });
    }
    
    const handleConfirmDialog = () => {
        confirmDialogProps.onConfirm && confirmDialogProps.onConfirm();
        setShouldWarnBeforeSwitch(false);
        setConfirmDialogProps({ open: false });
    }
    
    return (
        <ApplicationCommonContext.Provider value={{
            companyId,
            paddingTopContent,
            getPaddingTopContent,
            shouldWarnBeforeSwitch,
            setShouldWarnBeforeSwitch,
            openConfirmDialog
        }}>
            {children}
            <Outlet/>

            <DialogAlert open={confirmDialogProps.open} 
                         onClose={handleDiscardDialog} 
                         onConfirm={handleConfirmDialog} 
                         title={confirmDialogProps.title || 'Hiciste cambios'}
                         textContent={confirmDialogProps.textContent || `¿Querés guardarlos antes de continuar?`}
                         textClose={confirmDialogProps.textDiscard || 'Descartar'}
                         textConfirm={confirmDialogProps.textConfirm || 'Guardar cambios'}
                         persist
            />
        </ApplicationCommonContext.Provider>
    )
}


export const useApplicationCommon = () => {
    const context = useContext(ApplicationCommonContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default ApplicationCommonContextProvider;