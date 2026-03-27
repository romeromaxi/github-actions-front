import {Stack, useMediaQuery, useTheme} from "@mui/material";
import {SearchButton} from "components/buttons/Buttons";
import React, {useEffect, useMemo, useState} from "react";
import ControlledFilterDropdown from "components/forms/ControlledFilterDropdown";
import {useForm} from "react-hook-form";
import {HttpMarketIntermediate} from "http/market";
import {MarketFilterDropdownSearch} from "../../../lines/filter/ProductLineFilterDropdown";
import {FilterProductLineSearchFields} from "types/lines/productLineData";
import {createSearchParams, useNavigate} from "react-router-dom";
import {marketFilterStorage} from "util/sessionStorage/marketFiltersStorage";
import {AppRouteSecObjects, SecurityComponents} from "types/security";
import useSecurityObject from "hooks/useSecurityObject";
import FailRedirectMarketDialog from "../FailRedirectMarketDialog";
import {
    IntermediateDataNeedView,
    IntermediateDataView,
    IntermediateDataViewFields
} from "types/market/marketIntermediateData";
import {convertToItemFilterDropdown} from "util/formatters/marketIntermediateFormatter";
import {removeDuplicatesByFieldWithPriority} from "../../../../../util/helpers";
import {EntityWithIdAndDescriptionFields} from "../../../../../types/baseEntities";

enum MarketLandingFilterType {
    Need,
    Destiny,
    Service,
    InstrumentType,
}

