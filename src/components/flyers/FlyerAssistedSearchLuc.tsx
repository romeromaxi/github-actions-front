import React from "react";
import FlyerBase from "./FlyerBase";
import {ArrowRightIcon} from "@phosphor-icons/react";
import {useAppNavigation} from "hooks/navigation";
import {MarketRoute} from "../../routes/market/routeAppMarketData";

function FlyerAssistedSearchLuc() {
    const { navigate } = useAppNavigation();

    const handleNavigateAssistedSearch = () => navigate(MarketRoute.MarketLucAssistedSearch);
    
    return (
        <FlyerBase title='Probá búsqueda asistida'
                   description="Solo necesitas tener tu legajo completo!"
                   eyebrow="¿NECESITAS ASESORAMIENTO PERSONALIZADO?"
                   ImageProps={{ source: '/images/assets/market-chat-bubbles.svg', leftPosition: '8px' }}
                   variant="success"
                   ButtonProps={{ label: 'Necesito Asistencia LUC', onClick: handleNavigateAssistedSearch, endIcon: <ArrowRightIcon /> }}
        />
    )
}

export default FlyerAssistedSearchLuc;