import {useParams, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
    OffererClientPortfolioDetail,
    OffererClientPortfolioDetailFields, OffererClientPortfolioViewFields
} from "../../../types/offerer/clientPortfolioData";
import {
    BureauInformationContextProvider,
    BureauInformationSourceType
} from "../../../hooks/contexts/BureauInformationContext";
import {NavsTabVertical} from "../../../components/navs/NavsTab";
import CompanyBureauInfo from "../../bureau/CompanyBureauInfo";
import BouncedChecksTab from "../../bureau/Cheques/BouncedChecksTab";
import CompanyBureauContributions from "../../bureau/Contributions/CompanyBureauContributions";
import OffererLufeTabWrapper from "../solicitation/components/lufe/components/OffererLufeTabWrapper";
import {Factory, UsersFour} from "@phosphor-icons/react";
import OffererLufePymeData from "../solicitation/components/lufe/OffererLufePymeData";
import OffererLufeAuthorities from "../solicitation/components/lufe/OffererLufeAuthorities";
import {LufeInformationContextProvider} from "../../../hooks/contexts/LufeInformationContext";
import {HttpClientPortfolio} from "../../../http/clientPortfolio/httpClientPortfolio";
import {BalancesContextProvider, BalancesSourceType} from "../../../hooks/contexts/BalancesContext";
import FinancialYearList from "../../company/finance/FinancialYearList";
import {FlowUseContextProvider, FlowUseSourceType} from "../../../hooks/contexts/FlowUseContext";
import FlowPage from "../../company/flow/FlowPage";
import OffererClientPortfolioFiles from "./files/OffererClientPortfolioFiles";
import SolicitationRelatedOffererCompany from "../../solicitations/components/SolicitationRelatedOffererCompany";
import OffererClientPortfolioSummary from "./OffererClientPortfolioSummary";
import OffererClientPortfolioFinancialIndicators from "./financialIndicators/OffererClientPortfolioFinancialIndicators";
import {Alert, Box, Button, Container, Skeleton, Stack} from "@mui/material";
import {RelatedPersonContextProvider, RelatedPersonSourceType} from "../../../hooks/contexts/RelatedPersonContext";
import RelatedPersonTable from "../../company/relatedPeople/RelatedPersonTable";
import {PersonTypes} from "../../../types/person/personEnums";
import RelationshipMapGraph from "../../company/relatedPeople/components/RelationshipMapGraph";
import ScoreTab from "../../bureau/Score/ScoreTab";
import AfipBureauInfoTab from "../../bureau/afip/AfipBureauInfoTab";
import DebtFinancialInfoTab from "../../bureau/BCRA/DebtFinancialInfoTab";
import {AppBarBase} from "../../../components/appbar/AppBarBase";
import {Undo2Icon} from "lucide-react";
import {CompanyLogo} from "../../company/components/CompanyLogo";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import {HttpClientPortfolioExport} from "../../../http/clientPortfolio/httpClientPortfolioExport";
import {downloadFileBlobHelper} from "../../../util/helpers";
import {ButtonExportDropdown} from "../../../components/buttons/ButtonExportDropdown";
import {EntityWithIdFields} from "../../../types/baseEntities";

