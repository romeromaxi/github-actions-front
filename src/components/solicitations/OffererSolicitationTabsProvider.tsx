import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import {
    SolicitationViewDTO,
    SolicitationViewDTOFields
} from "../../types/solicitations/solicitationData";
import {
    OffererSolicitationNavHeaderSecObjects,
    SecurityComponents
} from "../../types/security";
import OffererSolicitationAssessment from "../../pages/offerer/components/OffererSolicitation/OffererSolicitationAssessment/OffererSolicitationAssessment";
import OffererSolicitationActivity from "../../pages/offerer/components/OffererSolicitation/OffererSolicitationActivity/OffererSolicitationActivity";
import OffererSolicitationBureau from "../../pages/offerer/components/OffererSolicitation/OffererSolicitationBureau";
import OffererSolicitationExternalAccess from "../../pages/offerer/components/OffererSolicitation/OffererSolicitationExternalAccess/OffererSolicitationExternalAccess";
import {
    SolicitationAlertIconButton,
    SolicitationAlertIconType
} from "../../pages/offerer/components/OffererSolicitation/OffererSolicitationTable/SolicitationAlertIcons";
import { EntityWithIdFields } from "../../types/baseEntities";
import { TabSection } from "../navs/NavsTab";
import OffererSolicitationReception
    from "../../pages/offerer/components/OffererSolicitation/OffererSolicitationReception/OffererSolicitationReception";
import {Systems} from "../../types/workflow/workflowEnums";

interface OffererSolicitationTabsProviderProps {
    solicitation?: SolicitationViewDTO
}

export interface OffererTabList {
    tabList: TabSection[],
    action: ReactNode
}

const OffererSolicitationTabsProvider = ({ solicitation }: OffererSolicitationTabsProviderProps): OffererTabList | undefined => {
    const navigate = useNavigate();

    if (!solicitation) {
        return undefined;
    }
    const getTabsForSystem = (system: number): OffererTabList => {
        switch (system) {
            case Systems.Solicitations:
                return {
                    tabList: [
                        {
                            tabList: [
                                {
                                    label: 'Admisión',
                                    content: (
                                        <OffererSolicitationAssessment
                                            solicitation={solicitation}
                                            data
                                        />
                                    ),
                                    default: true,
                                    queryParam: 'assessmentData',
                                },
                                {
                                    label: 'Precalificación',
                                    content: (
                                        <OffererSolicitationAssessment
                                            solicitation={solicitation}
                                            data={false}
                                        />
                                    ),
                                    queryParam: 'assessmentDoc',
                                },
                                {
                                    label: 'Intercambio de Documentos',
                                    content: (<div />),
                                    queryParam: 'requestedFiles',
                                    securityComponent: SecurityComponents.OffererSolicitationNavHeader,
                                    securityObject: OffererSolicitationNavHeaderSecObjects.SolicitationOffererRequestedFilesLink,
                                },
                                {
                                    label: 'Chat con la Pyme',
                                    content: (
                                        <OffererSolicitationActivity solicitation={solicitation} />
                                    ),
                                    queryParam: 'activity',
                                    securityComponent: SecurityComponents.OffererSolicitationNavHeader,
                                    securityObject: OffererSolicitationNavHeaderSecObjects.SolicitationOffererChatLink,
                                },
                                {
                                    label: 'Info. Bases Públicas',
                                    content: (
                                        <OffererSolicitationBureau
                                            companyId={
                                                solicitation[SolicitationViewDTOFields.CompanyId]
                                            }
                                        />
                                    ),
                                    queryParam: 'bureau',
                                    securityComponent: SecurityComponents.OffererSolicitationBureau,
                                    securityObject: OffererSolicitationNavHeaderSecObjects.SolicitationOffererBureauLink,
                                }
                            ],
                        },
                    ],
                    action: (
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                            <SolicitationAlertIconButton
                                AlertCode={
                                    solicitation[SolicitationViewDTOFields.AlertTypeCode]
                                }
                                type={SolicitationAlertIconType.Message}
                                onClick={() => {
                                    navigate(
                                        `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}?tab=activity`,
                                    );
                                }}
                                securityComponentName={
                                    SecurityComponents.OffererSolicitationNavHeader
                                }
                                securityObjectName={
                                    OffererSolicitationNavHeaderSecObjects.SolicitationOffererChatLink
                                }
                            />
                            <SolicitationAlertIconButton
                                AlertCode={
                                    solicitation[SolicitationViewDTOFields.AlertTypeCode]
                                }
                                type={SolicitationAlertIconType.Document}
                                onClick={() => {
                                    navigate(
                                        `/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}?tab=requestedFiles`,
                                    );
                                }}
                                securityComponentName={
                                    SecurityComponents.OffererSolicitationNavHeader
                                }
                                securityObjectName={
                                    OffererSolicitationNavHeaderSecObjects.SolicitationOffererRequestedFilesLink
                                }
                            />
                        </Stack>
                    )
                };
            case Systems.SolicitationsReferrals:
                return {
                    tabList: [
                        {
                            tabList: [
                                {
                                    label: 'Recepción',
                                    content: (
                                        <OffererSolicitationReception solicitation={solicitation} />
                                    ),
                                    default: true,
                                    queryParam: 'reception'
                                },
                                {
                                    label: 'Derivación',
                                    content: <OffererSolicitationExternalAccess solicitation={solicitation} />,
                                    queryParam: 'external',
                                    securityComponent: SecurityComponents.OffererSolicitationExternal,
                                    securityObject: OffererSolicitationNavHeaderSecObjects.SolicitationOffererExternalAccessLink,
                                    alwaysRender: true
                                },
                                {
                                    label: 'Seguimiento',
                                    content: (
                                        <></>
                                    ),
                                    queryParam: 'tracking'
                                },
                                {
                                    label: 'Intercambio de Documentos',
                                    content: (<div />),
                                    queryParam: 'requestedFiles',
                                    securityComponent: SecurityComponents.OffererSolicitationNavHeader,
                                    securityObject: OffererSolicitationNavHeaderSecObjects.SolicitationOffererRequestedFilesLink,
                                },
                                {
                                    label: 'Chat con la Pyme',
                                    content: (
                                        <OffererSolicitationActivity solicitation={solicitation} />
                                    ),
                                    queryParam: 'activity',
                                    securityComponent: SecurityComponents.OffererSolicitationNavHeader,
                                    securityObject: OffererSolicitationNavHeaderSecObjects.SolicitationOffererChatLink,
                                },
                            ]
                        }
                    ],
                    action: <></>
                };
            default:
                return {
                    tabList: [],
                    action: <></>
                };
        }
    };

    return getTabsForSystem(solicitation[SolicitationViewDTOFields.SystemCode]);
};

export default OffererSolicitationTabsProvider;