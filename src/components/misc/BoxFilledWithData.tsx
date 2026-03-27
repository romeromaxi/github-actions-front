import {ReactNode} from "react";
import {Box, SxProps, Stack} from "@mui/material";
import {TypographyBase} from "./TypographyBase";
import {Skeleton} from "@mui/lab";


interface BoxFilledWithDataProps {
    label: string;
    quantity?: number;
    icon: ReactNode;
    color: string;
    sx?: SxProps;
}


const BoxFilledWithData = (props: BoxFilledWithDataProps) => {
    return (
        <Box sx={{
            padding: '24px 16px',
            borderRadius: '16px',
            backgroundColor: '#F6F6F6',
            position: 'relative',
            minHeight: '-webkit-fill-available',
            ...props.sx
        }}>
            <Stack justifyContent="center">
                {
                    isNaN(props.quantity) ?
                        <Skeleton width={'50%'} />
                        :
                        <TypographyBase variant="h4" color={props.color}>
                            {props.quantity}
                        </TypographyBase>
                    
                }
                
                <TypographyBase variant="body3">
                    {props.label}
                </TypographyBase>
            </Stack>
            
            <Box sx={{ 
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C2C2C2'
            }}>
                {props.icon}
            </Box>
        </Box>
    )
}


export default BoxFilledWithData;
