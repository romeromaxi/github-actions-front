import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useMemo} from "react";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {NavsTabVertical} from "../../../components/navs/NavsTab";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {Box, Button, Card, Container, Skeleton, Stack} from "@mui/material";
import {SolicitationViewDTOFields} from "../../../types/solicitations/solicitationData";
import {OffererContext} from "../components/OffererContextProvider";
import {SolicitationTypes, SolicitationAlertType} from "../../../types/solicitations/solicitationEnums";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {useApplicationCommon} from "../../../hooks/contexts/ApplicationCommonContext";
import {AppBarBase} from "../../../components/appbar/AppBarBase";
import {
    Building2Icon,
    ExternalLinkIcon,
    HistoryIcon,
    MessagesSquareIcon,
    StoreIcon,
    TrendingUpIcon,
    Undo2Icon
} from "lucide-react";
import OffererSolicitationHeader from "./components/OffererSolicitationHeader";
import {WrapperIcons} from "../../../components/icons/Icons";
import OffererSolicitationInfoSummaryCard from "./components/OffererSolicitationInfoSummaryCard";
import OffererSolicitationChatTab from "./components/OffererSolicitationChatTab";
import OffererSolicitationActionBetweenOfferers
    from "./components/betweenOfferers/OffererSolicitationActionBetweenOfferers";
import OffererSolicitationTabSummary from "./tabs/OffererSolicitationTabSummary";
import {LucSvgOutlinedIcon} from "../../../components/icons/LucSvgIcon";
import OffererSolicitationTabProgress from "../../solicitations/progressFlow/OffererSolicitationTabProgress";
import OffererSolicitationTabInternalTracking from "./tabs/OffererSolicitationTabInternalTracking";

