import React from "react";
import {Alert, Box, Card, CardContent} from "@mui/material";
import {NavsTabHorizontal} from "components/navs/NavsTab";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import OffererSolicitationAnalysisAssessmentSectionNavs, {
  AssessmentSections
} from "./OffererSolicitationAnalysisAssessmentSectionNavs";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {Systems} from "types/workflow/workflowEnums";
import OffererSolicitationReceptionContent
  from "../../../components/OffererSolicitation/OffererSolicitationReception/OffererSolicitationReceptionContent";
import {
  SolicitationOffererTabs,
  SolicitationStatusType
} from "../../../../../types/solicitations/solicitationEnums";
import {SolicitationHelper} from "../../../../../util/helpers/solicitationHelper";
import SolicitationAssistanceOfferer from "../../../../solicitations/assistance/SolicitationAssistanceOfferer";
import SolicitationAssistanceClosingTabOfferer
  from "../../../../solicitations/assistance/SolicitationAssistanceClosingTabOfferer";
import SolicitationTrackingGeneralTab from "../../../../solicitations/tracking/SolicitationTrackingGeneralTab";

function OffererSolicitationAnalysis() {
  const { solicitation } = useSolicitation();
  const stateCode = solicitation?.[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode]
  
  return (
    <Box>
      {
        (solicitation && stateCode) ?
          solicitation[SolicitationViewDTOFields.SystemCode] === Systems.Solicitations ?
              stateCode === 1 ?
                  <Alert color={'info'} severity={'info'}>
                    En espera de confirmación por la empresa
                  </Alert>
                  :
                  <NavsTabHorizontal 
                      fullWidth lstTabs={
                    [
                      {
                        tabList: [
                          {
                            label: 'Admisión',
                            content:
                              <OffererSolicitationAnalysisAssessmentSectionNavs solicitation={solicitation}
                                                                                section={AssessmentSections.Admission}
                              />,
                            default: stateCode === SolicitationStatusType.SolicitationReception || stateCode === SolicitationStatusType.GeneralOffererSolicitationIncoming ||
                                stateCode === SolicitationStatusType.GeneralOffererAdmission || stateCode === SolicitationStatusType.GeneralOffererAdmissionApproval
                          },
                          {
                            label: 'Propuesta',
                            content:
                              <OffererSolicitationAnalysisAssessmentSectionNavs solicitation={solicitation}
                                                                                section={AssessmentSections.Prequalification}
                              />,
                            default: stateCode === SolicitationStatusType.PrequalificationAble || stateCode === SolicitationStatusType.GeneralOffererPrequalificationApproval  || stateCode === SolicitationStatusType.GeneralOffererPrequalificationAnalyisis
                            || stateCode === SolicitationStatusType.GeneralOffererPrequalifieds || stateCode === SolicitationStatusType.GeneralOffererDenied || stateCode === SolicitationStatusType.GeneralOffererCancelled || stateCode === SolicitationStatusType.GeneralOffererExpired
                          },
                          {
                            label: 'Instrumentación',
                            content: (
                              <Card>
                                <CardContent>
                                  <Alert color={'info'} severity={'info'}>
                                    Esta sección estará disponible próximamente.
                                  </Alert>
                                </CardContent>
                              </Card>
                            ),
                          }
                        ]
                      }
                    ]
                  } />
            :
            <NavsTabHorizontal fullWidth lstTabs={
              [
                {
                  tabList: [
                    {
                      label: 'Recepción',
                      content: <OffererSolicitationReceptionContent solicitation={solicitation} />,
                      default: SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.Reception)
                    },
                    {
                      label: 'Asistencia',
                      content: <SolicitationAssistanceOfferer solicitation={solicitation} />,
                      default: SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.Assistance)
                    },
                    {
                      label: 'Seguimiento',
                      content: <SolicitationTrackingGeneralTab solicitation={solicitation} />,
                      default: SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.TrackingInstrumentation),
                      alwaysRender: true
                    },
                    {
                      label: 'Cierre de la asistencia',
                      content: <SolicitationAssistanceClosingTabOfferer solicitation={solicitation} />,
                      default: SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.AssistanceClosing)
                    }
                  ]
                }
              ]
            } />
          :
          <div />
      }
    </Box>
  )
}

export default OffererSolicitationAnalysis;