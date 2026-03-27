import React, { createContext, ReactNode, useState, useCallback, useRef, useEffect } from 'react';
import { CompanyFlowView } from '../../types/company/companyFlowData';
import { CompanyViewDTO } from '../../types/company/companyData';
import { EntityWithIdFields } from '../../types/baseEntities';
import { authTokenStorage } from '../../util/localStorage/authTokenStorage';

type CompanyFlowContextType = {
  flowList: CompanyFlowView[];
  setFlowList: (companyData: CompanyFlowView[]) => void;
  historicList: CompanyFlowView[];
  loading: boolean;
  error: boolean;
  reload: () => void; 
  getFlowList: (company: CompanyViewDTO) => Promise<void>;
  getHistoricList: (companyId: number) => Promise<void>;
};

export const CompanyFlowContext = createContext<CompanyFlowContextType>({
  flowList: [],
  setFlowList: async () => {},
  historicList: [],
  loading: false,
  error: false,
  getFlowList: async () => {},
  getHistoricList: async () => {},
  reload: () => {}
});

type ProviderProps = {
  company?: CompanyViewDTO;
  children: ReactNode;
};

const CompanyFlowContextProvider = ({ company, children }: ProviderProps) => {
  const [flowList, setFlowList] = useState<CompanyFlowView[]>([]);
  const [historicList, setHistoricList] = useState<CompanyFlowView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [state, setState] = useState({
    flowList: [] as CompanyFlowView[],
    historicList: [] as CompanyFlowView[],
    loading: false,
    error: false
  });

  useEffect(() => {
    reload();
  }, [authTokenStorage.getAccessToken]);

  const reload = () => {
    let tokenAutorizacion: string | null = authTokenStorage.getAccessToken();

    if (tokenAutorizacion && company) getFlowList(company);
  };

  const companyIdRef = useRef(company?.[EntityWithIdFields.Id]);
  companyIdRef.current = company?.[EntityWithIdFields.Id];

  // Lazy load the HTTP module
  const getHttpClient = useCallback(() => {
    return import('../../http').then(module => module.HttpCompanyFlow);
  }, []);

  const getFlowList = useCallback(async (company: CompanyViewDTO) => {
    setLoading(true);
    try {
      const HttpCompanyFlow = await getHttpClient();
      const response = await HttpCompanyFlow.getList(company[EntityWithIdFields.Id]);
      setFlowList(response.slice(0, 18)); //  slice en vez de splice para evitar mutado
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [getHttpClient]);

  const getHistoricList = useCallback(async (companyId: number) => {
    setLoading(true);
    try {
      const HttpCompanyFlow = await getHttpClient();
      const response = await HttpCompanyFlow.getHistoricList(companyId);
      setHistoricList(response.slice(0, 17));
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [getHttpClient]);

  return (
    <CompanyFlowContext.Provider
      value={{
        flowList,
        setFlowList,
        historicList,
        loading,
        error,
        getFlowList,
        getHistoricList,
        reload
      }}
    >
      {children}
    </CompanyFlowContext.Provider>
  );
};

export default CompanyFlowContextProvider;