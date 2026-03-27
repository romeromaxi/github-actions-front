import {DialogAlert} from "components/dialog";
import {useAppNavigation} from "hooks/navigation";
import {MarketRoute} from "routes/market/routeAppMarketData";

interface ProductLineUnavailableDialogProps {
    open: boolean
}

function ProductLineUnavailableDialog({ open }: ProductLineUnavailableDialogProps) {
    const { navigate } = useAppNavigation();
    
    const goToMarket = () => navigate(MarketRoute.MarketLanding);
    
    return (
        <DialogAlert open={open}
                     onClose={() => {}}                      
                     title={'Línea no disponible'} 
                     textContent={'La línea que intentás ver no existe o ya no se encuentra activa. Te invitamos a visitar nuestra tienda para explorar otras opciones'}
                     textClose={'Cerrar'}
                     textConfirm={'Ir a la tienda'}
                     onReject={goToMarket}
                     onConfirm={goToMarket}
        />
    )
}

export default ProductLineUnavailableDialog;
