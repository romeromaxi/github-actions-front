import React from "react";
import {Box, Card, CardContent, Stack, Typography} from "@mui/material";

interface MarketAdvertisingBannersProps {
    title: string,
    description: string,
    srcImage: string,
    actions: React.ReactElement
}

const MarketAdvertisingBanners = ({title, description, srcImage, actions} : MarketAdvertisingBannersProps) => {

    return (
        <Card sx={{width: '100%', padding: '56px !important'}}>
            <CardContent>
                <Stack direction={'row'} width={'100%'}>
                    <Stack justifyContent={'space-between'} flex={1}>
                        <Stack spacing={2}>
                            <Typography variant={'h2'}>{title}</Typography>
                            <Typography variant={'h4'} fontWeight={500} color={'#818992'}>
                                {description}
                            </Typography>
                        </Stack>

                        <Box width={'45%'}>
                            {actions}
                        </Box>
                    </Stack>

                    <Box
                        component={'img'}
                        flex={1}
                        sx={{
                            height: 'fit-content',
                            width: '100%',
                            m: '0 auto !important',
                        }}
                        src={srcImage}
                    />
                </Stack>
            </CardContent>
        </Card>
    )
}


export default MarketAdvertisingBanners