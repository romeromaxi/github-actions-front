import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {Alert, Card, CardContent, CardHeader, Grid} from '@mui/material';

import { LineProductAttributesComponents } from './LineProductAttributesForm';

import { ProductLineFields } from 'types/lines/productLineData';
import { LineProductField } from 'types/lines/productLineAttibutesData';
import { HttpProductLine } from 'http/index';

function LineProductAttributesTab() {
  const { watch } = useFormContext();
  const watchProductTemplateCode = watch(ProductLineFields.ProductTemplateCode);

  const [lineFields, setLineFields] = useState<LineProductField[]>();

  useEffect(() => {
    if (watchProductTemplateCode)
      HttpProductLine.getFieldsByProductTemplateCode(
        watchProductTemplateCode,
      ).then(setLineFields);
  }, [watchProductTemplateCode]);
  
  return (
      <Card>
          <CardHeader title='Características'/>
          <CardContent>
              <Grid container spacing={1}>
                  <Grid item xs={12}>
                      <Alert color='info' severity='info'>
                          Ingresar los atributos que van a ser mostrados en la descripción resumida de la línea.
                      </Alert>
                  </Grid>

                  {lineFields ? (
                      lineFields.length ? (
                          <LineProductAttributesComponents listProductFields={lineFields} />
                      ) : (
                          <></>
                      )
                  ) : (
                      <div>Cargando...</div>
                  )}
              </Grid>
          </CardContent>
      </Card>
  );
}

export default LineProductAttributesTab;
