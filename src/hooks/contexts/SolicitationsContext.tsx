import {ReactNode, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    SolicitationFlags,
    SolicitationOffererResultView,
    SolicitationViewDTO,
    SolicitationViewDTOFields,
    SolicitationHistoryView,
} from 'types/solicitations/solicitationData';
import {HttpMessage, HttpSolicitation} from 'http/index';
import {Outlet, useLocation, useNavigate, useOutletContext} from 'react-router-dom';
import {useAction} from "../useAction";
import useAxios from "../useAxios";
import {MessageFields, MessageView} from "types/workflow/messageData";
import {userStorage} from "util/localStorage/userStorage";
import {EntityWithIdFields} from "types/baseEntities";
import {useLogoutActions} from "../useLogoutActions";
import {OffererContext} from "../../pages/offerer/components/OffererContextProvider";
import {SolicitationTypes} from "../../types/solicitations/solicitationEnums";
import {SolicitationEventView} from "../../types/solicitations/solicitationEventData";
import {HttpSolicitationEvent} from "../../http/solicitations/httpSolicitationEvent";

type SolicitationContextType = {
    solicitation: SolicitationViewDTO | undefined;
    setSolicitation: (arg: SolicitationViewDTO) => {};
    getSolicitation: (id: number, readMessage?: boolean) => {};
    loadingSolicitation: boolean;
    flags: SolicitationFlags | undefined;
    isStageResponsible: boolean;
    isCommercialResponsible: boolean;
    message: MessageView | undefined;
    permissionWorkflowCode: number;
    betweenOfferers: boolean;
    offererBase: boolean;
    reloadSolicitation: (clearPrevStates?: boolean) => {};
    eventList: SolicitationEventView[] | undefined;
    loadingEvents: boolean;
    offererResult: SolicitationOffererResultView | undefined;
    historyList: SolicitationHistoryView[] | undefined;
    loadingHistory: boolean;
};

type ProviderProps = {
    children?: ReactNode;
};

const SolicitationsContextProvider = ({children}: ProviderProps) => {
    const location = useLocation();
    const {fetchData} = useAxios();
    const {snackbarWarning} = useAction();
    const {addLogoutAction, removeAndExecuteLogoutAction} = useLogoutActions();
    const offerer = useContext(OffererContext)
    const navigate = useNavigate();
    const userId = userStorage.getUserId() ?? -1;
    const prevMessageIdRef = useRef<number | undefined>(undefined);

    const [loadingSolicitation, setLoadingSolicitation] =
        useState<boolean>(false);
    const [solicitation, setSolicitation] = useState<SolicitationViewDTO>();
    const [flags, setFlags] = useState<SolicitationFlags>();
    const [isCommercialResponsible, setIsCommercialResponsible] = useState<boolean>(false);
    const [message, setMessage] = useState<MessageView>();
    const [eventList, setEventList] = useState<SolicitationEventView[]>();
    const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
    const [offererResult, setOffererResult] = useState<SolicitationOffererResultView>();
    const [historyList, setHistoryList] = useState<SolicitationHistoryView[]>();
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

    const afterSolicitation = (
        solicitationResponse: SolicitationViewDTO | undefined,
        flagsResponse: SolicitationFlags | undefined,
        messageResponse: MessageView | undefined = undefined
    ) => {
        const commercialResponsible = solicitationResponse?.[SolicitationViewDTOFields.CommercialResponsibleUserId] ?? 0;
        setSolicitation(solicitationResponse);
        setFlags(flagsResponse);
        setIsCommercialResponsible(!!commercialResponsible && commercialResponsible === userId);
        prevMessageIdRef.current = messageResponse?.[EntityWithIdFields.Id] || undefined;
        setMessage(messageResponse);
        setLoadingSolicitation(false);
    }

    const getSolicitation = (solicitationId: number, clearPrevStates: boolean = true) => {
        if (clearPrevStates) {
            setLoadingSolicitation(true);
            setSolicitation(undefined);
            removeAndExecuteLogoutAction(handleUnload);
        }
        
        Promise.all([
            HttpSolicitation.getById(solicitationId),
            HttpSolicitation.getSolicitationFlags(solicitationId),
        ]).then(([solicitationResponse, flagsResponse]) => {
            const offererBase = offerer[EntityWithIdFields.Id] === solicitationResponse[SolicitationViewDTOFields.OffererId]
            if (offererBase) {
                fetchData(() =>
                    HttpMessage.readMessage(
                        solicitationResponse[SolicitationViewDTOFields.MessageId] ?? 0,
                    ),
                )
                    .then((responseMessage: MessageView) => {
                        afterSolicitation(solicitationResponse, flagsResponse, responseMessage)
                        if (responseMessage[MessageFields.Warning] && responseMessage[MessageFields.Warning] !== '')
                            snackbarWarning(responseMessage[MessageFields.Warning]);
                    })
                    .catch(() => navigate(-1));
            } else {
                afterSolicitation(solicitationResponse, flagsResponse)
            }
        });
        
        loadOffererResult(solicitationId);
        loadEventList(solicitationId);
        loadHistoryList(solicitationId);
    };

    const loadOffererResult = (solicitationId: number) => {
        setOffererResult(undefined);
        HttpSolicitation.getOffererResult(solicitationId)
            .then(setOffererResult)
    };
    
    const loadEventList = (solicitationId: number) => {
        setLoadingEvents(true);
        setEventList(undefined);
        HttpSolicitationEvent.getEventList(solicitationId)
            .then(setEventList)
            .finally(() => setLoadingEvents(false));
    };
    
    const loadHistoryList = (solicitationId: number) => {
        setLoadingHistory(true);
        setHistoryList(undefined);
        HttpSolicitation.getOffererHistory(solicitationId)
            .then(setHistoryList)
            .finally(() => setLoadingHistory(false));
    };
    
    const reloadSolicitation = (clearPrevStates: boolean = false) => {
        if (!solicitation || !solicitation[EntityWithIdFields.Id])
            return;
        
        getSolicitation(solicitation[EntityWithIdFields.Id], clearPrevStates);
    }

    const handleUnload = useCallback(async () => {
        const prevMessageId = prevMessageIdRef.current;
        if (message && prevMessageId && prevMessageIdRef !== message[EntityWithIdFields.Id])
            return await closeMessage(message[EntityWithIdFields.Id]);
    }, [message, prevMessageIdRef])

    const closeMessage = async (messageId: number) => fetchData(() => HttpMessage.closeMessage(messageId), true);

    useEffect(() => {
        if (message && message[EntityWithIdFields.Id]) {
            addLogoutAction(handleUnload);

            return () => removeAndExecuteLogoutAction(handleUnload);
        }
    }, [location.pathname, message]);

    return (
        <Outlet
            context={{
                solicitation,
                setSolicitation,
                getSolicitation,
                reloadSolicitation,
                loadingSolicitation,
                flags,
                isCommercialResponsible,
                message,
                isStageResponsible: solicitation?.[SolicitationViewDTOFields.StageResponsibleUserId] === userId,
                permissionWorkflowCode: message?.[MessageFields.PermissionTypeCode] ?? 0,
                betweenOfferers:
                    solicitation?.[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.BetweenOfferers,
                offererBase:
                    offerer[EntityWithIdFields.Id] === solicitation?.[SolicitationViewDTOFields.OffererId],
                eventList,
                loadingEvents,
                offererResult: offererResult,
                historyList,
                loadingHistory
            }}
        />
    );
};

export default SolicitationsContextProvider;

export function useSolicitation() {
    return useOutletContext<SolicitationContextType>();
} 
