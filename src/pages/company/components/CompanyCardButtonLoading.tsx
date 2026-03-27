import React from "react";
import {Skeleton} from "@mui/lab";
import {Box, Card, Grid, Stack} from "@mui/material";

const AMOUNT_BODY_LOADING = 2;

function CompanyCardButtonLoading() {
    return (
        <Box height={'100%'}>
            <Card>
                <Stack spacing={1.875}
                       justifyContent={'space-between'}
                       height={1}
                >
                    <Stack direction={{ xs: 'column-reverse', md: 'row' }}
                           justifyContent={'space-between'}
                           spacing={1}
                           width={1}
                    >
                        <Stack direction={'row'} spacing={1.875} width={1}>
                            <Skeleton variant={'rounded'}
                                      width={'48px'}
                                      height={'48px'}
                            />
                            
                            <Stack width={0.8}>
                                <Skeleton variant={'text'}
                                          width={'80%'}
                                          height={'fit-content'}
                                />
                                <Skeleton variant={'text'}
                                          width={'20%'}
                                          height={'fit-content'}
                                />
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack spacing={1}>
                        <Grid container spacing={2} paddingY={1} sx={{ marginLeft: '-16px !important', marginTop: '-16px !important' }}>

                            {
                                Array.from({ length: AMOUNT_BODY_LOADING }).map((_, idx) => (
                                    <Grid item xs={12} md={6}
                                          key={`bodyLoadingSkeleton_${idx}`}
                                    >
                                        <Skeleton variant={'text'}
                                                  width={'80%'}
                                                  height={'fit-content'}
                                        />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Stack>
                </Stack>
            </Card>
        </Box>
    )
}

export default CompanyCardButtonLoading;