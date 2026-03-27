import React, {useMemo, useState} from "react";
import {
    SolicitationHistoryView,
    SolicitationHistoryViewFields,
    SolicitationViewDTOFields
} from "types/solicitations/solicitationData";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {HttpFilesSolicitationManagement} from "http/index";
import {EntityWithIdFields} from "types/baseEntities";
import {Box, Card, Collapse, IconButton, Stack} from "@mui/material";
import {ChevronDownIcon, ChevronRightIcon} from "lucide-react";
import AvatarUserOfferer from "../../offerer/components/avatar/AvatarUserOfferer";
import {TypographyBase} from "components/misc/TypographyBase";
import {dateFormatter} from "util/formatters/dateFormatter";
import {
    SolicitationApprovalResultType,
    SolicitationNoteRelatedDataTypes,
    SolicitationProposedApprovalFlowTypes
} from "types/solicitations/solicitationEnums";
import {WrapperIcons} from "components/icons/Icons";
import {
    analysisStatesIconMap,
    approvalStatesIconMap,
    SolicitationAnalysisStates,
    titleAnalysisStatesMap
} from "./OffererSolicitationTabProgressCommonConfiguration";
import {Systems} from "types/workflow/workflowEnums";
import LabelFormBase from "components/forms/LabelFormBase";
import {HttpSolicitationsNotes} from "http/solicitations/httpSolicitationsNotes";
import {themeColorDefinition} from "util/themes/definitions";
import SolicitationActivityList from "components/solicitations/SolicitationActivityList";
import {TextFieldBase} from "components/forms/TextFieldBase";
import EmptyStateBox, {EmptyStateBoxVariant} from "components/misc/EmptyStateBox";
import {PermissionType} from "types/security";

function OffererSolicitationProgressHistory() {
    const { solicitation, permissionWorkflowCode, historyList } = useSolicitation();
    
    if ((!historyList || !solicitation) || (!historyList.length && permissionWorkflowCode === PermissionType.Write))
        return null
    
    return (
        <React.Fragment>
            {
                historyList.length ?
                    historyList.map((h, idx) => (
                        <OffererSolicitationProgressHistoryItem key={`offererSolicitationProgressHistoryItem_${idx}`}
                                                                history={h}
                                                                solicitationId={solicitation[EntityWithIdFields.Id]}
                                                                solicitationSystemCode={solicitation[SolicitationViewDTOFields.SystemCode]}
                                                                defaultExpanded={idx === 0 && permissionWorkflowCode !== PermissionType.Write}
                                                                historyRelated={h[SolicitationHistoryViewFields.RelatedId] ? historyList.find(x => x[EntityWithIdFields.Id] === h[SolicitationHistoryViewFields.RelatedId]) : undefined}
                                                                inCard
                        />
                    ))
                    :
                    <EmptyStateBox text={'Aún no hay actividad en esta solicitud'}
                                   variant={EmptyStateBoxVariant.InfoRelated}
                    >
                        <TypographyBase variant={'body2'} color={'text.lighter'}
                                        maxWidth={{ xs: 1, md: '80%', lg: '55%' }}
                        >
                            Podrás ver los cambios de estado de esta solicitud cuando un analista inicie la evaluación o descarte la solicitud
                        </TypographyBase>
                    </EmptyStateBox>
            }
        </React.Fragment>
    )
}

interface OffererSolicitationProgressHistoryItemProps {
    solicitationId: number,
    solicitationSystemCode: Systems,
    history: SolicitationHistoryView,
    inCard?: boolean,
    hideConnector?: boolean,
    defaultExpanded?: boolean,
    historyRelated?: SolicitationHistoryView
}

