import { Grid, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { MarketLandingFilterContext } from 'pages/markets/home/MarketLandingFilter';
import {IntermediateDataView} from 'types/market/marketIntermediateData';
import { HttpMarketIntermediate } from 'http/market';
import { useQuery } from 'hooks/useQuery';
import MarketDestinyToggleButton from '../../../components/misc/MarketDestinyToggleButton';
import { EntityWithIdFields } from 'types/baseEntities';

function MarketAccordionFilterDestiny() {
  const queryParams = useQuery();
  const destinyParam = queryParams.get('destiny');

  const { destinyCode, setDestinyCode, serviceCode, instrumentTypeCode } =
    useContext(MarketLandingFilterContext);

  const [allDestinies, setAllDestinies] = useState<IntermediateDataView[]>();
  const [destinies, setDestinies] = useState<IntermediateDataView[]>();

  const clearDestinySelected = () => setDestinyCode(undefined);

  useEffect(() => {
    setAllDestinies(undefined);
    HttpMarketIntermediate.getIntermediateDestinies().then(setAllDestinies);
  }, []);

  useEffect(() => {
    if (!destinyParam)
      HttpMarketIntermediate.getIntermediateDestinies(
        serviceCode ? [serviceCode] : [],
        instrumentTypeCode ? [instrumentTypeCode] : [],
      ).then(setDestinies);
  }, [destinyParam, serviceCode, instrumentTypeCode]);

  const onSelectDestiny = (
    destiny: IntermediateDataView,
    selected: boolean,
  ) => {
    if (!selected) {
      setDestinyCode(destiny[EntityWithIdFields.Id]);
    } else {
      clearDestinySelected();
    }
  };

  const getSlide = (
    destiny: IntermediateDataView,
    disabled: boolean = false,
  ) => {
    return (
      <MarketDestinyToggleButton
        onSelect={onSelectDestiny}
        destiny={destiny}
        selected={
          destiny[EntityWithIdFields.Id] ===
            destinyCode && !disabled
        }
        disabled={
          disabled ||
          (!!destinyCode &&
            destiny[EntityWithIdFields.Id] !==
              destinyCode)
        }
        key={`slidesDestinies_${destiny[EntityWithIdFields.Id]}`}
      />
    );
  };

  const renderSlidesWhenQueryParams = (codeDestiny: number) => {
    if (!allDestinies) return <></>;

    let slides = allDestinies
      .filter(
        (x) => x[EntityWithIdFields.Id] === codeDestiny,
      )
      .map((x) => getSlide(x, false));

    slides = slides.concat(
      allDestinies
        .filter(
          (x) =>
            x[EntityWithIdFields.Id] !== codeDestiny,
        )
        .map((x) => getSlide(x, false)),
    );

    return slides;
  };

  const renderSlidesDestinies = () => {
    if (destinyParam)
      return renderSlidesWhenQueryParams(parseInt(destinyParam));

    if (!allDestinies || !destinies) return <></>;

    let slides = destinies.map((x) => getSlide(x));

    slides = slides.concat(
      allDestinies
        .filter((x) => {
          let destiniesTypesByFilters = destinies.filter(
            (y) =>
              y[EntityWithIdFields.Id] ==
              x[EntityWithIdFields.Id],
          );

          return !destiniesTypesByFilters.length;
        })
        .map((x) => getSlide(x, !!instrumentTypeCode || !!serviceCode)),
    );

    return slides;
  };

  return (
    <Grid item md={3.5}>
      <Stack spacing={2}>
        <Typography fontSize={18} fontWeight={600}>
          ¿Cuál es el Destino?
        </Typography>
        <Stack direction="row" flexWrap={'wrap'} gap={1}>
          {renderSlidesDestinies()}
        </Stack>
      </Stack>
    </Grid>
  );
}

export default MarketAccordionFilterDestiny;
