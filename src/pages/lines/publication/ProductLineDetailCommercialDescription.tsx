import React from 'react';
import {Card, CardHeader, CardContent, Grid} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import {
  ProductLineDescriptionsFields,
  ProductLineFields,
  ProductLineFormData,
} from 'types/lines/productLineData';
import LineProductEditorHtmlTab from '../../offerer/line/card/LineProductEditorHtmlTab';
import { ControlledTextFieldFilled } from 'components/forms';
import { useProductLineDetail } from '../ProductLineDetailContext';
import { Skeleton } from '@mui/lab';

function ProductLineDetailCommercialDescription() {
  const methods = useFormContext<ProductLineFormData>();
  const { allowEdit, loading } = useProductLineDetail();
  
  
  return (
      <Card>
        <CardHeader title='Descripción Comercial'/>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={5}>
                <ControlledTextFieldFilled
                  label="Nombre de Línea"
                  name={ProductLineFields.Line}
                  control={methods.control}
                  disabled={!allowEdit}
                />
              </Grid>

              <Grid item xs={7}>
                <ControlledTextFieldFilled
                    label="Breve bajada comercial"
                    name={ProductLineFields.LineLarge}
                    control={methods.control}
                    multiline
                    rows={3}
                    disabled={!allowEdit}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {loading ? (
                <Skeleton />
              ) : (
                <LineProductEditorHtmlTab
                  name={`${ProductLineFields.ProductLineDescriptions}.${ProductLineDescriptionsFields.CommercialDescription}`}
                  helperText={
                    'Información general: información adicional que quiera destacarse de la línea'
                  }
                />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  );
}

export default ProductLineDetailCommercialDescription;
