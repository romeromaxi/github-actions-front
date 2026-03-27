import React from 'react';
import {Box, Button, Container, Divider, Stack} from '@mui/material';
import {useCompanySolicitation} from "./CompanySolicitationContext";
import {SolicitationFlagsFields, SolicitationViewDTOFields} from "../../../types/solicitations/solicitationData";
import {AppBarBase} from "../../../components/appbar/AppBarBase";
import {useNavigate} from "react-router-dom";
import {Undo2Icon} from "lucide-react";
import CompanySolicitationHeaderMenuOptions from "./components/CompanySolicitationHeaderMenuOptions";
import {useApplicationCommon} from "../../../hooks/contexts/ApplicationCommonContext";
import CompanySolicitationHeader from "./components/CompanySolicitationHeader";
import CompanySolicitationCommunicationPanel from "./components/CompanySolicitationCommunicationPanel";
import SolicitationFollowUpStepsCards from "../../solicitations/components/SolicitationFollowUpStepsCards";
import CompanyCurrentSolicitations
    from "../../../components/solicitations/leftPanel/components/CompanyCurrentSolicitations";
import CompanySolicitationNewProposal from "./components/CompanySolicitationNewProposal";
import {SolicitationTypes} from "../../../types/solicitations/solicitationEnums";
import CompanySolicitationAnotherOfferers from "./components/CompanySolicitationAnotherOfferers";
import CompanySolicitationRelatedLines from "../../../components/solicitations/CompanySolicitationRelatedLines";
import CompanySolicitationAutomaticDisclaimer from "./components/CompanySolicitationAutomaticDisclaimer";

function CompanySolicitationPage() {
  const navigate = useNavigate();
  const appCommon = useApplicationCommon() as any;
  const { paddingTopContent } = appCommon;
  const { solicitationId, solicitation, flags } = useCompanySolicitation();
  
  const onClickBackButton = () => navigate(-1);
    
  return (
      <Box sx={{ position: 'relative' }}>
          <Container>
              <AppBarBase title={`Detalle de Solicitud ${!!solicitation ? "para " + solicitation[SolicitationViewDTOFields.CompanyBusinessName] : ''}`}
                          hideLogo>
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

                  {
                      (!!solicitation && flags?.[SolicitationFlagsFields.SolicitationCancelAllowed]) && (
                          <AppBarBase.Right>
                              <CompanySolicitationHeaderMenuOptions />
                          </AppBarBase.Right>
                      )
                  }
              </AppBarBase>
              
              <Box pt={paddingTopContent} pb={4}>
                  <Stack spacing={4}>
                      <CompanySolicitationHeader />
                      
                      <Divider />
                      
                      <Stack spacing={7}>
                          <CompanySolicitationAutomaticDisclaimer solicitation={solicitation} />
                          
                          {
                              !!solicitation && 
                              !!solicitationId &&
                              solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.Matcher &&
                                <CompanySolicitationAnotherOfferers solicitationId={solicitationId}/>
                          }
                          
                          <CompanySolicitationNewProposal solicitation={solicitation} />
                          
                          <CompanySolicitationCommunicationPanel />
                          
                          <SolicitationFollowUpStepsCards solicitationId={solicitationId} />
                          
                          <CompanyCurrentSolicitations />
                          
                          <CompanySolicitationRelatedLines solicitationId={solicitationId} />
                      </Stack>
                  </Stack>
              </Box>
          </Container>
      </Box>
  );
}

/*
<Grid container spacing={2} alignItems={'flex-start'} mt={2}>
          {
              !!companyFileInt ?
                  <Grid item xs={12} md={12} container spacing={2}>
                      <CompanyFileSectionsContext.Provider value={{
                          editing: editing,
                          setEditing: setEditing
                      }}>
                          <CompanyFileContextProvider dataId={companyFileInt.id} dataSource={companyFileInt.src} companyFileType={companyFileInt.type}>
                              <CompanyFileSolicitationDetailComponent allowEdit={companyFileInt.edit}
                                                                      title={companyFileInt.title}
                                                                      onBack={() => setCompanyFileInt(undefined)}
                                                                      personTypeCode={solicitation?.[SolicitationViewDTOFields.CompanyPersonTypeCode]}
                              />
                          </CompanyFileContextProvider>
                      </CompanyFileSectionsContext.Provider>
                  </Grid>
                  :
                      <NavsTabVertical lstTabs={[
                          {
                              tabList: [
                                  {
                                      label: 'Seguimiento',
                                      content: <CompanySolicitationDashboard />,
                                      queryParam: 'dashboard',
                                      default: true
                                  },
                                  {
                                      label: 'Chat con la entidad',
                                      content: <CompanySolicitationActivityChat />,
                                      queryParam: 'chat',
                                      disabled: !(flags && flags[SolicitationFlagsFields.SolicitationChatViewAllowed]),
                                      tooltip: !(flags && flags[SolicitationFlagsFields.SolicitationChatViewAllowed]) ? 'No tenés acceso al chat por ahora' : '',
                                      highlighted: hasAlertInChat
                                  },
                                  {
                                      label: 'Intercambio de documentación',
                                      content: <SolicitationRequestedDocumentation solicitationId={solicitation?.[EntityWithIdFields.Id]}
                                                                                   solicitation={solicitation}
                                                                                   variant={SolicitationRequestedDocumentationVariant.UploadOnly}
                                                                                   companyId={solicitation?.[SolicitationViewDTOFields.CompanyId]}
                                      />,
                                      queryParam: 'docsExchange',
                                      highlighted: hasAlertInDocument
                                  },
                                  {
                                      label: 'Legajos',
                                      content: <CompanySolicitationCompanyFileUpdates handleShowCompanyFile={setCompanyFileInt} solicitation={solicitation}/>,
                                      queryParam: 'companyFileLst',
                                  },
                                  {
                                      label: 'Solicitudes vinculadas',
                                      content: <CompanyCurrentSolicitations />,
                                      queryParam: 'related-solicitations'
                                  },
                                  {
                                      label: 'Comunicaciones',
                                      content: <CompanySolicitationResultEvaluation />,
                                      queryParam: 'following'
                                  },
                              ]
                          }
                      ]}
                                       tabSize={4}
                                       header={<CompanySolicitationHeader solicitation={solicitation}
                                                                          hasAlert={hasAlertInDocument || hasAlertInChat}
                                       />}
                                       onChange={(_) => reloadAlertCode()}
                      >
                          <Stack>
                              {
                                  (!!solicitation && !!flags && flags[SolicitationFlagsFields.SolicitationAdmitAllowed]) &&
                                      <CompanySolicitationAdmission />
                              }
                          </Stack>
                      </NavsTabVertical>
          }
      </Grid>
* */

export default CompanySolicitationPage;
