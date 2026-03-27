import {
    AdHistoryView,
    AdViewDetail,
    AdViewFields
} from "../../../types/ad/adData";
import DrawerBase from "../../../components/misc/DrawerBase";

import React, {useEffect, useState} from "react";
import {HttpAds} from "../../../http/ad/httpAds";
import AdHistoryDrawerContent from "./AdHistoryDrawerContent";

interface AdsHistoryDrawerProps {
    open: boolean;
    onClose: () => void;
    adDetail: AdViewDetail
}


const AdsHistoryDrawer = ({open, onClose, adDetail} : AdsHistoryDrawerProps) => {
    const [history, setHistory] = useState<AdHistoryView[]>()
    
    useEffect(() => {
        if (open)
            HttpAds.getHistoricData(adDetail[AdViewFields.Id]).then(setHistory)
        else 
            setHistory(undefined)
    }, [open, adDetail]);
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onClose}
                    title={`Historial`}
        >
            <AdHistoryDrawerContent history={history}/>
        </DrawerBase>
    )
}


export default AdsHistoryDrawer