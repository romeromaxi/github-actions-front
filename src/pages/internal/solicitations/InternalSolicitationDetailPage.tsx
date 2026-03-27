import { useParams } from "react-router-dom";
import { useSolicitation } from "../../../hooks/contexts/SolicitationsContext";
import React, { useEffect, useMemo, useState } from "react";
import { NavsTabVertical } from "../../../components/navs/NavsTab";
import { BureauInformationContextProvider, BureauInformationSourceType } from "../../../hooks/contexts/BureauInformationContext";
import OffererSolicitationTabCompanyFiles from "../../offerer/solicitation/tabs/OffererSolicitationTabCompanyFiles";
import { SolicitationViewDTOFields } from "../../../types/solicitations/solicitationData";
import CompanyBureauInfo from "../../bureau/CompanyBureauInfo";
import CompanyBureauContributions from "../../bureau/Contributions/CompanyBureauContributions";
import OffererSolicitationTabHistoryTimeline from "../../offerer/solicitation/tabs/OffererSolicitationTabHistoryTimeline";
import InternalSolicitationHeader from "./components/InternalSolicitationHeader";
import OffererSolicitationTabGeneral from "../../offerer/solicitation/tabs/OffererSolicitationTabGeneral";
import OffererSolicitationChat from "../../offerer/solicitation/components/OffererSolicitationChat";
import SolicitationRequestedDocumentation, {
    SolicitationRequestedDocumentationVariant
} from "../../solicitations/components/SolicitationRequestedDocumentation";
import {EntityWithIdFields} from "../../../types/baseEntities";
import ScoreTab from "../../bureau/Score/ScoreTab";
import AfipBureauInfoTab from "../../bureau/afip/AfipBureauInfoTab";
import DebtFinancialInfoTab from "../../bureau/BCRA/DebtFinancialInfoTab";
import BouncedChecksTab from "../../bureau/Cheques/BouncedChecksTab";


const InternalSolicitationDetailPage = () => {
    const [companyFileId, setCompanyFileId] = useState<number>();
    const { solicitationId } = useParams()
      const solicitationIdParsed = useMemo(() => 
          solicitationId ? parseInt(solicitationId) : undefined , [solicitationId]);
      const { getSolicitation, solicitation } = useSolicitation();

    useEffect(() => {
        if (solicitationIdParsed && !solicitation)
          getSolicitation(solicitationIdParsed)
      }, [solicitationIdParsed]);

    useEffect(() => {
        if (!companyFileId && solicitation) 
                setCompanyFileId(solicitation[SolicitationViewDTOFields.FileId])
    }, [solicitation]);

    return (
        <BureauInformationContextProvider dataId={companyFileId}
                                          dataSource={BureauInformationSourceType.CompanyFile}
                >
                    <NavsTabVertical tabSize={4}
                         header={
                            <InternalSolicitationHeader />
                         }
                         lstTabs={[
              {
                tabList: [
                  {
                    label: 'Seguimiento',
                    content: <OffererSolicitationTabGeneral/>,
                    queryParam: 'follow',
                    default: true
                  },
                ]
              },
                 {
                     tabList: [
                         {
                             label: 'Chat con la PyME',
                             content: <OffererSolicitationChat chatEmptyDesc={'Este es el inicio del chat con la empresa.'} />,
                             queryParam: 'chat'
                         }
                     ]
                 },
                {
                    tabList: [
                      {
                        label: 'Legajo actualizado',
                        content: <OffererSolicitationTabCompanyFiles/>,
                        queryParam: 'file'
                      }
                    ]
                },
              {
                label: 'Información pública / bureau',
                tabList: 
                    companyFileId ? 
                        [
                    {
                        label: 'Información fiscal',
                        content: <AfipBureauInfoTab />,
                        queryParam: 'afip'
                    },
                    {
                        label: 'Créditos en el sistema financiero',
                        content: <DebtFinancialInfoTab />,
                        queryParam: 'bcra'
                    },
                    {
                        label: 'Cheques',
                        content: <BouncedChecksTab />,
                        queryParam: 'cheques'
                    },
                    {
                        label: 'Aportes previsionales',
                        content: <CompanyBureauInfo dataId={companyFileId}><CompanyBureauContributions /></CompanyBureauInfo>,
                        queryParam: 'aportes',
                        disabled: true,
                        tooltip: 'Próximamente...'
                    },
                    {
                        label: "Score crediticio",
                        content: <ScoreTab />,
                        queryParam: 'score'
                    }
                ]
                        : []
              },
              {
                tabList: [
                  {
                    label: 'Historial de la solicitud',
                    content: <OffererSolicitationTabHistoryTimeline />,
                    queryParam: 'history'
                  }
                ]
              }
            ]}
        >

                        <SolicitationRequestedDocumentation solicitationId={solicitation?.[EntityWithIdFields.Id]}
                                                            solicitation={solicitation}
                                                            variant={SolicitationRequestedDocumentationVariant.RequestAndSend}
                                                            allowRequestNewFile={false}
                        />
                    </NavsTabVertical>
        </BureauInformationContextProvider>
    );
}


export default InternalSolicitationDetailPage;