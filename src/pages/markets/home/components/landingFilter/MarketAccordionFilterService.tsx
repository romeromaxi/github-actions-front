import { Grid, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { MarketLandingFilterContext } from 'pages/markets/home/MarketLandingFilter';
import {IntermediateDataView} from 'types/market/marketIntermediateData';
import { HttpMarketIntermediate } from 'http/market';
import { useQuery } from 'hooks/useQuery';
import MarketServiceToggleButton from '../../../components/misc/MarketServiceToggleButton';
import { EntityWithIdFields } from 'types/baseEntities';

function MarketAccordionFilterService() {
  const queryParams = useQuery();
  const serviceParam = queryParams.get('service');

  const { serviceCode, setServiceCode, destinyCode, instrumentTypeCode } =
    useContext(MarketLandingFilterContext);

  const [allServices, setAllServices] = useState<IntermediateDataView[]>();
  const [services, setServices] = useState<IntermediateDataView[]>();

  const clearServiceSelected = () => setServiceCode(undefined);

  useEffect(() => {
    HttpMarketIntermediate.getIntermediateServices().then(setAllServices);
  }, []);

  useEffect(() => {
    if (!serviceParam) {
      HttpMarketIntermediate.getIntermediateServices(
        destinyCode ? [destinyCode] : [],
        instrumentTypeCode ? [instrumentTypeCode] : [],
      ).then(setServices);
    }
  }, [serviceParam, destinyCode, instrumentTypeCode]);

  const onSelectService = (
    selected: boolean,
    service: IntermediateDataView,
  ) => {
    if (!selected) {
      setServiceCode(service[EntityWithIdFields.Id]);
    } else {
      clearServiceSelected();
    }
  };

  const getSlide = (
    service: IntermediateDataView,
    disabled: boolean = false,
  ) => {
    return (
      <MarketServiceToggleButton
        service={service}
        onSelect={onSelectService}
        disabled={
          disabled ||
          (!!serviceCode &&
            service[EntityWithIdFields.Id] !==
              serviceCode)
        }
        selected={
          service[EntityWithIdFields.Id] ===
            serviceCode && !disabled
        }
        key={`slidesServices_${service[EntityWithIdFields.Id]}`}
      />
    );
  };

  const renderSlidesWhenQueryParams = (codeService: number) => {
    if (!allServices) return <></>;

    let slides = allServices
      .filter(
        (x) => x[EntityWithIdFields.Id] === codeService,
      )
      .map((x) => getSlide(x, false));

    slides = slides.concat(
      allServices
        .filter(
          (x) =>
            x[EntityWithIdFields.Id] !== codeService,
        )
        .map((x) => getSlide(x, false)),
    );

    return slides;
  };

  const renderSlidesServices = () => {
    if (serviceParam)
      return renderSlidesWhenQueryParams(parseInt(serviceParam));

    if (!allServices || !services) return <></>;

    let slides = services.map((x) => getSlide(x));

    slides = slides.concat(
      allServices
        .filter((x) => {
          let servicesByFilters = services.filter(
            (y) =>
              y[EntityWithIdFields.Id] ===
              x[EntityWithIdFields.Id],
          );

          return !servicesByFilters.length;
        })
        .map((x) => getSlide(x, !!destinyCode || !!instrumentTypeCode)),
    );

    return slides;
  };

  /*
        <MarketAccordionFilterBase title={'SERVICIOS'}
                                   list={allServices}
        >
            <Stack spacing={1}>
                {renderSlidesServices()}
            </Stack>
        </MarketAccordionFilterBase>
     */

  return (
    <Grid item md={3.5}>
      <Stack spacing={2}>
        <Typography fontSize={18} fontWeight={600}>
          ¿Para qué Servicio?
        </Typography>
        <Stack direction="row" flexWrap={'wrap'} gap={1}>
          {renderSlidesServices()}
        </Stack>
      </Stack>
    </Grid>
  );
}

export default MarketAccordionFilterService;
