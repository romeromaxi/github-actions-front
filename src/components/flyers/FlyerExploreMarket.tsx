import React from "react";
import FlyerBase from "./FlyerBase";
import {ArrowRightIcon} from "@phosphor-icons/react";
import {AppRoutesDefinitions, useAppNavigation} from "hooks/navigation";

// @ts-ignore
import basketImage from "assets/img/luc/home-basket-green.svg"

function FlyerExploreMarket() {
    const { navigate } = useAppNavigation();

    const onNavigateMarketLanding = () => navigate(AppRoutesDefinitions.MarketLanding);
    
    return (
        <FlyerBase title={"Explorá la tienda LUC"}
                   description={"Los mejores productos para financiar tu Pyme en un solo lugar"}
                   ImageProps={{ source: basketImage }}
                   ButtonProps={{
                       onClick: onNavigateMarketLanding,
                       endIcon: <ArrowRightIcon />,
                       label: "Ir a la tienda"
                   }}
        />
    )
}

export default FlyerExploreMarket;