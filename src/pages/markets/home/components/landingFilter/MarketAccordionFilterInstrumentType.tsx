import { Grid, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { MarketLandingFilterContext } from 'pages/markets/home/MarketLandingFilter';
import {IntermediateDataView} from 'types/market/marketIntermediateData';
import { HttpMarketIntermediate } from 'http/market';
import { useQuery } from 'hooks/useQuery';
import MarketInstrumentTypeToggleButton from '../../../components/misc/MarketInstrumentTypeToggleButton';
import { EntityWithIdFields } from 'types/baseEntities';

function MarketAccordionFilterInstrumentType() {
  const queryParams = useQuery();
  const instrumentTypeParam = queryParams.get('instrumentType');

  const {
    instrumentTypeCode,
    setInstrumentTypeCode,
    destinyCode,
    serviceCode,
  } = useContext(MarketLandingFilterContext);

  const [allInstrumentTypes, setAllInstrumentTypes] =
    useState<IntermediateDataView[]>();
  const [instrumentTypes, setInstrumentTypes] =
    useState<IntermediateDataView[]>();

  const clearInstrumentTypeSelected = () => setInstrumentTypeCode(undefined);

  useEffect(() => {
    HttpMarketIntermediate.getIntermediateInstrumentTypes(
      undefined,
      undefined,
    ).then(setAllInstrumentTypes);
  }, []);

  useEffect(() => {
    if (!instrumentTypeParam)
      HttpMarketIntermediate.getIntermediateInstrumentTypes(
        destinyCode ? [destinyCode] : [],
        serviceCode ? [serviceCode] : [],
      ).then(setInstrumentTypes);
  }, [instrumentTypeParam, destinyCode, serviceCode]);

  const onSelectInstrument = (
    selected: boolean,
    service: IntermediateDataView,
  ) => {
    if (!selected) {
      setInstrumentTypeCode(
        service[EntityWithIdFields.Id],
      );
    } else {
      clearInstrumentTypeSelected();
    }
  };

  const getSlide = (
    instrumentType: IntermediateDataView,
    disabled: boolean = false,
  ) => {
    return (
      <MarketInstrumentTypeToggleButton
        instrumentT={instrumentType}
        disabled={
          disabled ||
          (!!instrumentTypeCode &&
            instrumentType[EntityWithIdFields.Id] !== instrumentTypeCode)
        }
        selected={
          instrumentType[EntityWithIdFields.Id] === instrumentTypeCode && !disabled
        }
        onSelect={onSelectInstrument}
        key={`slidesInstrumentsTypes_${instrumentType[EntityWithIdFields.Id]}`}
      />
    );
  };

  const renderSlidesWhenQueryParams = (codeInstrumentType: number) => {
    if (!allInstrumentTypes) return <></>;

    let slides = allInstrumentTypes
      .filter(
        (x) =>
          x[EntityWithIdFields.Id] ===
          codeInstrumentType,
      )
      .map((x) => getSlide(x, false));

    slides = slides.concat(
      allInstrumentTypes
        .filter(
          (x) =>
            x[EntityWithIdFields.Id] !==
            codeInstrumentType,
        )
        .map((x) => getSlide(x, false)),
    );

    return slides;
  };

  const renderSlidesInstrumentsTypes = () => {
    if (instrumentTypeParam)
      return renderSlidesWhenQueryParams(parseInt(instrumentTypeParam));

    if (!allInstrumentTypes || !instrumentTypes) return <></>;

    let slides = instrumentTypes.map((x) => getSlide(x));

    slides = slides.concat(
      allInstrumentTypes
        .filter((x) => {
          let instrumentTypesByFilters = instrumentTypes.filter(
            (y) =>
              y[EntityWithIdFields.Id] ==
              x[EntityWithIdFields.Id],
          );

          return !instrumentTypesByFilters.length;
        })
        .map((x) => getSlide(x, !!destinyCode || !!serviceCode)),
    );

    return slides;
  };

  return (
    <Grid item md={5}>
      <Stack spacing={2}>
        <Typography fontSize={20} fontWeight={600}>
          ¿Qué Tipo de Instrumento?
        </Typography>
        <Stack direction="row" flexWrap={'wrap'} gap={1}>
          {renderSlidesInstrumentsTypes()}
        </Stack>
      </Stack>
    </Grid>
  );
}

export default MarketAccordionFilterInstrumentType;
