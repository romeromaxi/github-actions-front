import {Dialog, DialogContent} from "@mui/material";
import BaseDialogTitle from "../../../../components/dialog/BaseDialogTitle";
import MarketLandingProductLinesAdvertising from "../../../markets/home/MarketLandingProductLinesAdvertising";
import {HttpProductLineChosen} from "../../../../http/line/httpProductLineChosen";


interface DialogSelectedLinesPreviewProps {
    open: boolean;
    onClose: () => void;
}


const DialogSelectedLinesPreview = ({open, onClose}: DialogSelectedLinesPreviewProps) => {
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth={'lg'}
                fullWidth
        >
            <BaseDialogTitle onClose={onClose} title={'Previsualización de líneas destacadas'} />
            <DialogContent>
                <MarketLandingProductLinesAdvertising hideViewAll loadLinesFn={HttpProductLineChosen.getSelectedProductLines}/>
            </DialogContent>
        </Dialog>
    )
}


export default DialogSelectedLinesPreview