export function OffererSolicitationProgressHistoryItem({ 
    solicitationId, solicitationSystemCode, history, inCard = false, hideConnector = false, defaultExpanded = false, historyRelated = undefined
}: OffererSolicitationProgressHistoryItemProps) {    
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
    
    const configuration = useMemo(() => {
        let subheaderSummary: string = '',
            labelState : string = '',
            descriptionState: string = '',
            labelMessage: string = '';
        
        let IconState : React.ElementType = () => <React.Fragment />;
        
        let flowType: SolicitationProposedApprovalFlowTypes;
        let approvalResultCode: SolicitationApprovalResultType = 
            history[SolicitationHistoryViewFields.ResultCode] as SolicitationApprovalResultType;
        let analysisState: SolicitationAnalysisStates = history[SolicitationHistoryViewFields.IsPositiveResult] ? 
            SolicitationAnalysisStates.Suitable : SolicitationAnalysisStates.NotSuitable;
        
        switch (history[SolicitationHistoryViewFields.RelatedDataCode]) {
            case SolicitationNoteRelatedDataTypes.AdmissionProposal:
                labelState = 'Recomendación';
                flowType = SolicitationProposedApprovalFlowTypes.AdmissionReception;
                IconState = analysisStatesIconMap[solicitationSystemCode][flowType][analysisState];
                descriptionState = titleAnalysisStatesMap[solicitationSystemCode][flowType][analysisState];
                subheaderSummary = `Ha recomendado ${descriptionState.toLowerCase()}`;

                if (analysisState === SolicitationAnalysisStates.NotSuitable)
                    labelMessage = 'Mensaje para la PyME';

                break;

            case SolicitationNoteRelatedDataTypes.AdmissionApproval:
                labelState = 'Cambio de estado';
                flowType = SolicitationProposedApprovalFlowTypes.AdmissionReception;
                IconState = approvalStatesIconMap[solicitationSystemCode][flowType][approvalResultCode];
                descriptionState = history[SolicitationHistoryViewFields.ResultDesc];
                subheaderSummary = history[SolicitationHistoryViewFields.IsPositiveResult] ? 'Ha aprobado la propuesta del analista' : 'Ha devuelto la recomendación al analista';
                break;

            case SolicitationNoteRelatedDataTypes.PrequalificationProposal:
                labelState = 'Recomendación';
                flowType = SolicitationProposedApprovalFlowTypes.SendingResults;
                IconState = analysisStatesIconMap[solicitationSystemCode][flowType][analysisState];
                descriptionState = titleAnalysisStatesMap[solicitationSystemCode][flowType][analysisState];
                subheaderSummary = `Ha recomendado ${descriptionState.toLowerCase()}`;
                labelMessage = (analysisState === SolicitationAnalysisStates.NotSuitable) ? 'Mensaje para la PyME' : 'Propuesta para la PyME';
                break;

            case SolicitationNoteRelatedDataTypes.PrequalificationApproval:
                labelState = 'Cambio de estado';
                flowType = SolicitationProposedApprovalFlowTypes.SendingResults;
                IconState = approvalStatesIconMap[solicitationSystemCode][flowType][approvalResultCode];
                descriptionState = history[SolicitationHistoryViewFields.ResultDesc];
                subheaderSummary = history[SolicitationHistoryViewFields.IsPositiveResult] ? 'Ha aprobado la propuesta del analista' : 'Ha devuelto la recomendación al analista';
                break;
        }
        
        return {
            subheaderSummary: subheaderSummary,
            labelState: labelState,
            descriptionState: descriptionState,
            IconState: IconState,
            iconColor: history[SolicitationHistoryViewFields.IsPositiveResult] ? 'success.strong' : 'error',
            labelMessage: labelMessage
        }
    }, [history, solicitationSystemCode])
    
    const toggleExpanded = () => setExpanded((prev) => !prev);

    const fetchNotes = () => {
        if (!!solicitationId && !!history) {
            return HttpSolicitationsNotes.search(solicitationId, history[SolicitationHistoryViewFields.RelatedDataCode], history[EntityWithIdFields.Id])
        }
        return Promise.resolve([]);
    }

    const fetchDocuments = () => {
        if (!!solicitationId && !!history) {
            return HttpFilesSolicitationManagement.getList(solicitationId, history[SolicitationHistoryViewFields.RelatedDataCode], history[EntityWithIdFields.Id])
        }
        return Promise.resolve([]);
    }
    
    return (
        <React.Fragment>
            {
                !hideConnector &&
                    <Box pl={3.5} height={'36px'}>
                        <Box height={1} borderLeft={`1px solid ${themeColorDefinition.UIElements.texts.tertiary}`} />
                    </Box>
            }
            
            <OffererSolicitationProgressHistoryItemWrapper inCard={inCard}>
                <Stack direction={'column'} spacing={expanded ? 2 : 0}>
                    <Stack direction={'row'}
                           justifyContent={'space-between'}
                           onClick={toggleExpanded}
                           sx={{ 
                               '&:hover': {
                                   '& > *': { cursor: 'pointer' }
                               }
                           }}
                    >
                        <Stack direction={'row'} spacing={1.25}>
                            <IconButton variant={'minPadding'}
                                        size={'medium'}
                            >
                                { expanded ? <ChevronDownIcon /> : <ChevronRightIcon /> }
                            </IconButton>

                            <AvatarUserOfferer size={'sm'}
                                               userName={history[SolicitationHistoryViewFields.UserName]}
                                               includeName
                            />
                        </Stack>

                        <TypographyBase variant={'body3'} color={'text.lighter'}>
                            {dateFormatter.toShortDate(history[SolicitationHistoryViewFields.Date])}
                        </TypographyBase>
                    </Stack>

                    {
                        !expanded &&
                        <Box pl={8}>
                            <TypographyBase variant={'body4'}>
                                {configuration.subheaderSummary}
                            </TypographyBase>
                        </Box>
                    }

                    <Collapse in={expanded}>
                        <Box pl={8}>
                            <Stack spacing={3}>
                                {
                                    !!historyRelated && (
                                        <OffererSolicitationProgressHistoryItem solicitationId={solicitationId} 
                                                                                solicitationSystemCode={solicitationSystemCode}
                                                                                history={historyRelated}
                                                                                hideConnector
                                        />
                                    )
                                }
                                
                                <Stack spacing={1.25}>
                                    <LabelFormBase label={configuration.labelState} />

                                    <Stack direction={'row'}
                                           alignItems={'center'}
                                           spacing={1}>
                                        <WrapperIcons Icon={configuration.IconState}
                                                      color={configuration.iconColor}
                                                      size={'md'}
                                        />

                                        <TypographyBase variant={'button1'}>
                                            {configuration.descriptionState}
                                        </TypographyBase>
                                    </Stack>
                                </Stack>

                                {
                                    !!configuration.labelMessage && 
                                    !!history[SolicitationHistoryViewFields.MessageCompany] && (
                                        <TextFieldBase label={configuration.labelMessage} 
                                                       value={history[SolicitationHistoryViewFields.MessageCompany]}
                                                       maxRows={4}
                                                       multiline
                                                       disabled
                                        />
                                    )
                                }

                                <SolicitationActivityList title={'Seguimiento interno'}
                                                          fetchNotes={fetchNotes}
                                                          fetchDocuments={fetchDocuments}
                                />
                            </Stack>
                        </Box>
                    </Collapse>
                </Stack>
            </OffererSolicitationProgressHistoryItemWrapper>
        </React.Fragment>
    )
}

interface OffererSolicitationProgressHistoryItemWrapperProps {
    inCard: boolean,
    children: React.ReactNode
}

function OffererSolicitationProgressHistoryItemWrapper({inCard, children}: OffererSolicitationProgressHistoryItemWrapperProps) {
    if (inCard)
        return (
            <Card sx={{ padding: '16px', borderRadius: '16px' }}>
                {children}
            </Card>
        )

    return (
        <Box border={`1px solid ${themeColorDefinition.UIElements.borders.primary}`} 
             sx={{ padding: '16px', borderRadius: '16px' }}>
            {children}
        </Box>
    )
}

export default OffererSolicitationProgressHistory;