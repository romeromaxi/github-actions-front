import Cropper from "react-easy-crop";
import {useCallback, useMemo, useState} from "react";
import {Box, Button} from "@mui/material";
import DrawerBase from "components/misc/DrawerBase";

interface DrawerCropperImageProps {
    image?: File,
    shape?: 'rect' | 'round',
    cropSize: { width: number, height: number },
    onClose: () => void,
    onSaveImage: (file: File) => void,
    sx?: any
}

function DrawerCropperImage({ shape = 'rect', ...props}: DrawerCropperImageProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const imageURL = useMemo(() => (
        props.image ? URL.createObjectURL(props.image) : undefined
    ), [props.image])

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = useCallback(async () => {
        if (!props.image || !imageURL || !croppedAreaPixels) return;

        try {
            const croppedImageBlob = await getCroppedImg(
                imageURL,
                croppedAreaPixels,
                shape
            );

            const croppedFile = new File(
                [croppedImageBlob],
                props.image.name || 'image.jpg',
                { type: croppedImageBlob.type || 'image/jpeg' }
            );
            
            props.onSaveImage(croppedFile);

        } finally {
        }
    }, [props.image, imageURL, croppedAreaPixels, shape, props.onSaveImage]);
    
    return (
        <DrawerBase show={!!imageURL}
                    onCloseDrawer={props.onClose}
                    sx={{ zIndex: '999999 !important' }}
                    action={
                        <Button color={'primary'} 
                                variant={'contained'}
                                onClick={handleSave}>
                            Guardar
                        </Button>
                    }
        >
            <Box
                style={{
                    position: 'relative',
                    width: 200,
                    height: 200,
                    borderRadius: 12,
                    overflow: 'hidden',
                    margin: '0 auto',
                }}
            >
                {
                    !!imageURL &&
                        <Cropper image={imageURL} 
                                 crop={crop} 
                                 zoom={zoom} 
                                 aspect={1} 
                                 minZoom={0.01}
                                 cropShape={shape} 
                                 onCropChange={setCrop}
                                 restrictPosition={false}
                                 onCropComplete={onCropComplete} 
                                 onZoomChange={setZoom} 
                                 cropSize={props.cropSize} 
                                 style={{
                                     cropAreaStyle: {
                                         color: 'rgba(0, 0, 0, 0.5) !important', 
                                         border: '1px solid rgba(255, 255, 255, 0.35) !important', 
                                         ...props.sx
                                     }
                                 }}
                        />
                }
            </Box>
        </DrawerBase>
    )
}

async function getCroppedImg(
    imageSrc: string,
    crop: any,
    shape: 'rect' | 'round'
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

    if (shape === 'round') {
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = crop.width;
        maskCanvas.height = crop.height;
        const maskCtx = maskCanvas.getContext('2d')!;
        maskCtx.fillStyle = 'black';
        maskCtx.beginPath();
        maskCtx.arc(crop.width / 2, crop.height / 2, crop.width / 2, 0, 2 * Math.PI);
        maskCtx.fill();

        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskCanvas, 0, 0);
    }

    return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob!);
        }, 'image/png');
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // evita problemas CORS
        image.src = url;
    });
}

export default DrawerCropperImage;