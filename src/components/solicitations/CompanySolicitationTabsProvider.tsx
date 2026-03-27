import CompanySolicitationAssessment from "../../pages/company/solicitations/CompanySolicitationAssessment";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "../../types/solicitations/solicitationData";
import CompanySolicitationDocumentSwap from "../../pages/company/solicitations/CompanySolicitationDocumentSwap";
import {CompanySolicitationPageSecObjects, SecurityComponents} from "../../types/security";
import CompanySolicitationActivity from "../../pages/company/solicitations/CompanySolicitationActivity";
import React from "react";
import CompanySolicitationAssessmentThird from "../../pages/company/solicitations/CompanySolicitationAssessmentThird";

interface CompanySolicitationTabsProviderProps {
    solicitation: SolicitationViewDTO
}

const CompanySolicitationTabsProvider = ({ solicitation }: CompanySolicitationTabsProviderProps) => {
    const getTabsForSystem = (system: number) => {
        switch (system) {
            case 1:
                return [
                    {
                        tabList: [
                            {
                                label: 'Mi Solicitud',
                                content: (
                                    <CompanySolicitationAssessment
                                        solicitation={solicitation}
                                    />
                                ), 
                                default: true, 
                                queryParam: 'assessmentData',
                            },
                            {
                                label: 'Intercambio de Documentos',
                                    content: (
                                <CompanySolicitationDocumentSwap
                                    solicitation={solicitation}
                                />
                            ),
                                tooltip:
                                    'Aquí podrás descargar documentación que te envió el oferente',
                                        queryParam: 'requestedFiles',
                                securityComponent: SecurityComponents.CompanySolicitationPage,
                                securityObject:
                                CompanySolicitationPageSecObjects.SolicitationCompanyRequestedFilesLink,
                            },
                            {
                                label: 'Chat con Oferente',
                                    content: (
                                <CompanySolicitationActivity solicitation={solicitation} />
                            ),
                                queryParam: 'activity',
                                    securityComponent: SecurityComponents.CompanySolicitationPage,
                                securityObject:
                                CompanySolicitationPageSecObjects.SolicitationCompanyChatLink,
                            },
                        ]
                    },
                ];
            case 3:
                return [
                    {
                        tabList: [
                            {
                                label: 'Mi Solicitud',
                                content: (
                                    <CompanySolicitationAssessmentThird
                                        solicitation={solicitation}
                                    />
                                ),
                                default: true,
                                queryParam: 'assessmentData',
                            },
                            {
                                label: 'Intercambio de Documentos',
                                content: (
                                    <CompanySolicitationDocumentSwap
                                        solicitation={solicitation}
                                    />
                                ),
                                tooltip:
                                    'Aquí podrás descargar documentación que te envió el oferente',
                                queryParam: 'requestedFiles',
                                securityComponent: SecurityComponents.CompanySolicitationPage,
                                securityObject:
                                CompanySolicitationPageSecObjects.SolicitationCompanyRequestedFilesLink,
                            },
                            {
                                label: 'Chat con Oferente',
                                content: (
                                    <CompanySolicitationActivity solicitation={solicitation} />
                                ),
                                queryParam: 'activity',
                                securityComponent: SecurityComponents.CompanySolicitationPage,
                                securityObject:
                                CompanySolicitationPageSecObjects.SolicitationCompanyChatLink,
                            },
                        ]
                    },
                ]
            default:
                return []
        }
    };

    return getTabsForSystem(solicitation[SolicitationViewDTOFields.SystemCode]);
};

export default CompanySolicitationTabsProvider;