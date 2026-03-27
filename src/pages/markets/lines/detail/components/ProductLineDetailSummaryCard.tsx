import React, {useContext} from "react";
import {Skeleton} from "@mui/lab";
import {ProductLineDetailContext} from "../ProductLinePymeDetail";
import {Box, Button, Card, CardContent, Stack} from "@mui/material";
import {ProductLineFields, ProductLineView} from "types/lines/productLineData";
import ShoppingBagActionButton from "../../shoppingbag/ShoppingBagActionButton";
import { TypographyBase } from "components/misc/TypographyBase";
import {CheckIcon, PlusIcon} from "lucide-react";
import {EntityWithIdFields} from "types/baseEntities";
import ButtonHoverSwitch from "components/buttons/ButtonHoverSwitch";

export default function ProductLineDetailSummaryCard() {
    const { productLine } = useContext(ProductLineDetailContext);
    
    if (!productLine) return (<ProductLineDetailSummaryCardLoading />)
    
    return (
        <Card sx={{ height: 'fit-content', position: 'relative', boxShadow: 2 }}
        >
            <CardContent
                sx={{
                    width: 1,
                    position: 'relative', p: 0, m: 0
                }}
            >
                <Stack spacing={2}>
                    <Stack>
                        <TypographyBase color={'text.lighter'}>
                            Nombre de la línea:
                        </TypographyBase>
                        <TypographyBase variant={'h4'} fontWeight={500} sx={{ wordWrap: 'break-word' }}>
                            {productLine[ProductLineFields.Line]}
                        </TypographyBase>
                    </Stack>
                    
                    <Box pt={2}>
                        <Stack direction={'row'} width={1} justifyContent={'space-between'} alignItems={'center'} spacing={1}>
                            <ShoppingBagActionButton
                                productLine={{ ... productLine} as ProductLineView}
                                basic={false}
                                reloadCompanies={() => {}}
                                shoppingBagAddComponent={
                                    <Button size={'small'} color={'primary'} variant={'contained'} fullWidth
                                            startIcon={<PlusIcon />}
                                            id={`add-to-shopping-cart-line-detail${productLine[EntityWithIdFields.Id]}`}
                                    >
                                        Agregar a Solicitudes
                                    </Button>
                                }
                                shoppingBagRemoveComponent={
                                    <ButtonHoverSwitch size={'small'}
                                                       normalProps={{
                                                           color: 'primary', variant: 'outlined', startIcon: <CheckIcon />
                                                       }}
                                                       hoverProps={{
                                                           color: 'secondary', variant: 'outlined'
                                                       }}
                                                       hoverChildren={'Descartar'}
                                                       id={`remove-from-shopping-cart-line-detail${productLine[EntityWithIdFields.Id]}`}
                                                       fullWidth
                                    >
                                        Agregada
                                    </ButtonHoverSwitch>
                                }
                                fullWidth
                            />
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}

function ProductLineDetailSummaryCardLoading() {
    return (
        <Card sx={{ height: 'fit-content', position: 'relative', boxShadow: 2 }}>
            <CardContent
                sx={{
                    width: 1,
                    position: 'relative', p: 0, m: 0
                }}
            >
                <Stack spacing={1}>
                    <Stack direction={'row'} alignItems={'center'} mt={1} gap={1}>
                        <Skeleton variant={'circular'} width={40} height={40} />

                        <Skeleton variant={'text'} width={'40%'} height={'1rem'} />
                    </Stack>

                    <Stack
                        direction={'column'}
                        spacing={2}
                        justifyContent={'flex-start'}
                    >
                        <Skeleton variant={'text'} width={'80%'} />
                        <Skeleton variant={'text'} width={'80%'} />
                    </Stack>

                    <Box pt={2}>
                        <Skeleton variant={'text'} />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}