const MarketLookingForLinesLandingFilter = () => {
    const { hasReadPermission } = useSecurityObject();
    const [failRoute, setFailRoute] = useState<boolean>(false);
    const [currentFilter, setCurrentFilter] = useState<MarketLandingFilterType>(MarketLandingFilterType.Destiny);
    const navigate = useNavigate();
    const percentageSpacePerFilter = '25%';
    
    const [destinies, setDestinies] = useState<IntermediateDataView[]>();
    const [services, setServices] = useState<IntermediateDataView[]>();
    const [instrumentTypes, setInstrumentTypes] = useState<IntermediateDataView[]>([]);
    const [needs, setNeeds] = useState<IntermediateDataNeedView[]>();
    const uniqueNeeds : IntermediateDataNeedView[] | undefined = useMemo(() =>
            !needs ? undefined : removeDuplicatesByFieldWithPriority(needs, EntityWithIdAndDescriptionFields.Id, IntermediateDataViewFields.AllowSelect)
        , [needs]);
    
    const {control, watch, handleSubmit} = 
        useForm<MarketFilterDropdownSearch>();

    const watchDestinies = watch(FilterProductLineSearchFields.CodsProductDestiny);
    const selectedDestinies = watchDestinies && watchDestinies.length;
    const watchServices = watch(FilterProductLineSearchFields.CodsProductService);
    const selectedServices = watchServices && watchServices.length;
    const watchInstruments = watch(FilterProductLineSearchFields.CodsProductInstrumentType);
    const selectedInstruments = watchInstruments && watchInstruments.length;
    const watchNeeds = watch(FilterProductLineSearchFields.CodsProductNeed);
    const selectedNeeds = watchNeeds && watchNeeds.length;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreenSize = useMediaQuery(theme.breakpoints.down("md"));
    const isMediumLargeScreenSize = useMediaQuery(theme.breakpoints.down(1440));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down(760));
    const widthSearchButton = useMemo(() => {
        if (isMobile) return '90%';
        
        if (isSmallScreen) return '60%';
        
        if (isMediumScreenSize) return '45%';
        
        if (isMediumLargeScreenSize) return '35%';
        
        return 'auto'
    }, [isMobile, isSmallScreen, isMediumScreenSize, isMediumLargeScreenSize]);
    
    //SERVICE OPTION GET
    useEffect(() => {
        if ((selectedInstruments || selectedDestinies || selectedNeeds) && selectedServices) return;
        
        HttpMarketIntermediate.getIntermediateServices(watchDestinies, watchInstruments, watchNeeds)
          .then((serviceList) => {
              setServices([...serviceList]);
          });
    }, [watchNeeds, watchServices, watchDestinies, watchInstruments]);

    useEffect(() => {
        if ((selectedServices || selectedInstruments || selectedNeeds) && selectedDestinies) return;

        HttpMarketIntermediate.getIntermediateDestinies(
            watchServices,
            watchInstruments,
            watchNeeds
        ).then((destinyList) => {
            setDestinies([...destinyList]);
        });
    }, [watchNeeds, watchServices, watchDestinies, watchInstruments])
    
    useEffect(() => {
        if ((selectedServices || selectedDestinies || selectedNeeds) && selectedInstruments) return;
        
        HttpMarketIntermediate.getIntermediateInstrumentTypes(watchDestinies, watchServices, watchNeeds)
          .then((instrumentList) => {
              setInstrumentTypes([...instrumentList]);
          });
    }, [watchNeeds, watchServices, watchDestinies, watchInstruments]);

    useEffect(() => {
        if ((selectedServices || selectedInstruments || selectedDestinies) && selectedNeeds) return;
        
        HttpMarketIntermediate.getIntermediateNeeds(
            watchDestinies, watchServices, watchInstruments
        ).then(setNeeds);
    }, [watchNeeds, watchServices, watchDestinies, watchInstruments]);
    
    const navigateToMarket = (data: MarketFilterDropdownSearch) => {
        const listParams = []
        listParams.push(['need', data[FilterProductLineSearchFields.CodsProductNeed]])
        listParams.push(['destiny', data[FilterProductLineSearchFields.CodsProductDestiny]])
        listParams.push(['service', data[FilterProductLineSearchFields.CodsProductService]])
        listParams.push(['instrumentType', data[FilterProductLineSearchFields.CodsProductInstrumentType]])
        const searchParams = createSearchParams(listParams);
        marketFilterStorage.clearStackedFilters()
        marketFilterStorage.clearSearchFilter()
        marketFilterStorage.saveLandingFilter(data)
        navigate(`/market/lines?${searchParams}`);
    }
    
    const onSearch = (data: MarketFilterDropdownSearch) => {
        if (
            !hasReadPermission(
                SecurityComponents.AppRoutes,
                AppRouteSecObjects.MarketProductLineSearchRoute,
            )
        ) {
            setFailRoute(true);
            return;
        }

        navigateToMarket(data);
    }
    
    return (
        <Stack 
            direction={isMobile ? "column" : "row"} 
            alignItems="center" 
            flexWrap="wrap"
            sx={{ 
                flexShrink: 1, 
                backgroundColor: "#F7FAFC", 
                padding: { xs: '10px', sm: '12px 28px', md: '12px 28px', lg: '10px' }, 
                borderRadius: { xs: '50px', sm: '75px', md: '100px' }
            }} 
            justifyContent="center"
            spacing={2}
        >
            <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={{ sm: 2 }} 
                sx={{ flexShrink: 1, minWidth: 0, pb: isMediumLargeScreenSize ? 1 : 0 }} 
                alignItems="center" 
                flexGrow={1}
                width={isMobile ? "100%" : "auto"} 
                maxWidth={isMediumLargeScreenSize ? "100%" : "85%"} 
            >
                <ControlledFilterDropdown
                    control={control}
                    name={FilterProductLineSearchFields.CodsProductService}
                    selected
                    onSelect={() => setCurrentFilter(MarketLandingFilterType.Service)}
                    onMouseEnter={() => setCurrentFilter(MarketLandingFilterType.Service)}
                    label={'Servicio'}
                    options={convertToItemFilterDropdown(services ?? [])}
                    sx={{ 
                        flexShrink: 1, 
                        minWidth: 0, 
                        flexBasis: percentageSpacePerFilter, 
                        width: isMobile ? "100%" : "auto", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        textAlign: "center" 
                    }}
                    labelSx={{ paddingLeft: isMobile ? 4 : 0 }}
                    smallSize
                />

                <ControlledFilterDropdown 
                    control={control}
                    name={FilterProductLineSearchFields.CodsProductDestiny}
                    selected
                    onSelect={() => setCurrentFilter(MarketLandingFilterType.Destiny)}
                    onMouseEnter={() => setCurrentFilter(MarketLandingFilterType.Destiny)}
                    label={'Destino'}
                    options={convertToItemFilterDropdown(destinies ?? [])}
                    sx={{ 
                        flexShrink: 1, 
                        minWidth: 0, 
                        flexBasis: !isMobile ? percentageSpacePerFilter : '100%', 
                        width: isMobile ? "100%" : "auto", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        textAlign: "center" 
                    }}
                    labelSx={{ paddingLeft: isMobile ? 4 : 0 }}
                    smallSize
                />

                <ControlledFilterDropdown 
                    control={control}
                    name={FilterProductLineSearchFields.CodsProductInstrumentType}
                    selected
                    onSelect={() => setCurrentFilter(MarketLandingFilterType.InstrumentType)}
                    onMouseEnter={() => setCurrentFilter(MarketLandingFilterType.InstrumentType)}
                    label={'Tipo de Instrumento'}
                    options={convertToItemFilterDropdown(instrumentTypes ?? [])}
                    sx={{ 
                        flexShrink: 1, 
                        minWidth: 0, 
                        flexBasis: percentageSpacePerFilter, 
                        width: isMobile ? "100%" : "auto", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        textAlign: "center" 
                    }}
                    labelSx={{ paddingLeft: isMobile ? 4 : 0 }}
                    smallSize
                />

                <ControlledFilterDropdown
                    control={control}
                    name={FilterProductLineSearchFields.CodsProductNeed}
                    selected
                    onSelect={() => setCurrentFilter(MarketLandingFilterType.Need)}
                    onMouseEnter={() => setCurrentFilter(MarketLandingFilterType.Need)}
                    label={'Necesidad'}
                    options={uniqueNeeds ? convertToItemFilterDropdown(uniqueNeeds) : undefined}
                    sx={{ 
                        flexShrink: 1, 
                        minWidth: 0, 
                        flexBasis: percentageSpacePerFilter, 
                        width: isMobile ? "100%" : "auto", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        textAlign: "center" 
                    }}
                    labelSx={{ paddingLeft: isMobile ? 4 : 0 }}
                    smallSize
                />
            </Stack>
  
                <SearchButton 
                    onClick={handleSubmit(onSearch)} 
                    sx={{ 
                        width: widthSearchButton,
                        justifyContent: "center", 
                    }}
                >
                    {(selectedDestinies || selectedInstruments || selectedServices || selectedNeeds) ? 'Buscar' : 'Ver todas'}
                </SearchButton>
           
            <FailRedirectMarketDialog
                open={failRoute}
                onClose={() => setFailRoute(false)}
                redirect={handleSubmit(navigateToMarket)}
                hideTitle
            />
        </Stack>
    );
}

export default MarketLookingForLinesLandingFilter