import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { Grid, Stack, Tooltip } from '@mui/material';

import {
    ProductLineFields,
    ProductLineFormData,
    ProductLineRequisiteView,
} from 'types/lines/productLineData';
import { ControlledTextFieldFilled } from '../../../../components/forms';
import LineCardEditInformationPublicationTabs from './LineCardEditInformationPublicationTabs';
import LineCardEditInformationProcessesTabs from './LineCardEditInformationProcessesTabs';
import { LineCardEditContext } from './LineCardEdit';
import LineProductStatusHistory from './LineProductStatusHistory';

interface LineCardEditFormContentProps {
  requisites?: ProductLineRequisiteView[];
}

function LineCardEditFormContent({ requisites }: LineCardEditFormContentProps) {
  const { allowEdit } = useContext(LineCardEditContext);
  const methods = useFormContext<ProductLineFormData>();

  return (
    <Stack direction={'column'} gap={2}>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={5}>
          <ControlledTextFieldFilled
            label="Nombre de Línea"
            name={ProductLineFields.Line}
            control={methods.control}
            disabled={!allowEdit}
          />
        </Grid>

        <Tooltip
          title={'Ingrese un breve resumen con la información más relevante'}
        >
          <Grid item xs={7}>
            <ControlledTextFieldFilled
              label="Descripción de la Línea"
              name={ProductLineFields.LineLarge}
              control={methods.control}
              multiline
              rows={3}
              disabled={!allowEdit}
            />
          </Grid>
        </Tooltip>
      </Grid>

      <Grid item xs={12} mt={2}>
        <LineCardEditInformationPublicationTabs requisites={requisites} />
      </Grid>

      <Grid item xs={12} mt={2}>
        <LineCardEditInformationProcessesTabs />
      </Grid>

      <Grid item xs={12} mt={2}>
        <LineProductStatusHistory />
      </Grid>
    </Stack>
  );
}

export default LineCardEditFormContent;
