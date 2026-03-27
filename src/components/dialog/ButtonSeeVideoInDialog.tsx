import React, {Fragment, useState} from "react";
import {Box, Button, Tooltip, Typography} from "@mui/material";
import DialogVideoSource from "./DialogVideoSource";
import {WrapperIcons} from "../icons/Icons";


interface ButtonSeeVideoInDialogProps {
    source: string;
    buttonText: string;
    icon?: React.ElementType;
}


const ButtonSeeVideoInDialog = ({source, buttonText, icon} : ButtonSeeVideoInDialogProps) => {
    const [open, setOpen] = useState<boolean>(false)
    
    return (
        <Fragment>
            {
                icon ?
                    <Tooltip title={buttonText}>
                        <Box display={'flex'} justifyContent={'center'} height={35} width={35} borderRadius={100}
                             sx={{cursor: 'pointer', placeItems: 'anchor-center', bgcolor: 'info.main'}} 
                             onClick={() => setOpen(true)}
                        >
                            <WrapperIcons Icon={icon} size={'md'} color={'white'} />
                        </Box>
                    </Tooltip>
                    :
                    <Button
                        onClick={() => setOpen(true)}
                        sx={{
                            marginLeft: 'auto',
                            borderRadius: 10,
                            bgcolor: 'info.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:hover': {
                                bgcolor: 'info.dark',
                            },
                        }}
                    >
                        <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                            {buttonText}
                        </Typography>
                    </Button>
            }
            <DialogVideoSource open={open}
                               onClose={() => setOpen(false)}
                               source={source}
            />
        </Fragment>
    )
}


export default ButtonSeeVideoInDialog