import {
    ProductLineChosenHistoryView,
    ProductLineChosenView,
    ProductLineFields
} from "../../../../types/lines/productLineData";
import DrawerBase from "../../../../components/misc/DrawerBase";
import {Stack} from "@mui/material";
import ProductLineHistoricDataContent from "./ProductLineHistoricDataContent";
import {useEffect, useState} from "react";
import {HttpProductLineChosen} from "../../../../http/line/httpProductLineChosen";
import {EntityWithIdFields} from "../../../../types/baseEntities";


interface DialogHistoryLineProps {
    open: boolean;
    onClose: () => void;
    selectedLine: ProductLineChosenView;
}


const DialogHistoryLine = ({open, onClose, selectedLine} : DialogHistoryLineProps) => {
    const [history, setHistory] = useState<ProductLineChosenHistoryView[]>()
    
    useEffect(() => {
        if (open)
            HttpProductLineChosen.getHistoriesByProductLineId(selectedLine[EntityWithIdFields.Id]).then(setHistory)
        else 
            setHistory(undefined)
    }, [selectedLine, open])
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onClose}
                    title={`Historial de ${selectedLine[ProductLineFields.Line]}`}
        >
            <Stack spacing={2}>
                <ProductLineHistoricDataContent history={history} />
            </Stack>
        </DrawerBase>
    )
}


export default DialogHistoryLine