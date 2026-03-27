import {Box, Divider} from "@mui/material";

interface TrafficBarCurrentValueProps {
    color: string,
    value: number,
    valueAsPercent: number
}

function TrafficBarCurrentValue(props: TrafficBarCurrentValueProps) {
    return (
        <Box position={'relative'}
             height={0}
        >
            <Box position={'absolute'}
                 top={-60}
                 left={`${props.valueAsPercent}%`}
                 width={48}
                 height={48}
                 borderRadius={'50%'}
                 boxShadow={`inset 0 0 0 4px ${props.color}`}
                 fontFamily={'Poppins'}
                 fontSize={'.875rem'}
                 fontWeight={600}
                 display={'flex'}
                 alignItems={'center'}
                 justifyContent={'center'}
                 zIndex={3} 
                 sx={{ transform: "translateX(-50%)" }}
            >
                {props.value}

                <Box position={'absolute'}
                     top={'98%'}
                     left={'46%'}
                     zIndex={3}
                >
                    <Divider color={props.color}
                             orientation={'vertical'}
                             sx={{
                                 borderRadius: '0px 0px 15px 15px',
                                 borderColor: `${props.color} !important`,
                                 minHeight: '10px',
                                 minWidth: '4px',
                             }} 
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default TrafficBarCurrentValue;