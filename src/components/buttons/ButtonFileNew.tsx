import {Stack, Typography} from "@mui/material";
import {BaseIconWrapper, WrapperIcons} from "../icons/Icons";
import {CaretRight} from "phosphor-react";
import {ElementType} from "react";


interface ButtonFileNewProps {
    onClick: () => void,
    icon: ElementType,
    title: string
}


const ButtonFileNew = (props: ButtonFileNewProps) => {
    
    return (
        <Stack direction='row' alignItems='center' justifyContent='space-between' onClick={props.onClick}
               sx={{borderRadius: '16px', border: '2px solid #C3CCD7', backgroundColor: 'white !important', padding: '24px', cursor: 'pointer'}}
        >
            <Stack direction='row' alignItems='center' spacing={2}>
                <BaseIconWrapper Icon={props.icon} size={'md'} bg={'#F7FAFC'}/>
                <Typography variant={'h6'} fontWeight={500}>{props.title}</Typography>
            </Stack>
            <WrapperIcons Icon={CaretRight} size={'md'} />
        </Stack>
    )
}


export default ButtonFileNew