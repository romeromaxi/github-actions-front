import { Box, Card, CardContent, Grid } from '@mui/material';
import OffererSolicitationDataAnalysisDetail from './OffererSolicitationDataAnalyisisDetail';
import OffererSolicitationApproval from './OffererSolicitationApproval';
import OffererCompanyAssessmentResult from './OffererCompanyAssessmentResult';
import React, { useEffect, useState } from 'react';
import {
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from '../../../../../types/solicitations/solicitationData';
import { HttpSolicitationAnalysis } from '../../../../../http/solicitations/httpSolicitationAnalysis';
import { NavsTabHorizontal } from '../../../../../components/navs/NavsTab';
import { SolicitationAnalysisHistoricViewDTO } from '../../../../../types/solicitations/solicitationAnalysisData';
import { SolicitationOffererStatusType } from '../../../../../types/solicitations/solicitationEnums';
import { EntityWithIdFields } from '../../../../../types/baseEntities';
import OffererSolicitationDocumentationAnalysis from './OffererSolicitationDocumentationAnalysis';
import OffererSolicitationDocumentationValidation from './OffererSolicitationDocumentationValidation';
import OffererSolicitationDocumentationResult from './OffererSolicitationDocumentationResult';
import { SolicitationDocumentationAnalysisHistoricViewDTO } from '../../../../../types/solicitations/solicitationDocumentationAnalysisData';
import { HttpSolicitationDocumentationAnalysis } from '../../../../../http/solicitations/httpSolicitationDocumentationAnalysis';
import OffererSolicitationAnalysisHistoricDataList from './OffererSolicitationAnalysisHistoricDataList';
import OffererSolicitationAnalysisHistoricDocList from './OffererSolicitationAnalysisHistoricDocList';

interface OffererSolicitationAssessmentSectionNavsProps {
  solicitation: SolicitationViewDTO;
  data?: boolean;
}

const OffererSolicitationAssessmentSectionNavs = ({
  solicitation,
  data,
}: OffererSolicitationAssessmentSectionNavsProps) => {
  const defaultState: number =
    solicitation[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode];
  const analysisState: boolean =
    defaultState === SolicitationOffererStatusType.InAnalysis ||
    (defaultState !== SolicitationOffererStatusType.AnalysisApproval &&
      defaultState !==
        SolicitationOffererStatusType.PrequalificationAnalyisis &&
      defaultState !== SolicitationOffererStatusType.Denied);
  const approvalState: boolean =
    defaultState === SolicitationOffererStatusType.AnalysisApproval;
  const approvedState: boolean =
    defaultState === SolicitationOffererStatusType.PrequalificationAnalyisis;
  const rejectedState: boolean =
    defaultState === SolicitationOffererStatusType.Denied;
  const prequalificationApproval: boolean =
    defaultState === SolicitationOffererStatusType.PrequalificationApproval;
  const prequalificationReceived: boolean =
    defaultState === SolicitationOffererStatusType.PrequalificationReceived;
  const prequalificationAnalysis: boolean =
    approvedState ||
    (!rejectedState && !prequalificationApproval && !prequalificationReceived);

  const [historicDataList, setHistoricDataList] = useState<
    SolicitationAnalysisHistoricViewDTO[]
  >([]);
  const [historicDocumentationList, setHistoricDocumentationList] = useState<
    SolicitationDocumentationAnalysisHistoricViewDTO[]
  >([]);

  useEffect(() => {
    data
      ? HttpSolicitationAnalysis.getHistoricListBySolicitationId(
          solicitation[EntityWithIdFields.Id],
        ).then((res) => {
          setHistoricDataList(res);
        })
      : HttpSolicitationDocumentationAnalysis.getHistoricListBySolicitationId(
          solicitation[EntityWithIdFields.Id],
        ).then((res) => {
          setHistoricDocumentationList(res);
        });
  }, [solicitation]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ paddingTop: 0 }}>
          <CardContent>
            <Box>
              {data ? (
                <NavsTabHorizontal
                  lstTabs={[
                    {
                      tabList: [
                        {
                          label: 'Propuesta',
                          content: (
                            <OffererSolicitationDataAnalysisDetail
                              solicitation={solicitation}
                              actualState={defaultState}
                            />
                          ),
                          default: analysisState,
                        },
                        {
                          label: 'Aprobación',
                          content: (
                            <OffererSolicitationApproval
                              solicitation={solicitation}
                              actualState={defaultState}
                            />
                          ),
                          default: approvalState,
                        },
                        {
                          label: 'Enviada',
                          content: (
                            <OffererCompanyAssessmentResult
                              solicitation={solicitation}
                              actualState={defaultState}
                            />
                          ),
                          default: approvedState || rejectedState,
                        },
                      ],
                    },
                  ]}
                />
              ) : (
                <NavsTabHorizontal
                  lstTabs={[
                    {
                      tabList: [
                        {
                          label: 'Propuesta',
                          content: (
                            <OffererSolicitationDocumentationAnalysis
                              solicitation={solicitation}
                              actualState={defaultState}
                            />
                          ),
                          default: prequalificationAnalysis,
                        },
                        {
                          label: 'Aprobación',
                          content: (
                            <OffererSolicitationDocumentationValidation
                              solicitation={solicitation}
                              actualState={defaultState}
                            />
                          ),
                          default: prequalificationApproval,
                        },
                        {
                          label: 'Enviada',
                          content: (
                            <OffererSolicitationDocumentationResult
                              solicitation={solicitation}
                              actualState={defaultState}
                            />
                          ),
                          default: prequalificationReceived || rejectedState,
                        },
                      ],
                    },
                  ]}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        {data && historicDataList.length !== 0 && (
          <OffererSolicitationAnalysisHistoricDataList
            solicitation={solicitation}
            dataList={historicDataList.reverse()}
            lastValidation={approvedState || rejectedState}
          />
        )}
        {!data && historicDocumentationList.length !== 0 && (
          <OffererSolicitationAnalysisHistoricDocList
            solicitation={solicitation}
            docList={historicDocumentationList.reverse()}
            lastValidation={prequalificationReceived || rejectedState}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default OffererSolicitationAssessmentSectionNavs;
