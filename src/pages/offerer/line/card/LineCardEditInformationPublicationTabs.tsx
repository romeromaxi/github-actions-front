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
import LineProductAttributesTab from './LineProductAttributesTab';
import LineProductEditorHtmlTab from './LineProductEditorHtmlTab';
import LineProductRequisitesTab from './LineProductRequisitesTab';
import {
  ProductLineDescriptionsFields,
  ProductLineFields,
  ProductLineRequisiteView,
} from 'types/lines/productLineData';
import { LineCardEditContext } from './LineCardEdit';
import { Skeleton } from '@mui/lab';
import HelperInputText from 'components/text/HelperInputText';

interface LineCardEditInformationPublicationTabsProps {
  requisites?: ProductLineRequisiteView[];
}

function LineCardEditInformationPublicationTabs({
  requisites,
}: LineCardEditInformationPublicationTabsProps) {
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
              Información para la publicación de líneas
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
                    {
                      label: 'Descripción comercial',
                      default: true,
                      content: (
                        <LineProductEditorHtmlTab
                          name={`${ProductLineFields.ProductLineDescriptions}.${ProductLineDescriptionsFields.CommercialDescription}`}
                          helperText={
                            'Ingresar toda la información comercial asociada a la línea'
                          }
                        />
                      ),
                    },
                    {
                      label: 'Atributos de las líneas',
                      default: false,
                      content: <LineProductAttributesTab />,
                    },
                    {
                      label: 'Pymes destinatarias',
                      default: false,
                      content: (
                        <LineProductRequisitesTab requisites={requisites} />
                      ),
                    },
                    {
                      label: 'Disclaimer',
                      default: false,
                      content: (
                        <LineProductEditorHtmlTab
                          name={`${ProductLineFields.ProductLineDescriptions}.${ProductLineDescriptionsFields.Disclaimer}`}
                          helperText={
                            'Indicar toda la información adicional o notas que complemente la línea'
                          }
                        />
                      ),
                    },
                    {
                      label: 'Garantías',
                      default: false,
                      content: <HelperInputText text={'En construcción...'} />,
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

export default LineCardEditInformationPublicationTabs;
