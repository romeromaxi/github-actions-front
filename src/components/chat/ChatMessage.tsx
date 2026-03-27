import { useContext } from 'react';
import {differenceInDays} from "date-fns";
import clsx from "clsx";
import {Box, Stack} from '@mui/material';
import ChatMessageStyles from './ChatMessage.styles';
import {dateFormatter} from 'util/formatters/dateFormatter';
import { userStorage } from 'util/localStorage/userStorage';
import {TypographyBase} from "../misc/TypographyBase";
import { ConversationContext } from 'hooks/contexts/ConversationContext';
import {stringFormatter} from "util/formatters/stringFormatter";

interface ChatMessageProps {
  text: string;
  transmitter: boolean;
  receiver: string;
  date: Date;
  userId: number;
  isLastReceivedMessage?: boolean;
}

const ChatMessage = ({
      text,
      transmitter,
      receiver,
      date,
      userId, 
      isLastReceivedMessage
}: ChatMessageProps) => {
  const classes = ChatMessageStyles();
  const currentUserId = userStorage.getUserId()
  const messageSentByCurrentUser: boolean = transmitter && userId === currentUserId;
  const { SentLogoComponent, ReceivedLogoComponent } = useContext(ConversationContext);
  
  const getDateByDifference = () => {
      const today = new Date()
      const msgDate = new Date(date)
      const diff = differenceInDays(today, msgDate)
      
      if (diff > 1) return dateFormatter.toLongDate(date)
      if (diff == 1) return `Ayer, ${dateFormatter.toClockFormat(date)}`
      return `Hoy, ${dateFormatter.toClockFormat(date)}`
  }
  
  return (
    <Stack spacing={0} sx={{ width: '100%' }}>
      <Box className={transmitter ? classes.sentContainer : classes.receivedContainer}
           width={'100%'}
      >
          <Stack>
              <TypographyBase className={clsx(classes.messageTypographyBase, {
                                [classes.sentTypography]: transmitter,
                                [classes.receivedTypography]: !transmitter,
                                [classes.receivedUnreadMessage]: !transmitter && isLastReceivedMessage,
                              })}
                              variant={'caption'}
                              fontWeight={500}
                              sx={{ wordBreak: 'auto-phrase' }}
              >
                  <TypographyBase variant="body2" fontWeight={600}>
                      {messageSentByCurrentUser ? 'Tú' : stringFormatter.toTitleCase(receiver)}
                  </TypographyBase>
                  <div
                      dangerouslySetInnerHTML={{
                          __html: text.replaceAll("\\n", '<br />'),
                      }}
                  />
              </TypographyBase>
              <TypographyBase variant={'body3'} color={'text.lighter'} sx={{textAlign: !transmitter ? 'end !important' : 'start !important'}}>
                  {getDateByDifference()}
              </TypographyBase>
          </Stack>
          <Box sx={{ marginLeft: transmitter ? 0 : 1, marginRight: transmitter ? 1 : 0 }}>
              {
                  !transmitter && ReceivedLogoComponent ? (
                      <>{ReceivedLogoComponent}</>
                  ) : null
              }

              {
                  transmitter && SentLogoComponent ? (
                      <>{SentLogoComponent}</>
                  ) : null
              }
          </Box>
      </Box>

        <Stack direction={transmitter ? 'row-reverse' : 'row'}
               spacing={0.8} 
             mb={'0.5rem'} 
             alignItems={'center'}
      >
          
      </Stack>
    </Stack>
  );
};

export default ChatMessage;
