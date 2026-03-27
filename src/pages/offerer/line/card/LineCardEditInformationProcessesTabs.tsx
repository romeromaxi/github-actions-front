import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import FilterProductBaseAccordionStyles from '../../../markets/lines/filter/FilterProductBaseAccordion.styles';
import { NavsTabHorizontal } from 'components/navs/NavsTab';
import { ExpandMore } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import LineProductEditorHtmlTab from './LineProductEditorHtmlTab';
import {
  ProductLineDescriptionsFields,
  ProductLineFields,
} from 'types/lines/productLineData';
import { LineCardEditContext } from './LineCardEdit';
import { Skeleton } from '@mui/lab';

function LineCardEditInformationProcessesTabs() {
  const { loading, statusHistory } = useContext(LineCardEditContext);
  const classes = FilterProductBaseAccordionStyles();
  const hasHistory: boolean = statusHistory.length > 1;
  const [expanded, setExpanded] = useState<boolean>(true);

  const toggleExpanded = () => setExpanded(!expanded);

  useEffect(() => {
    if (hasHistory) setExpanded(false);
  }, [hasHistory]);

  return (
    <Accordion
      className={classes.accordionRoot}
      expanded={expanded}
      onChange={toggleExpanded}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        className={classes.accordionSummary}
      >
        <Grid container alignItems={'center'}>
          <Grid item>
            <Typography fontSize={16} fontWeight={600}>
              Información para los procesos de:
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails className={classes.accordionDetail}>
        <Grid container spacing={2} mt={3.5} pl={5} pr={5}>
          {loading ? (
            <Skeleton width={'100%'} />
          ) : (
            <NavsTabHorizontal
              fullWidth
              lstTabs={[
                {
                  tabList: [
                    /*
                                    { 
                                        label: "Envío de la Solicitud", default: true, 
                                        content: <LineCardEditSelectFileTypeTabs />
                                    },
                                     */
                    {
                      label: 'Solicitud de precalificación Digital',
                      default: true,
                      content: (
                        <LineProductEditorHtmlTab
                          name={`${ProductLineFields.ProductLineDescriptions}.${ProductLineDescriptionsFields.PrequalificationDetail}`}
                          helperText={
                            'Información adicional sobre la línea que debe completar la Pyme para poder llevar a cabo el proceso formal de solicitud de línea'
                          }
                        />
                      ),
                    },
                    {
                      label: 'Instrumentación',
                      default: false,
                      content: (
                        <LineProductEditorHtmlTab
                          name={`${ProductLineFields.ProductLineDescriptions}.${ProductLineDescriptionsFields.InstrumentationDetail}`}
                          helperText={
                            'Indicar que debe hacer la pyme o que debe presentar para poder lograr el financiamiento'
                          }
                        />
                      ),
                    },
                  ],
                },
              ]}
            />
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default LineCardEditInformationProcessesTabs;
