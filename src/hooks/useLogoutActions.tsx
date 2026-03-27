import React, {createContext, useContext, useCallback, useState, useMemo} from "react";
import { useLoaderActions } from "./useLoaderActions";

type LogoutAction = () => Promise<void> | void;

interface LogoutActionsContextType {
  addLogoutAction: (action: LogoutAction) => void;
  removeAndExecuteLogoutAction: (action: LogoutAction) => void;
  executeLogoutActions: () => Promise<void[]>;
}

const LogoutActionsContext = createContext<LogoutActionsContextType | undefined>(undefined);

export const LogoutActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showLoader, hideLoader } = useLoaderActions();
  
  const [actions, setActions] = useState<LogoutAction[]>([]);

  const addLogoutAction = useCallback((action: LogoutAction) => {
    setActions((prev) => [...prev, action]);
  }, []);

  const removeAndExecuteLogoutAction = useCallback((action: LogoutAction) => {
    setActions((prev) => prev.filter((a) => {
      if (a === action) {
        a();
        return false;
      }
      return true;
    }));
  }, []);

  const executeLogoutActions = useCallback(async () => {
    showLoader();
    return Promise.all(actions.map(x => x()))
      .finally(() => {
        setActions([]);
        hideLoader();
      });
  }, [actions, showLoader, hideLoader]);

  const contextValue = useMemo(() => ({
    addLogoutAction,
    removeAndExecuteLogoutAction,
    executeLogoutActions
  }), [addLogoutAction, removeAndExecuteLogoutAction, executeLogoutActions]);

  return (
    <LogoutActionsContext.Provider value={contextValue}>
      {children}
    </LogoutActionsContext.Provider>
  );
};

export const useLogoutActions = () => {
  const context = useContext(LogoutActionsContext);
  if (!context) {
    throw new Error("useLogoutActions: no encontro LogoutActionsProvider");
  }
  return context;
};