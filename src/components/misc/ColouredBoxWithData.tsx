import {Box, Stack} from "@mui/material";
import {TypographyBase, TypographyBaseProps} from "./TypographyBase";
import {Skeleton} from "@mui/lab";
import {BoxProps} from "@mui/material/Box/Box";


interface ColouredBoxWithDataProps {
    label?: string;
    value?: number | string;
    loading?: boolean;
    color: string;
    bgcolor?: string;
    boxProps?: BoxProps,
    valueProps?: TypographyBaseProps
}



const ColouredBoxWithData = (props: ColouredBoxWithDataProps) => {
    
    return (
        <Box {...props.boxProps}
             sx={{
                padding: props.boxProps?.padding ? props.boxProps?.padding : '12px',
                borderRadius: '16px',
                position: 'relative',
                width: '100%', //manejamos el ancho desde afuera
                minHeight: '95px',
                backgroundColor: props.bgcolor ?? '#F6F6F6'
            }}
        >
            <Stack justifyContent={'space-between'} spacing={1}>
                {
                    props.label &&
                        <TypographyBase fontSize={16} fontWeight={500}>
                            {props.label}
                        </TypographyBase>
                }
                
                {
                    props.loading ?
                        <Skeleton />
                        :
                        <TypographyBase variant="h2" 
                                        fontWeight={600}
                                        {...props.valueProps}
                                        color={props.color}
                        >
                            {props.value}
                        </TypographyBase>
                }
            </Stack>
        </Box>
    )
}


export default ColouredBoxWithData