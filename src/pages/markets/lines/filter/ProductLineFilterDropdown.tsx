import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material'; // Import Grid component
import { ProductLineFilterContext, SelectedFilters } from '../ProductLineSearch';
import { FilterProductLineSearchFields } from 'types/lines/productLineData';
import { EntityWithBooleanIdAndDescription, EntityWithIdAndDescriptionFields } from 'types/baseEntities';
import { HttpMarketIntermediate } from 'http/market';
import ControlledFilterDropdown from 'components/forms/ControlledFilterDropdown';
import { useForm } from 'react-hook-form';
import { IntermediateDataNeedView, IntermediateDataView } from 'types/market/marketIntermediateData';
import { convertToItemFilterDropdown } from 'util/formatters/marketIntermediateFormatter';
import { removeDuplicatesByField } from '../../../../util/helpers';

export interface MarketFilterDropdownSearch {
  [FilterProductLineSearchFields.CodsProductNeed]?: number[];
  [FilterProductLineSearchFields.CodsProductService]?: number[];
  [FilterProductLineSearchFields.CodsProductDestiny]?: number[];
  [FilterProductLineSearchFields.CodsProductInstrumentType]?: number[];
}

function ProductLineFilterDropdown() {

  const { filters, setFieldFilter, setSelectedValues, selectedValues } = useContext(ProductLineFilterContext);
  const [firstRenderNeeds, setFirstRenderNeeds] = useState<boolean>(true);
  const [firstRenderDestinies, setFirstRenderDestinies] = useState<boolean>(true);
  const [firstRenderServices, setFirstRenderServices] = useState<boolean>(true);
  const [firstRenderInstruments, setFirstRenderInstruments] = useState<boolean>(true);

  const [needs, setNeeds] = useState<IntermediateDataNeedView[]>();
  const uniqueNeeds: IntermediateDataNeedView[] | undefined = useMemo(
    () => (!needs ? undefined : removeDuplicatesByField(needs, EntityWithIdAndDescriptionFields.Id)),
    [needs]
  );
  const selectedNeeds = useMemo(
    () => filters[FilterProductLineSearchFields.CodsProductNeed] ?? [],
    [filters[FilterProductLineSearchFields.CodsProductNeed]]
  );

  const [destinies, setDestinies] = useState<IntermediateDataView[]>();
  const selectedDestinies = useMemo(
    () => filters[FilterProductLineSearchFields.CodsProductDestiny] ?? [],
    [filters[FilterProductLineSearchFields.CodsProductDestiny]]
  );

  const [services, setServices] = useState<IntermediateDataView[]>();
  const selectedServices = useMemo(
    () => filters[FilterProductLineSearchFields.CodsProductService] ?? [],
    [filters[FilterProductLineSearchFields.CodsProductService]]
  );

  const [instrumentTypes, setInstrumentTypes] = useState<IntermediateDataView[]>([]);
  const selectedInstrumentTypes = useMemo(
    () => filters[FilterProductLineSearchFields.CodsProductInstrumentType] ?? [],
    [filters[FilterProductLineSearchFields.CodsProductInstrumentType]]
  );

  const { control, watch, setValue, getValues } = useForm<MarketFilterDropdownSearch>({
    defaultValues: {
      [FilterProductLineSearchFields.CodsProductNeed]: selectedNeeds,
      [FilterProductLineSearchFields.CodsProductDestiny]: selectedDestinies,
      [FilterProductLineSearchFields.CodsProductService]: selectedServices,
      [FilterProductLineSearchFields.CodsProductInstrumentType]: selectedInstrumentTypes,
    },
  });

  const hasSelectedDestinies: boolean = selectedDestinies && !!selectedDestinies.length;
  const hasSelectedServices: boolean = selectedServices && !!selectedServices.length;
  const hasSelectedInstrumentTypes: boolean = selectedInstrumentTypes && !!selectedInstrumentTypes.length;
  const hasSelectedNeeds: boolean = selectedNeeds && !!selectedNeeds.length;
  const percentageSpacePerFilter = '25%';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // NEED OPTION GET
  useEffect(() => {
    if ((hasSelectedDestinies || hasSelectedServices || hasSelectedInstrumentTypes) && hasSelectedNeeds && !!uniqueNeeds?.length) return;

    HttpMarketIntermediate.getIntermediateNeeds(selectedDestinies, selectedServices, selectedInstrumentTypes).then(setNeeds);
  }, [selectedDestinies, selectedServices, selectedInstrumentTypes]);
  
  // SERVICE OPTION GET
  useEffect(() => {
    if ((hasSelectedDestinies || hasSelectedInstrumentTypes || hasSelectedNeeds) && hasSelectedServices && !!services?.length) return;

    HttpMarketIntermediate.getIntermediateServices(selectedDestinies, selectedInstrumentTypes, selectedNeeds).then(setServices);
  }, [selectedDestinies, selectedInstrumentTypes, selectedNeeds]);

  // DESTINY OPTION GET
  useEffect(() => {
    if ((hasSelectedServices || hasSelectedInstrumentTypes || hasSelectedNeeds) && hasSelectedDestinies && !!destinies?.length) return;

    HttpMarketIntermediate.getIntermediateDestinies(selectedServices, selectedInstrumentTypes, selectedNeeds).then(setDestinies);
  }, [selectedServices, selectedInstrumentTypes, selectedNeeds]);

  // INSTRUMENT-TYPES OPTION GET
  useEffect(() => {
    if ((hasSelectedServices || hasSelectedDestinies || hasSelectedNeeds) && hasSelectedInstrumentTypes && !!instrumentTypes?.length) return;

    HttpMarketIntermediate.getIntermediateInstrumentTypes(selectedDestinies, selectedServices, selectedNeeds).then(setInstrumentTypes);
  }, [selectedServices, selectedDestinies, selectedNeeds]);

  const watchNeeds = watch(FilterProductLineSearchFields.CodsProductNeed);
  const watchDestinies = watch(FilterProductLineSearchFields.CodsProductDestiny);
  const watchServices = watch(FilterProductLineSearchFields.CodsProductService);
  const watchInstruments = watch(FilterProductLineSearchFields.CodsProductInstrumentType);

  useEffect(() => {
    const currentValue = getValues(FilterProductLineSearchFields.CodsProductDestiny);
    const newValue = filters[FilterProductLineSearchFields.CodsProductDestiny];

    if (JSON.stringify(currentValue) !== JSON.stringify(newValue)) {
      setValue(FilterProductLineSearchFields.CodsProductDestiny, newValue);
    }
  }, [filters[FilterProductLineSearchFields.CodsProductDestiny], setValue, getValues]);

  const setCodsDestinies = (destiniesList: EntityWithBooleanIdAndDescription[]) => {
    console.log('destiniesList before setting:', destiniesList);
    const validDestinies = destiniesList.filter(item => item.id && item.descripcion);
    
    const newSelectedValues: SelectedFilters = {
      ...selectedValues,
      [FilterProductLineSearchFields.CodsProductDestiny]: validDestinies
    };
    
    setFieldFilter(validDestinies, FilterProductLineSearchFields.CodsProductDestiny, false, firstRenderDestinies);
    setSelectedValues(newSelectedValues);
  };
  
  const setCodsInstrumentType = (instrumentList: EntityWithBooleanIdAndDescription[]) => {
    const newSelectedValues: SelectedFilters = {
      ...selectedValues,
      [FilterProductLineSearchFields.CodsProductInstrumentType]: instrumentList
    };
    setFieldFilter(instrumentList, FilterProductLineSearchFields.CodsProductInstrumentType, false, firstRenderInstruments);
    
    setSelectedValues(newSelectedValues);
  };
  
  const setCodsNeeds = (needsList: EntityWithBooleanIdAndDescription[]) => {
    const newSelectedValues: SelectedFilters = {
      ...selectedValues,
      [FilterProductLineSearchFields.CodsProductNeed]: needsList
    };
    setFieldFilter(needsList, FilterProductLineSearchFields.CodsProductNeed, false, firstRenderNeeds);
    
    setSelectedValues(newSelectedValues);
  };
  
  const setCodsServices = (servicesList: EntityWithBooleanIdAndDescription[]) => {
    const newSelectedValues: SelectedFilters = {
      ...selectedValues,
      [FilterProductLineSearchFields.CodsProductService]: servicesList
    };
    setFieldFilter(servicesList, FilterProductLineSearchFields.CodsProductService, false, firstRenderServices);
    
    setSelectedValues(newSelectedValues);
  };

  // For Needs
  useEffect(() => {
    if (!watchNeeds || !uniqueNeeds) return;
    
    const entity: EntityWithBooleanIdAndDescription[] = watchNeeds.map((id: number) => {
      const matchingNeed = uniqueNeeds.find(need => need.id === id);
      return {
        id,
        descripcion: matchingNeed?.descripcion
      };
    });
    
    if (JSON.stringify(filters[FilterProductLineSearchFields.CodsProductNeed]) !== JSON.stringify(entity)) {
      setCodsNeeds(entity);
    }
  }, [watchNeeds, uniqueNeeds]);

  // For Destinies
  useEffect(() => {
    if (!watchDestinies || !destinies) return;
    
    const entity: EntityWithBooleanIdAndDescription[] = watchDestinies.map((id: number) => {
      const matchingDestiny = destinies.find(destiny => destiny.id === id);
      return {
        id,
        descripcion: matchingDestiny?.descripcion
      };
    });
    
    if (JSON.stringify(filters[FilterProductLineSearchFields.CodsProductDestiny]) !== JSON.stringify(entity)) {
      setCodsDestinies(entity);
    }
  }, [watchDestinies, destinies]);

  // For Services
  useEffect(() => {
    if (!watchServices || !services) return;
    
    const entity: EntityWithBooleanIdAndDescription[] = watchServices.map((id: number) => {
      const matchingService = services.find(service => service.id === id);
      return {
        id,
        descripcion: matchingService?.descripcion
      };
    });
    
    if (JSON.stringify(filters[FilterProductLineSearchFields.CodsProductService]) !== JSON.stringify(entity)) {
      setCodsServices(entity);
    }
  }, [watchServices, services]);

  // For Instrument Types
  useEffect(() => {
    if (!watchInstruments || !instrumentTypes) return;
    
    const entity: EntityWithBooleanIdAndDescription[] = watchInstruments.map((id: number) => {
      const matchingInstrument = instrumentTypes.find(instrument => instrument.id === id);
      return {
        id,
        descripcion: matchingInstrument?.descripcion
      };
    });
    
    if (JSON.stringify(filters[FilterProductLineSearchFields.CodsProductInstrumentType]) !== JSON.stringify(entity)) {
      setCodsInstrumentType(entity);
    }
  }, [watchInstruments, instrumentTypes]);

  useEffect(() => {
    const currentValue = getValues(FilterProductLineSearchFields.CodsProductService);
    const newValue = filters[FilterProductLineSearchFields.CodsProductService];

    if (JSON.stringify(currentValue) !== JSON.stringify(newValue)) {
      setValue(FilterProductLineSearchFields.CodsProductService, newValue);
    }
  }, [filters[FilterProductLineSearchFields.CodsProductService], setValue, getValues]);

  useEffect(() => {
    const currentValue = getValues(FilterProductLineSearchFields.CodsProductInstrumentType);
    const newValue = filters[FilterProductLineSearchFields.CodsProductInstrumentType];

    if (JSON.stringify(currentValue) !== JSON.stringify(newValue)) {
      setValue(FilterProductLineSearchFields.CodsProductInstrumentType, newValue);
    }
  }, [filters[FilterProductLineSearchFields.CodsProductInstrumentType], setValue, getValues]);

  useEffect(() => {
    const currentValue = getValues(FilterProductLineSearchFields.CodsProductNeed);
    const newValue = filters[FilterProductLineSearchFields.CodsProductNeed];

    if (JSON.stringify(currentValue) !== JSON.stringify(newValue)) {
      setValue(FilterProductLineSearchFields.CodsProductNeed, newValue);
    }
  }, [filters[FilterProductLineSearchFields.CodsProductNeed], setValue, getValues]);


  return (
    <Grid container spacing={3} alignItems="center" justifyContent="space-between">
      <Grid item xs={12} sm={6} md={3} 
        sx={{ flexShrink: 1, minWidth: 0 }} 
        alignItems="center" 
        flexGrow={1} >
        <ControlledFilterDropdown
          control={control}
          name={FilterProductLineSearchFields.CodsProductInstrumentType}
          selected
          onSelect={() => {
            setFirstRenderInstruments(false);
          }}
          label={'Tipo de instrumento'}
          sx={{ flexShrink: 1, minWidth: 0, px: 4, flexBasis: !isMobile ? percentageSpacePerFilter : '100%' }}
          options={convertToItemFilterDropdown(instrumentTypes ?? [])}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ControlledFilterDropdown
          control={control}
          name={FilterProductLineSearchFields.CodsProductService}
          selected
          onSelect={() => {
            setFirstRenderServices(false);
          }}
          label={'Servicio'}
          sx={{ flexShrink: 1, minWidth: 0, px: 4, flexBasis: !isMobile ? percentageSpacePerFilter : '100%' }}
          options={convertToItemFilterDropdown(services ?? [])}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ControlledFilterDropdown
          control={control}
          name={FilterProductLineSearchFields.CodsProductDestiny}
          selected
          onSelect={() => {
            setFirstRenderDestinies(false);
          }}
          label={'Destino'}
          sx={{ flexShrink: 1, minWidth: 0, px: 4, flexBasis: !isMobile ? percentageSpacePerFilter : '100%' }}
          options={convertToItemFilterDropdown(destinies ?? [])}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ControlledFilterDropdown
          control={control}
          name={FilterProductLineSearchFields.CodsProductNeed}
          selected
          onSelect={() => {
            setFirstRenderNeeds(false);
          }}
          label={'Necesidad'}
          sx={{ flexShrink: 1, minWidth: 0, px: 4, flexBasis: !isMobile ? percentageSpacePerFilter : '100%' }}
          options={convertToItemFilterDropdown(uniqueNeeds ?? [])}
        />
      </Grid>
    </Grid>
  );
}

export default ProductLineFilterDropdown;