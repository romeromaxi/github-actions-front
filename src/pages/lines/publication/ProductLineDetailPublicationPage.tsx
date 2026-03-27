import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Card, CardContent, CardHeader, Grid, Stack} from '@mui/material';
import {AsyncSelect} from "components/forms";
import {ProductLineFields, ProductLineFormData} from "types/lines/productLineData";
import {HttpCacheProduct} from "http/cache/httpCacheProduct";
import {useFormContext} from "react-hook-form";
import {useProductLineDetail} from '../ProductLineDetailContext';
import {Skeleton} from "@mui/lab";
import {EntityWithIdFields} from "types/baseEntities";
import {Product, ProductFields} from 'types/product/productData';


function ProductLineDetailPublicationPage() {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>();
    
    const { loading, allowEdit } = useProductLineDetail();
    const {control, watch, setValue} = useFormContext<ProductLineFormData>();
    const watchOffererId = watch(ProductLineFields.OffererId);
    const watchProductServiceCode = watch(ProductLineFields.ProductServiceCode);
    const watchProductInstrumentCode = watch(ProductLineFields.ProductInstrumentCode);
    const watchProductInstrumentTypeCode = watch(ProductLineFields.ProductInstrumentTypeCode);
    const watchProductCode = watch(ProductLineFields.ProductCode);
    const enterFilters: boolean =
        !!watchProductServiceCode &&
        !!watchProductInstrumentTypeCode &&
        !!watchProductInstrumentCode;

    const loadServices = useCallback(() => {
        if (watchOffererId)
            return HttpCacheProduct.getServicesByOffererId(watchOffererId);
        
        return undefined;
    }, [watchOffererId])
    
    const loadProductInstrument = useCallback(async () => {
        if (!!watchProductInstrumentTypeCode)
            return await HttpCacheProduct.getInstrumentsByType(
                watchProductInstrumentTypeCode,
            );

        return [];
    }, [watchProductInstrumentTypeCode]);

    const loadProducts = useCallback(async () => {
        if (
            watchProductServiceCode &&
            watchProductInstrumentTypeCode &&
            watchProductInstrumentCode
        )
            return HttpCacheProduct.getFilteredList(
                watchProductServiceCode || undefined, 
                watchProductInstrumentTypeCode || undefined,
                watchProductInstrumentCode || undefined,
            )
                .then(data => {
                    setFilteredProducts(data);
                    return data;
                })

        return [];
    }, [
        watchProductServiceCode,
        watchProductInstrumentTypeCode,
        watchProductInstrumentCode,
    ]);

    useEffect(() => {
        if (!loading && watchProductCode && filteredProducts) {
            const templateCode = filteredProducts.find(x => x[EntityWithIdFields.Id] === watchProductCode)?.[ProductFields.ProductTemplateCode];
            setValue(ProductLineFields.ProductTemplateCode, templateCode);
        }
    }, [loading, watchProductCode, filteredProducts]);
        
  const clearProductCode = () => setValue(ProductLineFields.ProductCode, 0);
  
  const onHandleChangeInstrumentTypeCode = () => {
      setValue(ProductLineFields.ProductInstrumentCode, 0);
      clearProductCode();
  }
    
  return (
      <Card>
        <CardHeader title='Clasificación de la línea' />
        <CardContent>
          <Grid container justifyContent={'center'}>
              <Grid item xs={12}>
                  <Alert color={'info'} severity={'info'}>
                      Si modificás alguno de los filtros de clasificación se pueden producir cambios en las plantillas de las características de las líneas
                  </Alert>
              </Grid>
              
              <Grid item sm={12} md={8}>
                  {
                      loading ?
                          <Stack spacing={2}>
                              {Array.from({length: 4}).map((d, k) => <Skeleton key={`lineDetail_classification_${k}`}/>)}
                          </Stack>
                          :
                          <Stack spacing={2}>
                              <AsyncSelect
                                  label="Servicio"
                                  control={control}
                                  loadOptions={loadServices}
                                  name={ProductLineFields.ProductServiceCode}
                                  disabled={!allowEdit}
                                  onChange={clearProductCode}
                                  fullWidth
                              />

                              <AsyncSelect
                                  label="Tipo Instrumento"
                                  control={control}
                                  loadOptions={HttpCacheProduct.getInstrumentTypes}
                                  name={ProductLineFields.ProductInstrumentTypeCode}
                                  disabled={!allowEdit}
                                  onChange={onHandleChangeInstrumentTypeCode}
                                  fullWidth
                              />

                              <AsyncSelect
                                  label="Instrumento"
                                  control={control}
                                  loadOptions={loadProductInstrument}
                                  name={ProductLineFields.ProductInstrumentCode}
                                  disabled={!allowEdit || !watchProductInstrumentTypeCode}
                                  onChange={clearProductCode}
                                  fullWidth
                              />
                              <AsyncSelect
                                  label="Producto"
                                  control={control}
                                  disabled={!allowEdit || !enterFilters}
                                  loadOptions={loadProducts}
                                  name={ProductLineFields.ProductCode}
                                  fullWidth
                                  required
                              />
                          </Stack>
                  }
              </Grid>
          </Grid>
        </CardContent>
      </Card>
  );
}

export default ProductLineDetailPublicationPage;
