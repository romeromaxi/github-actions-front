import React, {ReactNode, useContext, useEffect, useRef} from 'react';
import {Box, Button, Stack, Typography} from '@mui/material';
import {ConversationContext} from 'hooks/contexts/ConversationContext';
import {
    ConversationMessageInsert,
    ConversationMessageInsertFields,
    ConversationMessageViewDTOFields,
} from 'types/conversations/conversationMessageData';
import {BaseRequestFields} from 'types/baseEntities';
import ChatMessage from './ChatMessage';
import ChatConversationDetailStyles from './ChatConversationDetail.styles';
import {HttpConversationMessages} from 'http/conversations/httpConversationMessages';
import {SafetyComponent} from '../security';
import {useForm} from "react-hook-form";
import {ControlledTextFieldFilled} from "../forms";
import {AppConfigFields, AppConfigLogosFields} from "../../types/appConfigEntities";
import {WrapperIcons} from "../icons/Icons";
import {SendIcon} from "lucide-react";

interface ChatConversationDetailProps {
    conversationId: number;
    securityComponent?: string;
    securityObject?: string;
    editNotAllowed?: boolean;
    emptyMessage?: { title?: string, description?: string };
    emptyComponent?: ReactNode;
    onFinishReload?: () => void
}

interface ChatMessageForm {
    [ConversationMessageInsertFields.Message]: string
}

const ChatConversationDetail = ({
                                    conversationId,
                                    securityComponent,
                                    securityObject,
                                    editNotAllowed,
                                    emptyComponent, emptyMessage, onFinishReload
                                }: ChatConversationDetailProps) => {
    const {messages, getMessages, FakeInputComponent} = useContext(ConversationContext);

    const classes = ChatConversationDetailStyles();

    const methods = useForm<ChatMessageForm>()

    const watchMessage = methods.watch(ConversationMessageInsertFields.Message)

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (chatContainerRef.current && messagesContainerRef.current) {
            const {scrollTop} = chatContainerRef.current;
            if (scrollTop > 10) {
                messagesContainerRef.current.classList.add('scrolled');
            } else {
                messagesContainerRef.current.classList.remove('scrolled');
            }
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }

        if (!!emptyComponent && onFinishReload) onFinishReload();
        else if (messages && messages.length !== 0 && onFinishReload) onFinishReload()
    }, [messages, onFinishReload]);


    useEffect(() => {
        getMessages(conversationId);
    }, [conversationId]);

    const sendMessage = async (data: ChatMessageForm) => {

        const message: ConversationMessageInsert = {
            [ConversationMessageInsertFields.Message]: data[ConversationMessageInsertFields.Message],
            [BaseRequestFields.ModuleCode]: 1,
            [BaseRequestFields.OriginCode]: 1,
        };

        HttpConversationMessages.postSingleMessageByConversationId(
            conversationId,
            message,
        ).then(() => {
            getMessages(conversationId);
        });

        methods.setValue(ConversationMessageInsertFields.Message, '')

    };

    const formSendComponent = (
        <form onSubmit={methods.handleSubmit(sendMessage)}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}
                   sx={{backgroundColor: 'white !important', borderRadius: '16px'}}>
                <ControlledTextFieldFilled
                    id="outlined-multiline-flexible"
                    control={methods.control}
                    name={ConversationMessageInsertFields.Message}
                    placeholder="Escriba un mensaje"
                    fullWidth
                    sx={{borderRadius: '100px !important'}}
                />
                <Button variant={'contained'}
                        color={'primary'}
                        startIcon={<WrapperIcons Icon={SendIcon} sx={{marginLeft: 4}} size={'md'}/>}
                        type={'submit'}
                        disabled={!watchMessage || watchMessage == ''}
                        sx={{borderRadius: '100px', '& .MuiButton-startIcon': {marginRight: 0}}}
                />
            </Stack>
        </form>
    );

    return (
        <>
            <main className={classes.main} ref={chatContainerRef} onScroll={handleScroll}>
                <div className={classes.messagesContainer} ref={messagesContainerRef}>
                    {messages && (
                        messages.length !== 0 ?
                            <Stack spacing={1.15}>
                                {messages.map((msg, idx) => (
                                    <ChatMessage
                                        text={msg[ConversationMessageViewDTOFields.Message]}
                                        transmitter={msg[ConversationMessageViewDTOFields.IsItOwnMessage]}
                                        receiver={msg[ConversationMessageViewDTOFields.UserName]}
                                        date={msg[ConversationMessageViewDTOFields.Date]}
                                        userId={msg[ConversationMessageViewDTOFields.UserId]}
                                        key={`chatMsg_${idx}`}
                                    />
                                ))}
                            </Stack>
                            :
                            emptyComponent ?? <Stack spacing={2}>
                                <Box
                                    component={'img'}
                                    sx={{
                                        height: 110,
                                        width: 180
                                    }}
                                    src={(window as any).APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                                />
                                <Typography variant={'h4'}
                                            fontWeight={500}>{emptyMessage?.title || "Solicitud recibida y bajo análisis"}</Typography>
                                <Typography color={'text.lighter'}>
                                    {emptyMessage?.description || "Este es el inicio de tu chat para la línea que solicitaste. Acá vas a poder hacer seguimiento de todo el proceso con tu ejecutivo."}
                                </Typography>
                            </Stack>
                    )}
                </div>
            </main>
            
            {
                (!!FakeInputComponent || !editNotAllowed) &&
                    <Box className={classes.inputBlock}>
                        {
                            !!FakeInputComponent ?
                                FakeInputComponent
                                : 
                                !editNotAllowed ? 
                                    (securityComponent && securityObject) ?
                                        <SafetyComponent componentName={securityComponent} 
                                                         objectName={securityObject}
                                        >
                                            {formSendComponent}
                                        </SafetyComponent>
                                        :
                                        formSendComponent 
                                    : 
                                    <React.Fragment />
                        }
                    </Box>
            }
            
        </>
    );
};

export default ChatConversationDetail;