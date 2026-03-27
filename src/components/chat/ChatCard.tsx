import {ReactNode, useContext, useEffect, useState} from 'react';
import { Skeleton } from '@mui/lab';
import {Box, Card, CardContent, CardHeader} from '@mui/material';

import { EntityWithIdFields } from 'types/baseEntities';
import { ConversationContext } from 'hooks/contexts/ConversationContext';
import ChatConversationDetail from './ChatConversationDetail';
import {BaseIconWrapper} from "../icons/Icons";
import {ChatCircleText} from "phosphor-react";

interface ChatCardProps {
  solicitationId?: number;
  productLineId?: number;
  title?: string;
  securityComponent?: string;
  securityObject?: string;
  editNotAllowed?: boolean;
  emptyMessage?: { title?: string, description?: string  };
  emptyComponent?: ReactNode;
  hiddenIcon?: boolean;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
}

const ChatCard = ({
  solicitationId,
  productLineId,
  title,
  securityComponent,
  securityObject,
  editNotAllowed,
  emptyMessage,
  emptyComponent,
  hiddenIcon,
  height = '650px',
  minHeight,
  maxHeight
}: ChatCardProps) => {
  const { conversation, getCurrentConversation, readConversation } =
    useContext(ConversationContext);
  const [conversationId, setConversationId] = useState<number>();
  const [renderTitle, setRenderTitle] = useState<boolean>(false)

  useEffect(() => {
    const relatedId: number = !!solicitationId
      ? solicitationId
      : productLineId || 0;

    if (!!relatedId) getCurrentConversation(relatedId, !!solicitationId);
  }, [solicitationId, productLineId]);

  useEffect(() => {
    if (conversation) {
      readConversation();
      setConversationId(conversation[EntityWithIdFields.Id]);
    }
  }, [conversation]);
  
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', minHeight: minHeight, maxHeight: maxHeight, height: '100%', width: '100%' }}>
        {title && renderTitle &&
            <CardHeader title={title}
                        avatar={!hiddenIcon ? <BaseIconWrapper Icon={ChatCircleText} size={'md'} bg={'#F7FAFC'} /> : undefined}
                        sx={{ alignItems: 'center', flexShrink: 0 }}
            />
        }
        
      <CardContent sx={{ flex: 1, position: 'relative', p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box
              sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '65px',
                  zIndex: 2,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
              }}
          />
          
            {conversationId ? (
              <ChatConversationDetail
                conversationId={conversationId}
                securityComponent={securityComponent}
                securityObject={securityObject}
                editNotAllowed={editNotAllowed}
                emptyMessage={emptyMessage}
                emptyComponent={emptyComponent}
                onFinishReload={() => setRenderTitle(true)}
              />
            ) : (
              <Skeleton />
            )}
      </CardContent>
    </Card>
  );
};

export default ChatCard;
