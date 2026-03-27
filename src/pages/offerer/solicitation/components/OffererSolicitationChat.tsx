import ConversationContextProvider from "hooks/contexts/ConversationContext";
import ChatCard from "components/chat/ChatCard";
import {EntityWithIdFields} from "types/baseEntities";
import {OffererSolicitationNavHeaderSecObjects, OffererSolicitationActivitySecObjects, SecurityComponents} from "types/security";
import {SolicitationFlagsFields, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {SolicitationOffererTabs} from "types/solicitations/solicitationEnums";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import React, {useContext, useMemo} from "react";
import {OffererContext} from "../../components/OffererContextProvider";
import OffererLogo from "../../components/OffererLogo";
import {CompanyLogoById} from "../../../company/components/CompanyLogo";
import EmptyStateBox, {EmptyStateBoxVariant} from "components/misc/EmptyStateBox";
import {Button, IconButton, Stack, TextField} from "@mui/material";
import {PlayIcon, SendIcon} from "lucide-react";
import OffererSolicitationAssignmentActionWrapper, {
    OffererSolicitationAssignmentActionVariant
} from "./assignment/OffererSolicitationAssignmentActionWrapper";
import useSecurityObject from "hooks/useSecurityObject";
import {useAppNavigation} from "hooks/navigation";
import {OffererRoute} from "routes/offerer/routeAppOffererData";
import {CryptoJSHelper} from "util/helpers";
import { SolicitationHelper } from "util/helpers/solicitationHelper";
import {SolicitationAnalysisStates} from "pages/solicitations/progressFlow/OffererSolicitationTabProgressCommonConfiguration";

interface OffererSolicitationChatProps {
    chatEmptyDesc: string
}

function OffererSolicitationChat({chatEmptyDesc}: OffererSolicitationChatProps) {
    const { hasWritePermission } = useSecurityObject();
    const {navigate} = useAppNavigation();
    const {solicitation, flags, permissionWorkflowCode, isCommercialResponsible} = useSolicitation();
    const offerer = useContext(OffererContext)
    const offererBase = offerer[EntityWithIdFields.Id] === solicitation?.[SolicitationViewDTOFields.OffererId]

    const handleNavigateToProgress = (solicitationId: number) => {
        navigate(
            OffererRoute.OffererSolicitationDetailProgress,
            { solicitationId: solicitationId as number },
            { aptitud: CryptoJSHelper.encryptRoute(SolicitationAnalysisStates.Suitable) },
            { replace: true }
        );
    }
    
    const chatEmptyComponent = useMemo(() => {
        if (!solicitation || !flags || flags[SolicitationFlagsFields.SolicitationChatEditionAllowed])
            return null;

        if (
            SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.ReceptionProposal) ||
            SolicitationHelper.isTabActive(solicitation, SolicitationOffererTabs.AdmissionProposal)
        )        
            return (
                <Stack justifySelf={'center'}
                       maxWidth={{xs: 'auto', md: '70%'}}
                >
                    <EmptyStateBox variant={EmptyStateBoxVariant.Chat}
                                   text={'Para iniciar la conversación con la PyME primero deberás dar inicio a la solicitud'}
                                   ImageProps={{sx: {maxWidth: 160}}}
                    >
                        <Button variant={'contained'}
                                size={'medium'}
                                startIcon={<PlayIcon/>}
                                onClick={() => handleNavigateToProgress(solicitation[EntityWithIdFields.Id])}
                                fullWidth
                        >
                            Iniciar la evaluación
                        </Button>
                    </EmptyStateBox>
                </Stack>
            )

        return null;
    }, [flags])

    const editNotAllowedComponent = useMemo(() => {
        if (
            offererBase &&
            !isCommercialResponsible &&
            flags &&
            flags[SolicitationFlagsFields.SolicitationChatEditionAllowed] &&
            hasWritePermission(
                SecurityComponents.OffererSolicitationNavHeader,
                OffererSolicitationNavHeaderSecObjects.AssignmentResponsibleCommercialSolicitationButton
            )
        ) {
            return (
                <OffererSolicitationAssignmentActionWrapper
                    variant={OffererSolicitationAssignmentActionVariant.Commercial}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'}
                           sx={{backgroundColor: 'white !important', borderRadius: '16px'}}>
                        <TextField variant={'filled'}
                                   size={'small'}
                                   placeholder={'Escriba un mensaje'}
                                   value={''}
                                   fullWidth
                        />

                        <IconButton variant={'contained'}
                                    color={'primary'}
                        >
                            <SendIcon/>
                        </IconButton>
                    </Stack>
                </OffererSolicitationAssignmentActionWrapper>
            )
        }

        return null;
    }, [offererBase, isCommercialResponsible, flags, permissionWorkflowCode])

    return (
        <ConversationContextProvider
            SentLogoComponent={<OffererLogo offererUrlLogo={solicitation?.[SolicitationViewDTOFields.OffererUrlLogo]} size={'md'}/>}
            ReceivedLogoComponent={<CompanyLogoById companyId={solicitation?.[SolicitationViewDTOFields.CompanyId]} size={'md'}/>}
            FakeInputComponent={editNotAllowedComponent}
        >
            {
                solicitation ?
                    <ChatCard solicitationId={solicitation[EntityWithIdFields.Id]}
                              securityComponent={SecurityComponents.OffererSolicitationActivity}
                              securityObject={OffererSolicitationActivitySecObjects.SendChatOffererButton}
                              editNotAllowed={!flags?.[SolicitationFlagsFields.SolicitationChatEditionAllowed] || (offererBase && !isCommercialResponsible)}
                              emptyMessage={{title: "¡Solicitud recibida!", description: chatEmptyDesc}}
                              emptyComponent={chatEmptyComponent}
                              minHeight={chatEmptyComponent ? 'max-content' : '510px'}
                              maxHeight={'510px'}
                    />
                    :
                    <div/>
            }
        </ConversationContextProvider>
    )
}

export default OffererSolicitationChat;