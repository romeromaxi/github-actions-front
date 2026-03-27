import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  ConversationViewDTO,
  ConversationViewDTOFields,
} from '../../../../../types/conversations/conversationData';
import OffererSolicitationEventTimeline from '../OffererSolicitationEvent/OffererSolicitationEventTimeline';
import { SolicitationViewDTO } from '../../../../../types/solicitations/solicitationData';
import { EntityWithIdFields } from '../../../../../types/baseEntities';
import { dateFormatter } from '../../../../../util/formatters/dateFormatter';
import { stringFormatter } from '../../../../../util/formatters/stringFormatter';

interface OffererSolicitationAssessmentRightPanelProps {
  solicitation: SolicitationViewDTO;
  data?: boolean;
  variant?: 'offerer' | 'company';
}

const OffererSolicitationAssessmentRightPanel = ({
  solicitation,
  data,
  variant = 'offerer',
}: OffererSolicitationAssessmentRightPanelProps) => {
  const [conversationId, setConversationId] = useState<number>();
  const [conversations, setConversations] = useState<ConversationViewDTO[]>([]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextConversationId: number,
  ) => {
    setConversationId(nextConversationId);
  };

  const stringAvatar = (name: string) => {
    let children: string = '';
    if (name.split(' ')[0][0] && name.split(' ')[2][0]) {
      children = `${name.split(' ')[0][0]}${name.split(' ')[2][0]}`;
    } else if (name.split(' ')[0][0] && name.split(' ')[1][0]) {
      children = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
    } else {
      children = `${name[0]}`;
    }
    return {
      sx: {
        bgcolor: '#2196f3',
      },
      children: children,
    };
  };

  return (
    <Stack spacing={2}>
      {variant === 'offerer' && (
        <Card>
          <CardHeader
            title={'Chat con el equipo'}
            subheader={
              conversations.length !== 0
                ? 'Presione una conversación para chatear'
                : ''
            }
          />
          <CardContent sx={{ paddingRight: 0, paddingLeft: 0 }}>
            {conversations.length !== 0 ? (
              <ToggleButtonGroup
                color={'primary'}
                orientation="vertical"
                value={conversationId}
                exclusive
                onChange={handleChange}
                fullWidth
              >
                {conversations.map((chat, idx) => (
                  <ToggleButton
                    value={chat[EntityWithIdFields.Id]}
                    key={idx}
                    fullWidth
                  >
                    <Stack spacing={0.5}>
                      <Stack
                        direction={'row'}
                        spacing={1}
                        alignItems={'center'}
                      >
                        <Avatar
                          {...stringAvatar(
                            `${chat[ConversationViewDTOFields.ConversationTypeDesc]}`,
                          )}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Typography
                          fontSize={12}
                          color={'#A1A5B7 !important'}
                          fontWeight={600}
                        >
                          {dateFormatter.toShortDate(
                            chat[ConversationViewDTOFields.StartDate],
                          )}
                        </Typography>
                      </Stack>
                      <Tooltip
                        title={chat[ConversationViewDTOFields.Title]}
                        inputMode={'text'}
                        placement={'top'}
                      >
                        <Box sx={{ height: '50%' }}>
                          <Typography
                            fontSize={12}
                            fontWeight={600}
                            textAlign={'start'}
                          >
                            {stringFormatter.cutIfHaveMoreThan(
                              chat[ConversationViewDTOFields.Title],
                              24,
                            )}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Stack>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            ) : (
              <Typography fontSize={14} fontWeight={500} textAlign={'center'}>
                Aún no hay conversaciones con el equipo
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      <OffererSolicitationEventTimeline
        solicitationId={solicitation[EntityWithIdFields.Id]}
        variant={variant}
      />
    </Stack>
  );
};

export default OffererSolicitationAssessmentRightPanel;
