import React, {createContext, ReactNode, useState} from 'react';
import {ConversationViewDTO} from 'types/conversations/conversationData';
import {HttpConversation} from 'http/conversations';
import {ConversationMessageViewDTO} from 'types/conversations/conversationMessageData';
import {HttpConversationMessages} from 'http/conversations/httpConversationMessages';
import {EntityWithIdFields} from 'types/baseEntities';

export const ConversationContext = createContext({
    conversation: undefined as ConversationViewDTO | undefined,
    getCurrentConversation: (..._args: any[]) => {
    },
    messages: [] as ConversationMessageViewDTO[],
    getMessages: (..._args: any[]) => {
    },
    readConversation: (..._args: any[]) => {
    },
    SentLogoComponent: undefined as React.ReactNode | undefined,
    ReceivedLogoComponent: undefined as React.ReactNode | undefined,
    FakeInputComponent: undefined as React.ReactNode | undefined,
});


type ProviderProps = {
    children: ReactNode;
    onReadConversation?: () => void;
    SentLogoComponent?: React.ReactNode;
    ReceivedLogoComponent?: React.ReactNode;
    FakeInputComponent?: React.ReactNode;
};

const ConversationContextProvider = ({
                                         children,
                                         onReadConversation,
                                         SentLogoComponent,
                                         ReceivedLogoComponent,
                                         FakeInputComponent
                                     }: ProviderProps) => {
    const [conversation, setConversation] = useState<ConversationViewDTO>();
    const [messages, setMessages] = useState<ConversationMessageViewDTO[]>([]);

    const getMessages = (conversationId: number) => {
        HttpConversationMessages.getByConversationId(conversationId).then(
            setMessages,
        );
    };

    const getCurrentConversation = (
        relatedId: number,
        isSolicitation: boolean = true,
    ) => {
        if (isSolicitation)
            HttpConversation.getCurrentConversationBySolicitationId(relatedId).then(
                setConversation,
            );
        else
            HttpConversation.getCurrentConversationByProductLineId(relatedId).then(
                setConversation,
            );
    };

    const readConversation = () => {
        if (conversation && conversation[EntityWithIdFields.Id])
            HttpConversation.readConversationById(
                conversation[EntityWithIdFields.Id],
            )
                .then(() => {
                    onReadConversation && onReadConversation();
                });
    };

    return (
        <ConversationContext.Provider
            value={{
                conversation,
                getCurrentConversation,
                messages,
                getMessages,
                readConversation,
                SentLogoComponent,
                ReceivedLogoComponent,
                FakeInputComponent
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};

export default ConversationContextProvider;
