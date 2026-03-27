import {useAction} from "../../../hooks/useAction";
import {Stack} from "@mui/material";
import {NavsTabHorizontal} from "../../../components/navs/NavsTab";
import ProductList from "../product/ProductList";
import ProductInstrumentList from "../product/ProductInstrumentList";
import ProductDestinyList from "../product/ProductDestinyList";
import ProductServiceList from "../product/ProductServiceList";
import NeedList from "../need/NeedList";
import ProductInstrumentTypes from '../product/ProductInstrumentTypes';

const InternalParametersPage = () => {
    const {setTitle} = useAction()
    
    setTitle('Parametrización de Productos')
    
    return (
        <Stack spacing={2}>
            <NavsTabHorizontal hideScroll lstTabs={[
                {
                    tabList: [
                        {label: 'Productos', default: true, content: <ProductList />, sx: {margin: '0px !important'}},
                        {label: 'Tipos de Instrumentos', content: <ProductInstrumentTypes />},
                        {label: 'Instrumentos', content: <ProductInstrumentList />},
                        {label: 'Destinos', content: <ProductDestinyList />},
                        {label: 'Servicios', content: <ProductServiceList />},
                        {label: 'Necesidades', content: <NeedList />}
                    ]
                }
            ]}
            />

            {
                
            }
        </Stack>
    )
}


export default InternalParametersPage