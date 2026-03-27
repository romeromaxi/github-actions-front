import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoggerService, LogLevels } from 'http/logger/httpLogger';
import useSecurityObject from 'hooks/useSecurityObject';
import { LoaderBlockUI } from 'components/loader';
import { userStorage } from '../../util/localStorage/userStorage';

interface SafetyRouteMiddlewareProps {
  componentName: string;
  objectName: string;
  children: React.ReactElement;
}

const handleUnauthorizedAccessAttempt = (): void => {
  const path = window.location.pathname;

  LoggerService.log({
    level: LogLevels.Warning,
    detail: 'Intento de acceso no autorizado en: ' + path,
  });
};

function SafetyRouteMiddleware(props: SafetyRouteMiddlewareProps) {
  const location = useLocation();
  const {
    hasReadPermission,
    isLoadingPermissions,
  } = useSecurityObject();
  
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    setIsAuthChecked(false);
    const timer = setTimeout(() => {setIsAuthChecked(true);}, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  const isAuthenticated = userStorage.getUserType() !== undefined && userStorage.getProfileId() !== undefined;

  if (isLoadingPermissions || !isAuthChecked) {
    return <LoaderBlockUI />;
  }

  if (!isAuthenticated) {
    handleUnauthorizedAccessAttempt();
    return <Navigate to="/market/landing" state={{ from: location }} replace />;
  }

  const readPermission: boolean = hasReadPermission(props.componentName, props.objectName);

  if (!readPermission) {
    handleUnauthorizedAccessAttempt();
    return <Navigate to="/market/landing" state={{ from: location }} replace />;
  }

  return props.children;
}

export default SafetyRouteMiddleware;