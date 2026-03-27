import React, { createContext, useContext, useEffect, useState } from 'react';
import { ValidationStatesType } from '../../types/person/personEnums';
import { Module } from '../../types/form/login/login-enum';

export interface User {
    userId?: number;
    firstName?: string;
    fullName?: string;
    mail?: string;
    userType?: Module;
    validationIdentityStatusCode?: ValidationStatesType;
    lackConfirmation?: boolean;
    isFirstLogin?: boolean;
    hasValidatedIdentity?: boolean;
    hasTaxActivity?: boolean;
    cuit?: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  displayName: string;
  offererSlug: string;
  initialsName: string;
  cuit?: string;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setOffererSlug: (slug: string) => Promise<void>;
  isUserContextLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [initialsName, setInitialsName] = useState('');
  const [offererSlug, setOffererSlugState] = useState('');
  const storageRef = React.useRef<any>(null);
  const [isUserContextLoading, setIsUserContextLoading] = useState(true);

  const loadStorage = async () => {
    if (!storageRef.current) {
      storageRef.current = await import('../../util/localStorage/userStorage');
    }
    return storageRef.current;
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '';
  };

  const initialize = async () => {
    setIsUserContextLoading(true);
    try {
      const { userStorage } = await loadStorage();
      const userData = userStorage.get() || null;
      setUser(userData);
      setIsLoggedIn(userStorage.isLogged());
      const name = userStorage.getDisplayName() || "";
      setDisplayName(name);
      setInitialsName(userStorage.getInitialsName() || getInitials(name));
      setOffererSlugState(userStorage.getOffererSlug() || "");
    } finally {
      setIsUserContextLoading(false);
    }
  };

  const refreshUser = async () => {
    setIsUserContextLoading(true);
    try {
      const { userStorage } = await loadStorage();
      const currentUser = userStorage.get();
      setUser(currentUser || null);
      setIsLoggedIn(!!currentUser);
      setOffererSlugState(userStorage.getOffererSlug() || "");
      const name = userStorage.getDisplayName() || "";
      setDisplayName(name);
      setInitialsName(userStorage.getInitialsName() || getInitials(name));
      return currentUser;
    } finally {
      setIsUserContextLoading(false);
    }
  };

  const logout = async () => {
    setIsUserContextLoading(true);
    try {
      const { userStorage } = await loadStorage();
      userStorage.removeFromStorage();
      setUser(null);
      setIsLoggedIn(false);
      setDisplayName('');
      setInitialsName('');
      setOffererSlugState('');
    } finally {
      setIsUserContextLoading(false);
    }
  };

  const setOffererSlug = async (slug: string) => {
    const { userStorage } = await loadStorage();
    userStorage.setOffererSlug(slug);
    setOffererSlugState(slug);
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoggedIn, 
      displayName,
      initialsName,
      offererSlug,
      initialize, 
      logout, 
      refreshUser,
      setOffererSlug,
      isUserContextLoading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};