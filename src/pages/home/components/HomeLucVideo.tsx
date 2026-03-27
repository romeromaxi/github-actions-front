import {Dialog, DialogContent} from "@mui/material";
import BaseDialogTitle from "../../../components/dialog/BaseDialogTitle";

interface HomeLucVideoProps {
    open: boolean,
    onClose: () => void,
    
}


const HomeLucVideo = ({open, onClose} : HomeLucVideoProps) => {
    
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth='sm'
                fullWidth
                PaperProps={{
                    sx: { backgroundColor: 'transparent', boxShadow: 'none !important' }, elevation: 0
                }}
        >
            <div>
                <video width="550" height="360" autoPlay controls>
                    <source src="/images/home/video-presentacion.mp4" type="video/mp4"/>
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
        </Dialog>
    )
}


export default HomeLucVideo