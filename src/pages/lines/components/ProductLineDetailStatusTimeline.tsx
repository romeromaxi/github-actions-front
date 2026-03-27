import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import { RefreshIconButton } from '../../../components/buttons/Buttons';
import TimelineSkeleton from '../../offerer/components/OffererSolicitation/OffererSolicitationEvent/TimelineSkeleton';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  timelineContentClasses,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { SolicitationEventViewFields } from '../../../types/solicitations/solicitationEventData';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import React from 'react';
import { useProductLineDetail } from '../ProductLineDetailContext';
import { ProductLineStatusHistoryFields } from '../../../types/lines/productLineData';
import { ProductLineStatesTimeDotColorMapByNumber } from '../../../util/typification/productLineColors';

function ProductLineDetailStatusTimeline() {
  const { listStatus, reloadStatus } = useProductLineDetail();
  const loading = !listStatus;

  return (
    <Card>
      <CardHeader
        title={'Historial'}
        subheader={'Últimas actividades'}
        action={<RefreshIconButton onClick={reloadStatus} sx={{ mt: 1 }} />}
      />
      <CardContent sx={{ p: 0 }}>
        {loading ? (
          <TimelineSkeleton />
        ) : (
          <Stack direction={'row'} justifyContent={'flex-start'}>
            <Timeline
              position={'left'}
              sx={{
                [`& .${timelineContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              {listStatus.map((event, index) => {
                return (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent sx={{ pr: 0, mt: 0.3 }}>
                      <Typography variant={'subtitle1'}>
                        {
                          event[
                            ProductLineStatusHistoryFields.ProductLineStatusDesc
                          ]
                        }
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        variant={'outlined'}
                        color={
                          ProductLineStatesTimeDotColorMapByNumber(
                            event[
                              ProductLineStatusHistoryFields
                                .ProductLineStatusCode
                            ],
                          ) || 'grey'
                        }
                        sx={{ borderWidth: 2.5 }}
                      />
                      {index + 1 < listStatus.length && (
                        <TimelineConnector sx={{ mb: -1, mt: -1 }} />
                      )}
                    </TimelineSeparator>
                    <TimelineContent sx={{ pl: 0, mt: 0.3 }}>
                      <Stack direction={'column'}>
                        <Typography variant={'subtitle2'}>
                          {dateFormatter.toShortDate(
                            event[SolicitationEventViewFields.Date],
                          )}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#A1A5B7',
                            fontSize: '0.75rem',
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {event[ProductLineStatusHistoryFields.UserName]}
                        </Typography>
                      </Stack>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default ProductLineDetailStatusTimeline;
