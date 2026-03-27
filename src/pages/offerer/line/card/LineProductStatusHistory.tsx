import React, { useContext } from 'react';
import { LineCardEditContext } from './LineCardEdit';
import FilterProductBaseAccordionStyles from '../../../markets/lines/filter/FilterProductBaseAccordion.styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
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
import { dateFormatter } from 'util/formatters/dateFormatter';
import { ProductLineStatusHistoryFields } from 'types/lines/productLineData';
import { ProductLineStatesTimeDotColorMapByNumber } from 'util/typification/productLineColors';

export default function LineProductStatusHistory() {
  const { statusHistory } = useContext(LineCardEditContext);
  const classes = FilterProductBaseAccordionStyles();
  const hasHistory: boolean = statusHistory.length > 1;

  return hasHistory ? (
    <Accordion className={classes.accordionRoot} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        className={classes.accordionSummary}
      >
        <Grid container alignItems={'center'}>
          <Grid item>
            <Typography fontSize={16} fontWeight={600}>
              Historial
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails className={classes.accordionDetail}>
        <Grid container spacing={2} mt={1} pl={5} pr={5}>
          <Stack direction={'row'} justifyContent={'flex-start'}>
            <Timeline
              position={'left'}
              sx={{
                [`& .${timelineContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              {statusHistory.map((event, index) => {
                return (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent sx={{ pr: 0, mt: 0.3 }}>
                      <Stack direction={'column'} spacing={1}>
                        <Typography
                          variant={'subtitle1'}
                          fontWeight={500}
                          fontSize={'0.985rem'}
                        >
                          {event[ProductLineStatusHistoryFields.UserName]}
                        </Typography>

                        <Typography
                          fontStyle={'italic'}
                          fontWeight={300}
                          fontSize={'0.975rem'}
                          color={'text.disabled'}
                          sx={{ overflowWrap: 'anywhere' }}
                        >
                          {event[ProductLineStatusHistoryFields.Observations] ||
                            ''}
                        </Typography>
                      </Stack>
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
                      {index + 1 < statusHistory.length && (
                        <TimelineConnector sx={{ mb: -1, mt: -1 }} />
                      )}
                    </TimelineSeparator>
                    <TimelineContent sx={{ pl: 0, mt: 0.3 }}>
                      <Stack direction={'column'}>
                        <Typography variant={'subtitle2'}>
                          {dateFormatter.toShortDate(
                            event[ProductLineStatusHistoryFields.Date],
                          )}
                        </Typography>
                        <Typography
                          fontSize={'0.85rem'}
                          color={'text.disabled'}
                          sx={{ overflowWrap: 'anywhere' }}
                        >
                          {
                            event[
                              ProductLineStatusHistoryFields
                                .ProductLineStatusDesc
                            ]
                          }
                        </Typography>
                      </Stack>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Stack>
        </Grid>
      </AccordionDetails>
    </Accordion>
  ) : (
    <></>
  );
}
