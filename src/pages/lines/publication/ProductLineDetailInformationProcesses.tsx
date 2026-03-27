import LineProductEditorHtmlTab from '../../offerer/line/card/LineProductEditorHtmlTab';
import {
  ProductLineDescriptionsFields,
  ProductLineFields,
} from '../../../types/lines/productLineData';
import { NavsTabHorizontal } from '../../../components/navs/NavsTab';
import React from 'react';
import { Grid } from '@mui/material';

function ProductLineDetailInformationProcesses() {
  return (
    <Grid container spacing={2} mt={5}>
      <Grid item xs={12}>
        <NavsTabHorizontal
          fullWidth
          lstTabs={[
            {
              tabList: [
                /*{
                              label: "Envío de la Solicitud", default: true,
                              content: <LineCardEditSelectFileTypeTabs />
                        },*/
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
      </Grid>
    </Grid>
  );
}

export default ProductLineDetailInformationProcesses;
