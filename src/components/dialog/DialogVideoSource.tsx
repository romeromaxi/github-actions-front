import {Dialog} from "@mui/material";

interface DialogVideoSourceProps {
    open: boolean,
    onClose: () => void,
    source: string,
    title?: string
}

function DialogVideoSource({ open, onClose, source, title }: DialogVideoSourceProps) {
    const isYouTube = source.includes("youtube.com") || source.includes("youtu.be");
    
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
                {
                    isYouTube ?
                        <iframe
                            width="550"
                            height="360"
                            src={source}
                            title={title || "Video"}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        :
                        <video width="550" height="360" autoPlay controls>
                            <source src={source} type="video/mp4"/>
                            Tu navegador no soporta el elemento de video.
                        </video>
                }
            </div>
        </Dialog>
    )
}

export default DialogVideoSource;