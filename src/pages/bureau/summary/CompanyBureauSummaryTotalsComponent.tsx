import React from "react";
import {Button, Card, CardContent, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {Skeleton} from "@mui/lab";

interface CompanyBureauSummaryTotalsComponentProps {
    title: string,
    description: string,
    quantityHighlighted: number,
    total?: number,
    color: string,
    loading?: boolean,
    onClick: () => void
}

function CompanyBureauSummaryTotalsComponent(props: CompanyBureauSummaryTotalsComponentProps) {
    return (
        <Card variant={'infoBureau'}>
            <CardContent>
                <Stack spacing={1} height={1}
                       justifyContent={'space-between'}>
                    <Stack direction={{ xs: 'column', sm: 'row' }}
                           justifyContent={'space-between'}
                           spacing={1}
                    >
                        <Stack direction={'row'}
                               spacing={1}
                               alignItems={'end'}
                               width={'-webkit-fill-available'}
                        >
                            {
                                props.loading ?
                                    <Skeleton width={'70%'} />
                                    :
                                    <React.Fragment>
                                        <TypographyBase variant={'h3'}
                                                        fontSize={'3.5rem'}
                                                        lineHeight={'90%'}
                                                        color={props.color}
                                        >
                                            {`${props.quantityHighlighted} `}
                                        </TypographyBase>
                                        {
                                            !!props.total &&
                                                <TypographyBase variant={'h3'}
                                                                color={props.color}
                                                >
                                                    {`de ${props.total}`}
                                                </TypographyBase>
                                        }
                                    </React.Fragment>
                            }
                        </Stack>
    
                        <Button variant={'text'}
                                size={'small'}
                                onClick={props.onClick}
                                minPadding
                        >
                            Ver más
                        </Button>
                    </Stack>
                    
                    <Stack spacing={1}>
                        {
                            (props.loading && !props.title) ?
                                <Skeleton />
                                :
                                <TypographyBase variant={'h5'}>
                                    {props.title}
                                </TypographyBase>
                        }
                        
                        <TypographyBase variant={'body3'} color={'text.lighter'}>
                            {props.description}
                        </TypographyBase>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default CompanyBureauSummaryTotalsComponent;