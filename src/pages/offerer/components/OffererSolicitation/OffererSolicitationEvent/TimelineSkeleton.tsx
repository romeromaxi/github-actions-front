import React from 'react';
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
import { Skeleton, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

interface TimelineSkeletonProps {
  length?: number;
}

function TimelineSkeleton({ length }: TimelineSkeletonProps) {
  return (
    <Stack direction={'row'} justifyContent={'flex-start'}>
      <Timeline
        position={'left'}
        sx={{
          [`& .${timelineContentClasses.root}`]: {
            flex: 0.2,
          },
        }}
      >
        {[...Array(length || 5)].map((e, index) => {
          return (
            <TimelineItem key={index}>
              <TimelineOppositeContent sx={{ pr: 0, mt: 0.3 }}>
                <Typography variant={'subtitle1'}>
                  <Skeleton />
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  variant={'outlined'}
                  sx={{
                    borderColor: grey[400],
                    borderWidth: 2.5,
                  }}
                />
                {index + 1 < (length || 5) && (
                  <TimelineConnector sx={{ mb: -1, mt: -1 }} />
                )}
              </TimelineSeparator>
              <TimelineContent sx={{ pl: 0, mt: 0.3 }}>
                <Stack direction={'column'}>
                  <Typography variant={'subtitle2'}>
                    <Skeleton />
                  </Typography>
                  <Typography sx={{ color: '#A1A5B7', fontSize: '0.75rem' }}>
                    <Skeleton />
                  </Typography>
                </Stack>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Stack>
  );
}

export default TimelineSkeleton;
