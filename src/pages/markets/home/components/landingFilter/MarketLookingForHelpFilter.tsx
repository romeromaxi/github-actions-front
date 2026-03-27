import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { SearchButton } from "components/buttons/Buttons";
import ControlledFilterDropdown from "components/forms/ControlledFilterDropdown";
import { useForm } from "react-hook-form";
import { HttpMarketIntermediate } from "http/market";
import { convertToItemFilterDropdown } from "util/formatters/marketIntermediateFormatter";
import { ControlledTextFieldFilled } from "components/forms";
import { createSearchParams, useNavigate } from "react-router-dom";
import { AppRouteSecObjects, SecurityComponents } from "types/security";
import { FilterProductLineSearchFields } from "types/lines/productLineData";
import { marketFilterStorage, MarketLandingFilter } from "util/sessionStorage/marketFiltersStorage";
import useSecurityObject from "hooks/useSecurityObject";
import FailRedirectMarketDialog from "../FailRedirectMarketDialog";
import { numberFormatter } from "util/formatters/numberFormatter";
import { removeDuplicatesByField } from "util/helpers";
import {
    IntermediateDataNeedView,
    IntermediateDataNeedViewFields
} from "types/market/marketIntermediateData";
import { EntityWithIdAndDescriptionFields, EntityWithIdFields } from "types/baseEntities";
import { useAction } from "hooks/useAction";
import { removeDuplicates } from "../../../../../util/helpers";

const MarketLookingForHelpFilter = () => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useAction();
    const { control, handleSubmit, watch } = useForm<MarketLandingFilter>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreenSize = useMediaQuery(theme.breakpoints.down("md"));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down(760));
    
    const watchAmount = watch(FilterProductLineSearchFields.AmountToFinance);
    
    const [textFieldSelect, setTextFieldSelect] = useState(false);
    const [failRoute, setFailRoute] = useState(false);
    const [needs, setNeeds] = useState<IntermediateDataNeedView[]>();
    
    const uniqueNeeds : IntermediateDataNeedView[] | undefined = useMemo(() =>
        !needs ? undefined : removeDuplicatesByField(needs, EntityWithIdAndDescriptionFields.Id)
    , [needs]);
    
    const { hasReadPermission } = useSecurityObject();
    
    const onSearch = (data: MarketLandingFilter) => {
        if (!hasReadPermission(SecurityComponents.AppRoutes, AppRouteSecObjects.MarketProductLineSearchRoute)) {
            setFailRoute(true);
            return;
        }
        
        if (!needs) return;

        showLoader();
        
        const listParams = []
        const needsSelected = 
            needs.filter(x => 
                !!data[FilterProductLineSearchFields.CodsProductNeed] &&
                data[FilterProductLineSearchFields.CodsProductNeed]?.includes(x[EntityWithIdFields.Id])
            );

        let destiniesCodes : number[] = [];
        let servicesCodes : number[] = [];
        let instrumentTypesCodes : number[] = [];

        if (needsSelected && needsSelected.length) {
            destiniesCodes = removeDuplicates(needsSelected.map(x => x[IntermediateDataNeedViewFields.DestinyCode]));
            servicesCodes = removeDuplicates(needsSelected.map(x => x[IntermediateDataNeedViewFields.ServiceCode]));
            instrumentTypesCodes = removeDuplicates(needsSelected.map(x => x[IntermediateDataNeedViewFields.InstrumentTypeCode]));
        }

        const submitData = {
            [FilterProductLineSearchFields.CodsProductDestiny]: destiniesCodes,
            [FilterProductLineSearchFields.CodsProductService]: servicesCodes,
            [FilterProductLineSearchFields.CodsProductInstrumentType]: instrumentTypesCodes,
            [FilterProductLineSearchFields.AmountToFinance]: data[FilterProductLineSearchFields.AmountToFinance],
            [FilterProductLineSearchFields.CodsCurrency]: data[FilterProductLineSearchFields.AmountToFinance] ? [1] : undefined
        };
        listParams.push(['destiny', destiniesCodes]);
        listParams.push(['service', servicesCodes]);
        listParams.push(['instrumentType', instrumentTypesCodes]);
        listParams.push(['amount', submitData[FilterProductLineSearchFields.AmountToFinance]]);

        submitData[FilterProductLineSearchFields.CodsCurrency] && listParams.push(['currency', submitData[FilterProductLineSearchFields.CodsCurrency]])
        const searchParams = createSearchParams(listParams);

        marketFilterStorage.clearStackedFilters();
        marketFilterStorage.clearSearchFilter();
        marketFilterStorage.saveLandingFilter(submitData);
        
        hideLoader();
        navigate(`/market/lines?${searchParams}`);
    };

    useEffect(() => {
        if (!needs) HttpMarketIntermediate.getIntermediateNeeds().then(setNeeds);
    }, []);
    
    return (
        <Stack 
            direction={isMobile ? "column" : "row"} 
            alignItems="center" 
            flexWrap="wrap"
            sx={{ padding: 2, backgroundColor: "#F7FAFC", borderRadius: "16px" }} 
            justifyContent={isMobile ? "center" : "space-between"}
            spacing={2}>
            <Stack direction={isMobile ? "column" : "row"} alignItems="center" flexGrow={1} spacing={2} width={isMobile ? "95%" : "auto"}>
                <ControlledFilterDropdown 
                    control={control}
                    name={FilterProductLineSearchFields.CodsProductNeed}
                    selected={!textFieldSelect}
                    onSelect={() => setTextFieldSelect(false)}
                    onMouseEnter={() => setTextFieldSelect(false)}
                    label="Destino"
                    description="¿Para qué necesitás financiamiento?"
                    options={uniqueNeeds ? convertToItemFilterDropdown(uniqueNeeds) : undefined}
                />
                <Stack 
                    sx={{ backgroundColor: textFieldSelect ? "white" : "transparent", px: 4, py: 2, borderRadius: "76px", cursor: "pointer", width: "100%" }}
                    onClick={() => setTextFieldSelect(true)}
                    onMouseEnter={() => setTextFieldSelect(true)}>
                    <Typography fontSize={16} fontWeight={500}>Monto a financiar</Typography>
                    {textFieldSelect ? (
                        <ControlledTextFieldFilled 
                            control={control}
                            name={FilterProductLineSearchFields.AmountToFinance}
                            fullWidth
                            currency
                        />
                    ) : (
                        <Typography color="text.lighter" fontSize={16} fontWeight={watchAmount ? 400 : 300} fontStyle={watchAmount ? "" : "italic"}>
                            {watchAmount ? numberFormatter.toStringWithAmount(watchAmount, "$") : "¿Qué monto necesitás?"}
                        </Typography>
                    )}
                </Stack>
                
            </Stack>
            <Stack 
                sx={{ 
                    flexShrink: 0,
                    width: isMediumScreenSize ? "100%" : "auto", 
                    justifyContent: isSmallScreen ? "center" : "flex-start",
                    alignItems: isMediumScreenSize ? "center" : "flex-end",
                }}
            >
                <SearchButton onClick={handleSubmit(onSearch)} sx={{ width: "100%", mt: 2 }}>
                    Buscar
                </SearchButton>
            </Stack>
            <FailRedirectMarketDialog 
                open={failRoute}
                onClose={() => setFailRoute(false)}
                hideTitle
            />
        </Stack>
    );
};

export default MarketLookingForHelpFilter;