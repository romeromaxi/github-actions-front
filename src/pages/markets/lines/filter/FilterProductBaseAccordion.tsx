import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
    Divider,
  Stack,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material/';
import FilterProductBaseAccordionStyles from './FilterProductBaseAccordion.styles';

interface FilterProductBaseAccordionProps {
  title: string;
  isApplied?: boolean;
  length?: number;
  children?: React.ReactNode;
}

function FilterProductBaseAccordion(props: FilterProductBaseAccordionProps) {
  const classes = FilterProductBaseAccordionStyles();

  return (
      <React.Fragment>
          <Accordion className={classes.accordionRoot} defaultExpanded={props.isApplied}>
              <AccordionSummary
                  expandIcon={<ExpandMore sx={{color: 'black'}}/>}
                  className={classes.accordionSummary}
              >
                  <Stack direction={'row'} spacing={1}>
                      <Stack direction={'row'} spacing={1} alignItems={'baseline'}>
                          <Typography 
                              fontWeight={600} 
                              fontSize={'16px'}
                              color={props.isApplied ? 'primary' : 'inherit'}
                          >
                              {props.title}
                          </Typography>
                      </Stack>
                  </Stack>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionDetail}>
                  {props.children}
              </AccordionDetails>
          </Accordion>
      </React.Fragment>
  );
}

export default FilterProductBaseAccordion;
