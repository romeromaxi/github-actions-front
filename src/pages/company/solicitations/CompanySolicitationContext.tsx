import React, {useEffect, useMemo, useState} from 'react';
import {Outlet, useOutletContext, useParams} from 'react-router-dom';
import {SolicitationFlags, SolicitationViewDTO, SolicitationViewDTOFields} from 'types/solicitations/solicitationData';
import {HttpCompany, HttpSolicitation} from 'http/index';
import {HttpOffererLogo} from "http/offerer/httpOffererLogo";
import {FileBlobResponseFields} from "types/files/filesData";
import {stringFormatter} from "util/formatters/stringFormatter";
import {EntityWithIdFields} from "types/baseEntities";

type CompanySolicitationContextType = {
  solicitationId: number | undefined;
  solicitation: SolicitationViewDTO | undefined;
  setSolicitation: (arg: SolicitationViewDTO) => {};
  loadingSolicitation: boolean;
  flags: SolicitationFlags | undefined;
  loadSolicitation: (id: number) => {};
  reloadAlertCode: () => {};
  alertCode: number | undefined;
  urlCompanyLogo: string;
  urlOffererLogo: string;
};

function CompanySolicitationContext() {
  const params = useParams();
  const [loadingSolicitation, setLoadingSolicitation] = useState<boolean>(false);
  const [solicitation, setSolicitation] = useState<SolicitationViewDTO>();
  const [urlCompanyLogo, setUrlCompanyLogo] = useState<string>();
  const [urlOffererLogo, setUrlOffererLogo] = useState<string>();
  const [flags, setFlags] = useState<SolicitationFlags>();
  const [alertCode, setAlertCode] = useState<number>();
  const solicitationId: number | undefined = useMemo(() => (
      !!params.solicitationId ? parseInt(params.solicitationId) : undefined
  ), [params.solicitationId]);

  const loadCompanyLogo = (currentSolicitation: SolicitationViewDTO) => {
      HttpCompany.getCompanyLogo(currentSolicitation[SolicitationViewDTOFields.CompanyId])
          .then(logoResponse => {
              const image = logoResponse[FileBlobResponseFields.File];
              setUrlCompanyLogo(image.size ? URL.createObjectURL(image) : undefined);
          });
  }
  
  const loadOffererLogo = (currentSolicitation: SolicitationViewDTO) => {
      if (currentSolicitation[SolicitationViewDTOFields.OffererUrlLogo])
          setUrlOffererLogo(stringFormatter.normalizeUrl(currentSolicitation[SolicitationViewDTOFields.OffererUrlLogo]))
      else 
          HttpOffererLogo.getByOffererId(currentSolicitation[SolicitationViewDTOFields.OffererId])
              .then(logoResponse => {
                  const image = logoResponse[FileBlobResponseFields.File];
                  setUrlOffererLogo(image.size ? URL.createObjectURL(image) : undefined);
              });         
  }
  
  
  const loadSolicitation = (id: number) => {
    setLoadingSolicitation(true);
    if (!!solicitation && solicitation[EntityWithIdFields.Id] !== id) {
        setUrlCompanyLogo(undefined)
        setUrlOffererLogo(undefined)
        setSolicitation(undefined);
        setFlags(undefined);
        setLoadingSolicitation(false);
        setAlertCode(undefined);
    }
    
    Promise.all([
      HttpSolicitation.getById(id),
      HttpSolicitation.getSolicitationFlags(id),
      HttpSolicitation.getAlertById(id)
    ]).then(([solicitationResponse, flagsResponse, alertCodeResponse]) => {
      loadCompanyLogo(solicitationResponse)
      loadOffererLogo(solicitationResponse)
      setSolicitation(solicitationResponse);
      setFlags(flagsResponse);
      setLoadingSolicitation(false);
      setAlertCode(alertCodeResponse[SolicitationViewDTOFields.AlertTypeCode]);
    });
  }
  
  useEffect(() => {
    if (solicitationId && !isNaN(solicitationId))
      loadSolicitation(solicitationId)
  }, [solicitationId]);
  
  const reloadAlertCode = () => 
      HttpSolicitation.getAlertById(solicitationId ?? 0)
          .then(alertCodeResponse => 
              setAlertCode(alertCodeResponse[SolicitationViewDTOFields.AlertTypeCode])
          )
      
  return (
    <Outlet context={{
        solicitationId,
        solicitation, 
        setSolicitation, 
        loadingSolicitation, 
        flags, 
        loadSolicitation, 
        reloadAlertCode, 
        alertCode,
        urlCompanyLogo,
        urlOffererLogo
    }}
    />
  );
}

export default CompanySolicitationContext;
export function useCompanySolicitation() {
  return useOutletContext<CompanySolicitationContextType>();
}