const OffererClientPortfolioPage = () => {
    const navigate = useNavigate();
    const {clientPortfolioGuid} = useParams()
    const [prospect, setProspect] = useState<OffererClientPortfolioDetail>()
    const [bureauId, setBureauId] = useState<number>()
    const [lufeRequestId, setLufeRequestId] = useState<number>()

    const onClickBackButton = () => navigate(-1);

    const onClickExport = () => {
        if (prospect) {
            HttpClientPortfolioExport.exportToExcel(prospect[EntityWithIdFields.Id]).then(
                downloadFileBlobHelper
            )
        }
    }

    useEffect(() => {
        if (clientPortfolioGuid && !prospect)
            HttpClientPortfolio.getById(clientPortfolioGuid).then(setProspect)
    }, [clientPortfolioGuid]);

    useEffect(() => {
        if (prospect && !bureauId)
            setBureauId(prospect[OffererClientPortfolioDetailFields.BureauLastRequestId])

        if (prospect && !lufeRequestId)
            setLufeRequestId(prospect[OffererClientPortfolioDetailFields.LastLufeRequestId])
    }, [prospect]);

    return (
        <Box sx={{position: 'relative'}}>
            <Container>
                <AppBarBase title="Detalle del Cliente"
                            hideLogo>
                    <AppBarBase.Left>
                        <Button variant={'outlined'}
                                color={'secondary'}
                                size={'small'}
                                startIcon={<Undo2Icon/>}
                                onClick={onClickBackButton}
                        >
                            Volver
                        </Button>
                    </AppBarBase.Left>

                    <AppBarBase.Right>
                        {prospect && (
                            <ButtonExportDropdown onExportExcel={onClickExport} size={'small'}/>
                        )}
                    </AppBarBase.Right>

                    <AppBarBase.Bottom>
                        <Stack direction="row" spacing={2} alignItems="flex-start" mt={1}>
                            <CompanyLogo size={'lg'}
                                         loading={!prospect}
                                         isPhysicalPerson={prospect?.[OffererClientPortfolioViewFields.PersonTypeCode] === PersonTypes.Physical}
                            />
                            <Stack sx={{width: '100%', overflow: 'hidden'}}>
                                {
                                    !!prospect ?
                                        <TypographyBase variant={'h4'} tooltip maxLines={1}>
                                            {prospect[OffererClientPortfolioDetailFields.BusinessName]}
                                        </TypographyBase>
                                        :
                                        <Skeleton width={'15%'}/>
                                }

                                {
                                    !!prospect ?
                                        <TypographyBase variant={'body2'}
                                                        color="text.lighter"
                                                        maxLines={1}
                                                        tooltip
                                        >
                                            {stringFormatter.formatCuit(prospect[OffererClientPortfolioDetailFields.CUIT])}
                                        </TypographyBase>
                                        :
                                        <Skeleton width={'5%'}/>
                                }
                            </Stack>
                        </Stack>
                    </AppBarBase.Bottom>
                </AppBarBase>

                <Box pt={'160px'} pb={4}>
                    <LufeInformationContextProvider lufeRequestId={lufeRequestId}>
                        <BureauInformationContextProvider defaultQueryId={bureauId}
                                                          dataSource={BureauInformationSourceType.ClientPortfolio}
                        >
                            <FlowUseContextProvider dataId={clientPortfolioGuid ?? ''}
                                                    dataSource={FlowUseSourceType.ClientPortfolio}>
                                <BalancesContextProvider dataId={clientPortfolioGuid ?? ''}
                                                         dataSource={BalancesSourceType.ClientPortfolio}>
                                    <NavsTabVertical
                                        tabSize={3.2}
                                        lstTabs={[
                                            {
                                                tabList: [
                                                    {
                                                        label: 'Resumen',
                                                        content: <OffererClientPortfolioSummary prospect={prospect}/>,
                                                        queryParam: 'summary',
                                                        default: true,
                                                        alwaysRender: true
                                                    },
                                                ]
                                            },
                                            {
                                                tabList: [
                                                    {
                                                        label: 'Documentos',
                                                        content: <OffererClientPortfolioFiles
                                                            clientPortfolioGuid={clientPortfolioGuid}/>,
                                                        queryParam: 'files',
                                                    },
                                                    {
                                                        label: 'Deuda en el Sistema Financiero',
                                                        content: <DebtFinancialInfoTab/>,
                                                        queryParam: 'financial-debt',
                                                    },
                                                    {
                                                        label: 'Cheques Rechazados',
                                                        content: <BouncedChecksTab/>,
                                                        queryParam: 'bounced-checks',
                                                    },
                                                    {
                                                        label: 'Aportes Previsionales',
                                                        content: <CompanyBureauInfo
                                                            hideSelector><CompanyBureauContributions/></CompanyBureauInfo>,
                                                        queryParam: 'social-security',
                                                        disabled: true,
                                                        tooltip: 'Próximamente...'
                                                    },
                                                    {
                                                        label: 'Score Crediticio',
                                                        content: <ScoreTab/>,
                                                        queryParam: 'credit-score',
                                                    }
                                                ]
                                            },
                                            {
                                                label: 'Información Económica Financiera',
                                                tabList: [
                                                    {
                                                        label: 'Estados Contables',
                                                        content:
                                                            <FinancialYearList dataId={clientPortfolioGuid ?? ''}
                                                                               dataSource={BalancesSourceType.ClientPortfolio}/>,
                                                        queryParam: 'financial-statements',
                                                        default: true
                                                    },
                                                    {
                                                        label: 'Compras/Ventas post balance',
                                                        queryParam: 'post-balance-flows',
                                                        content:
                                                            <FlowPage isLegalPerson
                                                                      dataSource={FlowUseSourceType.ClientPortfolio}/>,
                                                    },
                                                    {
                                                        label: 'Indicadores Financieros',
                                                        content: <OffererClientPortfolioFinancialIndicators
                                                            clientPortfolioGuid={clientPortfolioGuid}/>,
                                                        queryParam: 'financial-indicators'
                                                    },
                                                ]
                                            },
                                            {
                                                label: 'Personas Relacionadas',
                                                tabList: [
                                                    {
                                                        label: 'Listado',
                                                        content:
                                                            <RelatedPersonContextProvider
                                                                dataId={clientPortfolioGuid ?? ''}
                                                                dataSource={RelatedPersonSourceType.ClientPortfolio}>
                                                                <RelatedPersonTable
                                                                    legalPerson={prospect && prospect[OffererClientPortfolioDetailFields.PersonTypeCode] === PersonTypes.Legal}/>
                                                            </RelatedPersonContextProvider>,
                                                        queryParam: 'relatedPeopleLst',
                                                    },
                                                    {
                                                        label: 'Mapa de Relaciones',
                                                        content: <RelationshipMapGraph
                                                            clientPortfolioGuid={clientPortfolioGuid}/>,
                                                        queryParam: 'relatedPeopleMap'
                                                    }
                                                ]
                                            },
                                            {
                                                tabList: [
                                                    {
                                                        label: 'Autoridades',
                                                        content:
                                                            <OffererLufeTabWrapper icon={UsersFour}
                                                                                   title={'Autoridades'}>
                                                                <OffererLufeAuthorities/>
                                                            </OffererLufeTabWrapper>,
                                                        queryParam: 'authorities'
                                                    }
                                                ]
                                            },
                                            {
                                                label: 'Información Fiscal',
                                                tabList: [
                                                    {
                                                        label: 'LUFE',
                                                        content:
                                                            (!!lufeRequestId) ?
                                                                <OffererLufeTabWrapper icon={Factory}
                                                                                       title={'Datos PyME'}>
                                                                    <OffererLufePymeData/>
                                                                </OffererLufeTabWrapper>
                                                                :
                                                                <Alert color="info" severity="info">
                                                                    Para acceder a las funcionalidades de LUFE, ingresá
                                                                    tu API Key y empezá a usar el servicio
                                                                </Alert>,
                                                        queryParam: 'fiscal-info-lufe'
                                                    },
                                                    {
                                                        label: 'ARCA',
                                                        content: <AfipBureauInfoTab/>,
                                                        queryParam: 'fiscal-info-arca'
                                                    },
                                                ]
                                            },
                                            {
                                                tabList: [
                                                    {
                                                        label: 'Solicitudes vinculadas',
                                                        content: <SolicitationRelatedOffererCompany
                                                            promiseFn={() => HttpClientPortfolio.getLinkedSolicitations(clientPortfolioGuid ?? '')}/>,
                                                        queryParam: 'related-requests'
                                                    }
                                                ]
                                            },
                                        ]}
                                    />
                                </BalancesContextProvider>
                            </FlowUseContextProvider>
                        </BureauInformationContextProvider>
                    </LufeInformationContextProvider>
                </Box>
            </Container>
        </Box>
    )
}
export default OffererClientPortfolioPage