function OffererSolicitationPage() {
    const { solicitationId } = useParams();
    const navigate = useNavigate();
    const offerer = useContext(OffererContext);
    const { solicitation, getSolicitation, isCommercialResponsible, betweenOfferers, offererBase } = useSolicitation();

    const appCommon = useApplicationCommon() as any;
    const { paddingTopContent } = appCommon;

    const solicitationIdParsed = useMemo(() =>
        solicitationId ? parseInt(solicitationId) : undefined , [solicitationId]);

    const onNavigateToClientPortfolio = () => {
        const url = `${window.location.origin}/offerer/clientPortfolio/${solicitation?.[SolicitationViewDTOFields.FolderId]}`;
        window.open(url, "_blank");
    }
    
    const onClickBackButton = () => navigate(-1);

    useEffect(() => {
        if (solicitationIdParsed && (!solicitation || solicitation[EntityWithIdFields.Id] !== solicitationIdParsed))
            getSolicitation(solicitationIdParsed)
    }, [solicitationIdParsed]);
        
    const menuSolicitationTabs = useMemo(() => {
        if (!solicitation) return [
            {
                label: <Skeleton width={'100%'} sx={{ minWidth: '200px' }} />,
                content: <div />,
            },
            {
                label: <Skeleton width={'100%'} sx={{ minWidth: '200px' }} />,
                content: <div />,
            }
        ];

        if (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.BetweenOfferers) {
            if ((offerer[EntityWithIdFields.Id] === solicitation[SolicitationViewDTOFields.OffererId]))
                return [
                    {
                        label: `Conversación con ${solicitation[SolicitationViewDTOFields.IntermediaryOffererBusinessName]}`,
                        icon: <WrapperIcons Icon={LucSvgOutlinedIcon} size={'md'} />,
                        content: <OffererSolicitationTabSummary includeChatTab />,
                        queryParam: 'summary',
                        default: true
                    },
                ]

            return [
                {
                    label: `Conversación con el Oferente`,
                    icon: <WrapperIcons Icon={LucSvgOutlinedIcon} size={'md'} />,
                    content: <OffererSolicitationTabSummary includeChatTab />,
                    queryParam: 'summary',
                    default: true
                },
            ]
        }
        
        return [
            {
                label: 'Resumen de la solicitud',
                icon: <WrapperIcons Icon={Building2Icon} size={'md'} />,
                content: <OffererSolicitationTabSummary />,
                queryParam: 'summary',
                default: true
            },
            {
                label: 'Chat y documentos',
                icon: <WrapperIcons Icon={MessagesSquareIcon} size={'md'} />,
                content: <OffererSolicitationChatTab offerer={offerer}
                                                     solicitation={solicitation}
                                                     offererBase={offererBase}
                                                     isCommercialResponsible={isCommercialResponsible}
                />,
                action: (
                    solicitation[SolicitationViewDTOFields.AlertTypeCode] === SolicitationAlertType.NewMessage || 
                    solicitation[SolicitationViewDTOFields.AlertTypeCode] === SolicitationAlertType.NewDocument ||
                    solicitation[SolicitationViewDTOFields.AlertTypeCode] === SolicitationAlertType.NewMessageAndNewDocument
                ) ? 
                    <TypographyBase variant={'button2'} color={'primary'}>
                        nuevos
                    </TypographyBase> : undefined,
                queryParam: 'communication',
            },
            {
                label: 'Progreso de la solicitud',
                icon: <WrapperIcons Icon={TrendingUpIcon} size={'md'} />,
                queryParam: 'progress',
                content: <OffererSolicitationTabProgress />,
            },
            {
                label: 'Seguimiento interno',
                icon: <WrapperIcons Icon={HistoryIcon} size={'md'} />,
                queryParam: 'internal-tracking',
                content: <OffererSolicitationTabInternalTracking />,
            }
        ]
    }, [offerer, solicitationId, solicitation])

    const actionInsideSolicitationTab = useMemo(() => {
        if (!solicitation) return <React.Fragment />;

        if (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.BetweenOfferers) {
            return (
                <React.Fragment>
                    {
                        (!!solicitation && !!solicitation[SolicitationViewDTOFields.FolderId]) &&
                            <Button variant={'tabVertical'}
                                    size={'medium'}
                                    startIcon={<Building2Icon />}
                                    endIcon={<ExternalLinkIcon />}
                                    onClick={onNavigateToClientPortfolio}
                                    fullWidth
                            >
                                Explorar la PyME
                            </Button>
                    }
                </React.Fragment>
            )
        }

        return <React.Fragment />;
    }, [solicitation])

    const actionOutsideSolicitationTabList = useMemo(() => {
        const actionsLists = [];
        
        if (!solicitation) return [];

        if (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.BetweenOfferers) 
            return [];

        if (!!solicitation && !!solicitation[SolicitationViewDTOFields.FolderId]) {
            actionsLists.push((
                <Button variant={'tabVertical'}
                        size={'medium'}
                        startIcon={<Building2Icon />}
                        endIcon={<ExternalLinkIcon />}
                        onClick={onNavigateToClientPortfolio}
                        fullWidth
                >
                    Explorar la PyME
                </Button>
            ))
        }
        
        if (solicitation[SolicitationViewDTOFields.OriginSolicitationId])
            actionsLists.push((
                <Button variant={'tabVertical'}
                        size={'medium'}
                        startIcon={<LucSvgOutlinedIcon />}
                        endIcon={<ExternalLinkIcon />}
                        fullWidth
                >
                    {`Conversación con ${solicitation[SolicitationViewDTOFields.IntermediaryOffererBusinessName] || 'LUC'}`}
                </Button>
            ))
        else if (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.General)
            actionsLists.push((
                <Button variant={'tabVertical'}
                        size={'medium'}
                        startIcon={<StoreIcon />}
                        endIcon={<ExternalLinkIcon />}
                        fullWidth
                >
                    Ir al producto
                </Button>
            ))
        
        return actionsLists;
    }, [solicitation])
    
    return (
        <Box sx={{ position: 'relative' }}>
            <Container>
                <AppBarBase title={`Detalle de Solicitud #${solicitationId || ''}`}
                            hideLogo
                >
                    <AppBarBase.Left>
                        <Button variant={'outlined'}
                                color={'secondary'}
                                size={'small'}
                                startIcon={<Undo2Icon />}
                                onClick={onClickBackButton}
                        >
                            Volver
                        </Button>
                    </AppBarBase.Left>
                    
                </AppBarBase>
                
                <Box pt={paddingTopContent} pb={4}>
                    <Stack spacing={4}>
                        <OffererSolicitationHeader />

                        {
                            betweenOfferers &&
                                <OffererSolicitationActionBetweenOfferers />
                        }
                        
                        {/* Este Box se usa para eliminar paddings generados por Grid container  */}
                        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                            <NavsTabVertical tabSize={3.6}
                                             keyTabPanelContainer={'offererSolicitationPage'}
                                             lstTabs={[{ tabList: menuSolicitationTabs }]}
                                             actionInside={actionInsideSolicitationTab}
                                             alwaysSomeActiveTab
                            >
                                {
                                    !!actionOutsideSolicitationTabList.length ?
                                        <Card>
                                            <Stack spacing={1}>
                                                {actionOutsideSolicitationTabList}
                                            </Stack>
                                        </Card>
                                        :
                                        <React.Fragment />
                                }
                                
                                <OffererSolicitationInfoSummaryCard />
                            </NavsTabVertical>
                        </Box>
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}

export default OffererSolicitationPage;